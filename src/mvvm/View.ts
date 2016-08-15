import * as React from 'react'
import {IViewModel} from './ViewModel'

export interface IViewProps<TViewModel extends IViewModel>{
    source: TViewModel
}

export interface IView<TViewModel extends IViewModel>{
    (props: IViewProps<TViewModel>): React.ReactChild
}