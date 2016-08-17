import * as React from 'react'
import {IViewModel} from './ViewModel'

export interface IViewProps<TViewModel extends IViewModel>{
    model: TViewModel
}

export type IView<TViewModel extends IViewModel> = React.ComponentClass<IViewProps<TViewModel>> | React.StatelessComponent<IViewProps<TViewModel>>