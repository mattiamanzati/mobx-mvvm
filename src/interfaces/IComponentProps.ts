import {IViewModel} from './IViewModel'

export interface IComponentProps<TViewModel extends IViewModel>{
    model: TViewModel
    modelRef: (model: TViewModel) => void
}