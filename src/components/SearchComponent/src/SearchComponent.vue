<template>
  <c-form>
    <c-row
      v-for="(items, index) in renderData"
      v-show="index === 0 || showMore"
      :key="index"
    >
      <c-col
        v-for="item in items"
        :key="item.id"
        :span="item.span ? item.span : 4"
      >
        <c-form-item :label="item.label">
          <c-input />
        </c-form-item>
      </c-col>
    </c-row>
    <c-row v-show="renderData.length > 1" class="bar">
      <c-button @click="show = !show">
        {{ showMoreText }}
      </c-button>
    </c-row>
  </c-form>
</template>
<script>
export default {
  name: "SearchComponent",
  props: {
    formData: {
      type: Array,
      default: () => [
        { label: "对象类型", id: 1 },
        { label: "招牌名称", id: 2 },
        { label: "统一代码", id: 3 },
        { label: "属地", id: 4 },
        { label: "地址", id: 5 },
        { label: "经营类型", id: 6 },
        { label: "社区", id: 7 },
        { label: "街道", id: 8 },
        { label: "统一社会信用代码", id: 9, span: 8 },
        { label: "门牌号", id: 10 },
      ],
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    showMore() {
      if (this.renderData.length <= 1) return false;
      return this.show;
    },
    showMoreText() {
      return this.showMore ? "收起" : "展开";
    },
    renderData() {
      const stack = [];
      let acc = 0;
      let list = [];
      this.formData.forEach((item, index) => {
        acc += item.span || 4;
        if (acc > 24) {
          stack.push(list);
          list = [item];
          acc = item.span || 4;
        } else if (acc === 24 && index !== this.formData.length - 1) {
          list.push(item);
          stack.push(list);
          list = [];
          acc = 0;
        } else if (index === this.formData.length - 1) {
          list.push(item);
          stack.push(list);
          list = [];
          acc = 0;
        } else {
          list.push(item);
        }
      });
      return stack;
    },
  },
};
</script>
<style lang="scss">
.bar {
  text-align: right;
}
</style>
