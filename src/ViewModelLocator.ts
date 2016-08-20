import * as React from 'react'
import {IViewModel, IViewModelResolver} from './interfaces/index'

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
        // provides the resolver function to children components
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