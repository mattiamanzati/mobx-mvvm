import {IViewModel} from './IViewModel'

export interface IViewModelResolver{
    (key: any): IViewModel
}