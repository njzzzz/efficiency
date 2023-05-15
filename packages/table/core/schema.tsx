import type { Form, FormItem } from "@slacking/form";
interface TableSchema extends Form {
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
  treeProps: any;
  /**
   * 表格表单model默认key
   */
  prop: string;
  ons: Record<string, any>;
}
interface TableColumn extends FormItem {
  scopedSlots: any;
  list: Partial<TableColumn>[];
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
