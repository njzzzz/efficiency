export declare function realType(may: any): any;
export declare function realTypeEqual(may: any, type: any): boolean;
export declare function useConfig(): {
    label: ({ item, schema }: {
        item: any;
        schema: any;
    }) => any;
};
export declare function proxyItem(list: any, index: any, item: any, model: any): void;
export declare function generatorRules(item: any, runtimeModel: any, elFormRef: any): void;
export declare function generatorDependOn(item: any, runtimeModel: any): any[];
export declare function generatorOptions(item: any, runtimeModel: any): void;
export declare function generatorReactiveModelPropsDefaultValue(item: any, runtimeModel: any): void;
export declare function dealWithMixTypeValue(item: any, runtimeModel: any): void;
export declare function patchReactiveProps(item: any): void;
export declare function generatorWithObjectValue(item: any, runtimeModel: any, runtimeSchema: any): void;
export declare function generatorOptionsByOptionProps(item: any, runtimeModel: any, runtimeSchema: any): void;
