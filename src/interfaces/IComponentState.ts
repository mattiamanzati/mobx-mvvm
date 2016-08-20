import {IViewModel} from './IViewModel'

export interface IComponentState{
    model: IViewModel
    shouldDispose: boolean
}