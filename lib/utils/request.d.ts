interface IGlobalConfig {
    baseUrl: string;
    getHeaders: () => object;
    handleRes: (data: any, resolve: any, reject: any) => void;
}
declare const _default: (globalConfig: IGlobalConfig) => (url: string, data?: any) => Promise<unknown>;
export default _default;
