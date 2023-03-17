import { defineComponent } from 'vue'
export function renderForm(Form) {
	return defineComponent({
		components: { Form },
		props: {
			model: {
				type: Object,
				default: () => ({}),
			},
			schema: {
				type: Object,
				default: () => ({}),
			},
		},
		setup(props) {
			return () => <Form model={props.model} {...props.schema}></Form>
		},
	})
}
