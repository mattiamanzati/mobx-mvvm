import * as React from 'react'
import {observer} from 'mobx-react'
import {IView, IViewProps, IComponentProps, IViewModel, IComponentDefinition, IComponentState, ILinkDisposer} from './interfaces/index'
import {createLink} from './createLink'
import {createModel} from './createModel'
import {disposeModel} from './disposeModel'


export function createComponent<TComponentProps>(definition: IComponentDefinition){
    // pick props
    const {
        view,
        displayName = 'UnnamedComponent'
    } = definition

    // warn about required props
    if(!view){
        throw "[mobx-mvvm] ERROR! view should be provided in order to create a component!"
    }

    return (ViewModel: any): React.ComponentClass<TComponentProps & IComponentProps<IViewModel>> => {
        // shortcuts
        type TProps = TComponentProps & IComponentProps<IViewModel>

        // hack because mobx-react complains about a component being either stateless or class component
        const ObserverComponent = observer(view as React.StatelessComponent<TProps>)

        // the new component to return
        class NewComponent extends React.Component<TProps, IComponentState>{
            // dispose the link between the ViewModel an the React Component
            linkDisposer: ILinkDisposer = null
            // default component state 
            state: IComponentState = {model: null, shouldDispose: false}

            constructor(props: TProps, ctx: any){
                super(props, ctx)
                this.state = createModel(this.state, props, ctx, ViewModel)
                this.linkDisposer = createLink(this.state, props, definition)
            }

            componentWillReceiveProps(newProps: TProps){
                // first, dispose any old link
                if(this.linkDisposer) this.linkDisposer()
                // then create the new one
                const newState = createModel(this.state, newProps, this.context, ViewModel)
                this.linkDisposer = createLink(newState, newProps, definition)
            }

            componentWillUnmount(){
                // first, dispose any old link
                if(this.linkDisposer) this.linkDisposer()
                // dispose the model ref, if any
                if(this.props.modelRef){
                    this.props.modelRef(null)
                }
                // ...then dispose the model
                disposeModel(this.state)
            }

            render(){
                // just wraps the component
                return React.createElement(ObserverComponent, Object.assign({}, this.props, {model: this.state.model}), this.props.children)
            }
        }

        // set some props on the component
        const NewComponentClass = NewComponent as React.ComponentClass<TComponentProps & IComponentProps<IViewModel>>
        NewComponentClass.displayName = displayName
        NewComponentClass.contextTypes = {
            resolver: React.PropTypes.any
        }

        // return the new component
        return NewComponentClass
    }
}