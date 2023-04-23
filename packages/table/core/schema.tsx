import type { Form, FormItem } from "@slacking/form";
interface TableSchema extends Form {
  list: Partial<TableColumn>[];
  hideLabelText: boolean;
  hideHeaderRequiredAsterisk: boolean;
  showOverflowTooltip: boolean;
  hideRequiredAsterisk: boolean;
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
