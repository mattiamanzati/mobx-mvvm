import {createTagDecorator} from '../utils/decorators'

export const INPUT_ANNOTATION = '@mobx-mvvm/INPUT'
export const input = createTagDecorator(INPUT_ANNOTATION)

export const OUTPUT_ANNOTATION = '@mobx-mvvm/OUTPUT'
export const output = createTagDecorator(OUTPUT_ANNOTATION)

export interface IViewModel{
    dispose?(): void
}

export interface IMountAware{
    willMount?(): void
    didMount?(): void
    willUnmount?(): void
}