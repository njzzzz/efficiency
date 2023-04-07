import type { Form, FormItem } from "@slacking/form";
interface TableSchema extends Form {
  list: Partial<TableColumn>[];
  hideLabelText: boolean;
  hideHeaderRequiredAsterisk: boolean;
}
interface TableColumn extends FormItem {
  scopedSlots: any;
  type: string;
  list: Partial<FormItem>[];
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
