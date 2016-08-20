import {IViewModel} from './IViewModel'

export interface IModelResolver{
    (key: any): IViewModel
}