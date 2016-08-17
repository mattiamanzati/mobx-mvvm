import * as React from 'react'
import {observer} from 'mobx-react'
import {IView, IViewProps} from './View'
import {IViewModel} from './ViewModel'
import {createViewModel} from './ViewModelLocator'
import {IEventListenerDisposer} from '../utils/createEvent'

export interface IComponentDeclaration<TViewModel extends IViewModel>{
    view: IView<TViewModel>
    displayName?: string,
    inputs?: string[]
    outputs?: string[]
}

export interface IComponentState<TViewModel extends IViewModel>{
    model: TViewModel
    shouldDispose: boolean
}

export interface IComponentProps<TViewModel extends IViewModel>{
    model: TViewModel
}

export function createComponent<TProps, TViewModel extends IViewModel>(componentDefinition: IComponentDeclaration<TViewModel>){
    // get props from definition
    const {
        view,
        displayName, 
        inputs = [], 
        outputs = []
    } = componentDefinition

    // make the children view mobx-aware
    const ObserverView = observer(view as React.StatelessComponent<IViewProps<TViewModel>>)

    // returns a function to create the component for a view model
    return (viewModel: any) => {

        class NewComponent extends React.Component<TProps & IComponentProps<TViewModel>, IComponentState<TViewModel>>{

            disposers: IEventListenerDisposer[] = []

            updateModel(model: TViewModel, props: TProps & IComponentProps<TViewModel>){
                // if no model, do nothing!
                if(!model) return

                // cleanup subscriptions
                this.disposers.map(disposer => disposer())
                this.disposers = []

                // copy over input props
                for(var i = 0; i < inputs.length; i++){
                    const input = inputs[i]
                    if((<any>props)[input]){
                        (<any>model)[input] = (<any>props)[input]
                    }
                }

                // subscribe output events
                for(var i = 0; i < outputs.length; i++){
                    const output = outputs[i]
                    if((<any>props)[output] && (<any>model)[output] && typeof (<any>model)[output].subscribe === 'function'){
                        this.disposers.push((<any>model)[output].subscribe((<any>props)[output]))
                    }
                }
            }

            nextState(props: TProps & IComponentProps<TViewModel>, state: IComponentState<TViewModel>, ctx: any): IComponentState<TViewModel> {
                // props given model is different from the internal one
                if(props.model && props.model !== state.model){
                    // dispose the current model, if needed
                    if(state.model && state.shouldDispose){
                        state.model.dispose()
                    }

                    // update model props
                    this.updateModel(props.model, props)

                    // return the new one
                    return {model: props.model, shouldDispose: false}
                }

                // no model was present, so we need to internally create it
                if(!state.model){
                    const model = createViewModel<TViewModel>(this.context, viewModel)

                    // update model props
                    this.updateModel(model, props)

                    return {model, shouldDispose: true}
                }

                // nothing changed so far
                return state
            }

            constructor(props: TProps & IComponentProps<TViewModel>, ctx: any){
                super(props, ctx)
                this.state = this.nextState(props, {model: null, shouldDispose: false}, this.context)
            }

            componentWillReceiveProps(nextProps: TProps & IComponentProps<TViewModel>){
                this.setState(this.nextState(nextProps, this.state, this.context))
            }

            render(){
                return React.createElement(ObserverView, Object.assign({}, this.props, {model: this.state.model}), this.props.children)
            }
        }

        // return the new component
        const NewComponentClass = NewComponent as React.ComponentClass<any>
        NewComponentClass.displayName = displayName

        return NewComponentClass
    }
}