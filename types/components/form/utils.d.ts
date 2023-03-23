export declare const convertListValueLabel: (list?: any[], from?: {
    value: string;
    label: string;
    children: string;
}, to?: {
    value: string;
    label: string;
    children: string;
}) => any[];
export declare const convertListToMap: (list: any[], { value, children }: {
    value?: string;
    children?: string;
}) => {};
export declare function undefinedAndTrueAsTrue(val: any): boolean;
