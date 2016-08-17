import * as React from 'react'
import {IViewModel} from './ViewModel'

/**
 * By a given key, resolve to a ViewModel instance.
 */
export interface IViewModelResolver{
    (key: any, props?: any): IViewModel
}

export interface IViewModelLocatorProps{
    resolver: IViewModelResolver
}

export interface IViewModelLocatorContext{
    resolver: IViewModelResolver
}

/**
 * This class is used to resolve ViewModels.
 */
export class ViewModelLocator extends React.Component<IViewModelLocatorProps, any>{
    getChildContext(): IViewModelLocatorContext{
        return {
            resolver: this.props.resolver
        }
    }

    render(){
        // just pass down the given component
        return React.Children.only(this.props.children)
    }
}

// provide context-needed props
const ViewModelLocatorClass = ViewModelLocator as React.ComponentClass<IViewModelLocatorProps>
ViewModelLocatorClass.childContextTypes = {
    resolver: React.PropTypes.func
}

/**
 * Creates a ViewModel instance and returns it.
 */
export function createViewModel<TViewModel extends IViewModel>(context: any, key: any): TViewModel{
    return context && context.resolver ? context.resolver(key) : new key()
}