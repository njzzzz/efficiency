export declare function registerComponents(components?: any[]): void;
export declare function renderComponent(name: any, { readonly, disabled }?: {
    readonly: boolean;
    disabled: boolean;
}): any;
export declare function registerComponent({ name, component, ...rest }: {
    [x: string]: any;
    name: any;
    component: any;
}): void;
export declare function useFormRegister(): {
    registerComponent: typeof registerComponent;
    registerComponents: typeof registerComponents;
    renderComponent: typeof renderComponent;
};
