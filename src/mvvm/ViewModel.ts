export interface IViewModel{
    init?(): void
    dispose?(): void
}

export interface IMountAware{
    willMount?(): void
    didMount?(): void
    willUnmount?(): void
}