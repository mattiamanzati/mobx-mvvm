import * as React from 'react'
import {IViewModel} from './ViewModel'

export interface IViewProps<TViewModel extends IViewModel>{
    dataSource: TViewModel
}

export interface IView<TViewModel extends IViewModel>{
    (props: IViewProps<TViewModel>): React.ReactElement<any>
}