import * as React from 'react'
import {observer} from 'mobx-react'
import {IView, IViewProps} from './View'
import {IViewModel, INPUT_ANNOTATION, OUTPUT_ANNOTATION} from './ViewModel'
import {createViewModel} from './ViewModelLocator'
import {IEventListenerDisposer} from '../utils/createEvent'
import {getPropertiesWithTag} from '../utils/decorators'

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
                // cleanup subscriptions
                this.disposers.map(disposer => disposer())
                this.disposers = []

                // if no model, do nothing!
                if(!model) return

                // get input and output props
                const inputProps = inputs.concat(getPropertiesWithTag(INPUT_ANNOTATION, model))
                const outputProps = outputs.concat(getPropertiesWithTag(OUTPUT_ANNOTATION, model))

                // copy over input props
                for(var i = 0; i < inputProps.length; i++){
                    const input = inputProps[i]
                    if((<any>props)[input]){
                        (<any>model)[input] = (<any>props)[input]
                    }
                }

                // subscribe output events
                for(var i = 0; i < outputProps.length; i++){
                    const output = outputProps[i]
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

            callLifeCycleMethod(methodName: string, ...args: any[]){
                const {model} = this.state
                if(model && (<any> model)[methodName]){
                    (<any> model)[methodName](...args)
                }
            }

            constructor(props: TProps & IComponentProps<TViewModel>, ctx: any){
                super(props, ctx)
                this.state = this.nextState(props, {model: null, shouldDispose: false}, this.context)
            }

            componentWillReceiveProps(nextProps: TProps & IComponentProps<TViewModel>){
                this.setState(this.nextState(nextProps, this.state, this.context))
            }

            componentWillMount(){
                this.callLifeCycleMethod('willMount')
            }
            componentDidMount(){
                this.callLifeCycleMethod('didMount')
            }
            componentWillUnmount(){
                this.callLifeCycleMethod('willUnmount')
                this.updateModel(null, this.props)
                if(this.state.model && this.state.shouldDispose){
                    this.state.model.dispose()
                }
            }

            render(){
                return React.createElement(ObserverView, Object.assign({}, this.props, {model: this.state.model}), this.props.children)
            }
        }

        // return the new component
        const NewComponentClass = NewComponent as React.ComponentClass<any>
        NewComponentClass.displayName = displayName
        NewComponentClass.contextTypes = {
            resolver: React.PropTypes.func
        }

        return NewComponentClass
    }
}