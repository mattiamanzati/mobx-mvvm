export interface IViewModel{
    dispose?()
}

export interface IMountAware{
    willMount?()
    didMount?()
    willUnmount?()
}