import * as React from 'react'
import {IViewModel} from './IViewModel'

/**
 * A View is basically a React component receiving a "model" prop 
 * which is a ViewModel instance.
 * Note that this component will be wrapped in order to create the actual
 * MVVM component.
 */
export interface IViewProps<TViewModel extends IViewModel>{
    model: TViewModel
}

/**
 * A View is basically a React component receiving a "model" prop 
 * which is a ViewModel instance.
 * Note that this component will be wrapped in order to create the actual
 * MVVM component.
 */
export type IView<TViewModel extends IViewModel> = 
    React.ComponentClass<IViewProps<TViewModel>> |
    React.StatelessComponent<IViewProps<TViewModel>>