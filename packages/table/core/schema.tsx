import type { Form, FormItem } from "@slacking/form";
interface TableSchema extends Form {
  list: Partial<TableColumn>[];
}
interface TableColumn extends FormItem {
  scopedSlots: any;
  type: string;
  list: Partial<FormItem>[];
  subHeaders: Partial<TableColumn>[];
}

export function defineTableSchema(schema: Partial<TableSchema>) {
  return schema;
}
export function defineTableColumns(columns: Partial<TableColumn>[]) {
  return columns;
}
