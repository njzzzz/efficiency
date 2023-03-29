import { defineComponent } from "vue";
export default defineComponent({
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: "",
    },
  },
  setup(props) {
    return () => <span>{props.value}</span>;
  },
});
