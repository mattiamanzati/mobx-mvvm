export interface IViewModel{
    dispose?(): void
}

export interface IMountAware{
    willMount?(): void
    didMount?(): void
    willUnmount?(): void
}