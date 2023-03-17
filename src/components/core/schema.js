export default {
	name: '表单名称',
	readonly: false,
	disabled: false,
	coreVersion: '1.0',
	labelPosition: 'right',
	labelWidth: '',
	inline: true,
	gutter: 16,
	symbol: ':',
	list: [
		{ type: 'AnyInput', prop: 'name', label: '姓名' },
		{ type: 'AnyInput', prop: 'sex', label: '性别' },
		{
			type: 'AnySelect',
			prop: 'lover',
			label: '爱好',
			async asyncOptions() {
				return [
					{ value: '1', label: '吃' },
					{ value: '2', label: '喝' },
					{ value: '3', label: '玩' },
					{ value: '4', label: '乐' },
				]
			},
			dependOn: {
				name: {
					handler(val, model, item, oldVal) {
						item.options = [
							{ value: '1', label: val },
							{ value: '2', label: '喝' },
							{ value: '3', label: '玩' },
							{ value: '4', label: '乐' },
						]
					},
					immediate: false,
				},
			},
		},
		{
			type: 'AnyInputNumber',
			prop: 'age',
			label: '年龄',
			dependOn: {
				name: {
					handler(val, model, item, oldVal) {
						console.log(
							'【LOG】  val, model, item, oldVal ---->',
							val,
							model,
							item,
							oldVal,
						)
						model.sex = val
						item.label = Math.random().toString()
					},
					immediate: false,
				},
			},
		},
		{
			type: 'AnyInput',
			prop: 'remark',
			label: '备注',
			dependOn: {
				name: {
					handler(val, model, item, oldVal) {
						console.log(
							'【LOG】  val, model, item, oldVal ---->',
							val,
							model,
							item,
							oldVal,
						)
						model.sex = val
						item.show = Math.random() > 0.5
					},
					immediate: false,
				},
			},
		},
		{
			type: 'AnyMix',
			align: 'bottom',
			list: [
				{ type: 'AnyInput', prop: 'name1', label: '姓名_1', span: 5 },
				{ type: 'AnyInput', prop: 'sex1' },
				{ type: 'AnyInput', prop: 'sex2' },
			],
		},
	],
}
