import {IView} from './IView'
import {IViewModel} from './IViewModel'

export interface IComponentDefinition{
    view: IView<IViewModel>
    displayName?: string
    inputs?: string[]
    outputs?: string[]
}