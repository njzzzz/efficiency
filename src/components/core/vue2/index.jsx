import { defineComponent, watch } from 'vue'
import { adapter } from './adapter'

function init(list, model = {}) {
	const unWatches = []
	for (let index = 0; index < list.length; index++) {
		const item = list[index]
		if (item.dependOn) {
			const keys = Object.keys(item.dependOn)
			for (let index = 0; index < keys.length; index++) {
				const key = keys[index]
				const dependOnOptions = item.dependOn[key]
				const { handler, ...options } = dependOnOptions
				const unWatch = watch(
					() => model[key],
					(val, oldVal) => {
						handler(val, model, item, oldVal)
					},
					{ immediate: true, deep: false, ...options },
				)
				unWatches.push(unWatch)
			}
		}
		if (item.asyncOptions) {
			item.asyncOptions().then(opts => {
				item.options = opts
			})
		}
		if (item.list) {
			init(item.list, model)
		}
	}
	return unWatches
}
export default function anyFormVue() {
	this.render = props => {
		const Form = this.Form()
		const FormItem = this.FormItem()
		const renderComponent = this.renderComponent.bind(this)
		const Component = defineComponent({
			props: {
				schema: {},
				model: {},
			},
			setup(props) {
				const formMemo = {}
				// #TODO 不同的form使用同一个schema引用
				// const schema = reactive(cloneDeep(props.schema ?? {}));
				if (props.schema?.list?.length) {
					init(props.schema.list, props.model)
				} else {
					return () => null
				}
				return () => (
					<Form {...adapter.genFormProps(props.model, props.schema)}>
						{props.schema.list.map(item => {
							const InnerFormItem = renderComponent(item.type, {
								disabled:
									item.disabled || props.schema.disabled,
								readonly:
									item.readonly || props.schema.readonly,
							})
							return item.show !== false ? (
								<FormItem
									{...adapter.genFormItemProps(
										props.model,
										item,
										props.schema,
									)}
									key={item.prop}>
									<InnerFormItem
										{...adapter.genComponentProps(
											props.model,
											item,
											props.schema,
											formMemo,
										)}
										key={item.prop}></InnerFormItem>
								</FormItem>
							) : null
						})}
					</Form>
				)
			},
		})
		return <Component {...props}></Component>
	}
}
