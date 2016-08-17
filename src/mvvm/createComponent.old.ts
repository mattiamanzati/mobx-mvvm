import * as React from 'react'
import {observer} from 'mobx-react'
import {IViewProps} from './View'
import {IViewModel, IMountAware} from './ViewModel'

export interface IComponentProps<TViewModel extends IViewModel>{
    viewModel: TViewModel
    viewModelRef: (viewModel: TViewModel) => void
}

export interface IComponentState<TViewModel extends IViewModel>{
    viewModel: TViewModel
    shouldDispose: boolean
}

function getDisplayName<P>(WrappedComponent: React.ComponentClass<P> | React.SFC<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * This will return the next component state
 */
function getNextComponentState<TViewModel extends IViewModel>(
    viewModelFactory: () => TViewModel,
    currentState: IComponentState<TViewModel>,
    nextProps: IComponentProps<TViewModel>
){

    // a viewModel has been linked, we should dispose it.
    if(nextProps.viewModel && currentState.viewModel !== nextProps.viewModel){
        // is there an already set viewModel?
        disposeCurrentViewModel(currentState)

        // fire view model ref
        if(nextProps.viewModelRef) nextProps.viewModelRef(nextProps.viewModel)

        return {viewModel: nextProps.viewModel, shouldDispose: false}
    }

    if(!currentState.viewModel){
        // no viewModel has been linked yet, create a new one
        const viewModel = nextProps.viewModel ? nextProps.viewModel : viewModelFactory()
        const shouldDispose = nextProps.viewModel ? false : true

        // fire view model ref
        if(nextProps.viewModelRef) nextProps.viewModelRef(viewModel)

        return {viewModel, shouldDispose}
    }

    return currentState
}

function disposeCurrentViewModel<TViewModel extends IViewModel>(
    currentState: IComponentState<TViewModel>
){
    if(currentState.viewModel && currentState.shouldDispose){
        currentState.viewModel.dispose()
    }
}

/**
 * This function will connect and create a link between a ViewModel and a View.
 */
export function createComponent<TViewModel extends IViewModel>(
        ViewModelClass: INewable<TViewModel>,
        BaseComponent: React.ComponentClass<IViewProps<TViewModel>> | React.SFC<IViewProps<TViewModel>>,
        componentName?: string
    ){

        // the base component should be made mobx-aware
        const ObserverBaseComponent = observer(BaseComponent as React.ComponentClass<IViewProps<TViewModel>>) // in fact, it will also handle SFC

        // create a new component to be returned
        class ConnectedComponent extends React.Component<IComponentProps<TViewModel>, IComponentState<TViewModel>>{
            constructor(props, ctx){
                super(props, ctx)
                this.state = getNextComponentState(() => new ViewModelClass(), {viewModel: null, shouldDispose: false}, props)
            }

            componentWillReceiveProps(nextProps: IComponentProps<TViewModel>){
                this.setState(getNextComponentState(() => new ViewModelClass(), this.state, nextProps))
            }

            componentWillUnmount(){
                disposeCurrentViewModel(this.state)
            }

            render(){
                return React.createElement(ObserverBaseComponent, {viewModel: this.state.viewModel}, this.props.children)
            }
        }

        // display a user-friendly component name
        const ConnectedComponentClass = (ConnectedComponent as React.ComponentClass<IComponentProps<TViewModel>>)
        ConnectedComponentClass.displayName = componentName ? componentName : 'Component(' + getDisplayName(BaseComponent) + ')'

        // return the new component
        return ConnectedComponentClass
    }