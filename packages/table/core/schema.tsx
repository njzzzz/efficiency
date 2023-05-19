import type { Form, FormItem } from "@slacking/form";
export interface TableSchema extends Form {
  list: Partial<TableColumn>[];
  hideLabelText: boolean;
  hideHeaderRequiredAsterisk: boolean;
  showOverflowTooltip: boolean;
  hideRequiredAsterisk: boolean;
  multiple: boolean;
  /**
   * 多选或单选的主键
   */
  rowKey: any;
  /**
   * 多选或单选的值
   */
  value: any;
  /**
   * 折叠表格treeProps配置需要组件支持，element-ui目前支持
   */
  treeProps: any;
  /**
   * 表格表单model默认key, 表格表单的值均存于这个键中
   */
  prop: string;
  /**
   * 事件监听
   */
  ons: Record<string, any>;
}
export interface TableColumn extends FormItem {
  scopedSlots: any;
  list: Partial<TableColumn>[];
  /**
   * 多级表头配置
   */
  subHeaders: Partial<TableColumn>[];
  hideLabelText: boolean;
  hideHeaderRequiredAsterisk: boolean;
}

export function defineTableSchema(schema: Partial<TableSchema>) {
  return schema;
}
export function defineTableColumns(columns: Partial<TableColumn>[]) {
  return columns;
}
