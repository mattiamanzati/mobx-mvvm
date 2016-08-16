import * as React from 'react'
import {observer} from 'mobx-react'
import {IViewProps} from '../mvvm/View'
import {IViewModel, IMountAware} from '../mvvm/ViewModel'

export interface INewable<T>{
    new (...args: any[]): T
}

export interface IComponentProps<TViewModel extends IViewModel>{
    dataSource: TViewModel
}

export interface IComponentState<TViewModel extends IViewModel>{
    dataSource: TViewModel
    shouldDispose: boolean
}

function callLifeCycleMethod(dataSource: IMountAware, methodName: string, ...args: any[]){
    if(dataSource && dataSource[methodName]){
        dataSource[methodName](...args)
    }
}

export function createComponent<TProps, TViewModel extends IViewModel>(
        ViewModelClass: INewable<TViewModel>,
        BaseComponent: React.StatelessComponent<IViewProps<TViewModel>>
    ): React.ComponentClass<IComponentProps<TViewModel>>
export function createComponent<TProps, TViewModel extends IViewModel>(
        ViewModelClass: INewable<TViewModel>,
        BaseComponent: React.ComponentClass<IViewProps<TViewModel>>
    ): React.ComponentClass<IComponentProps<TViewModel>>
export function createComponent<TProps, TViewModel extends IViewModel>(
        ViewModelClass: INewable<TViewModel>,
        BaseComponent: any
    ): React.ComponentClass<IComponentProps<TViewModel>>{

    // make the base component observe mobx changes 
    const ObserverBaseComponent = observer(BaseComponent)

    // returns a new component which automatically builds a ViewModel instance if needed
    class Component extends React.Component<IViewProps<TViewModel>, any>{
        state: IComponentState<TViewModel> = {
            dataSource: null,
            shouldDispose: false
        }

        constructor(props: IComponentProps<TViewModel>, ctx: any){
            super(props, ctx)
            this.state = this.newStateFor(props)
        }

        componentWillReceiveProps(newProps: IComponentProps<TViewModel>){
            this.setState(this.newStateFor(newProps))
        }

        componentWillMount(){
            const {dataSource} = this.state
            callLifeCycleMethod(dataSource, 'willMount')
        }


        componentDidMount(){
            const {dataSource} = this.state
            callLifeCycleMethod(dataSource, 'didMount')
        }

        componentWillUnmount(){
            // pick some state vars
            const {shouldDispose, dataSource} = this.state

            // call methods
            callLifeCycleMethod(dataSource, 'willUnmount')

            // if ViewModel instance was created internally, dispose it.
            if(dataSource && shouldDispose){
                dataSource.dispose()
            }

            // cleanup the state
            this.setState({dataSource: null, shouldDispose: false})
        }

        newStateFor(newProps: IComponentProps<TViewModel>): IComponentState<TViewModel>{
            const {dataSource} = newProps

            // no data source is provided, either stored in state, so create it!
            if(!dataSource && !this.state.dataSource){
                return {
                    dataSource: new ViewModelClass(),
                    shouldDispose: true
                }
            }
            
            // we are changing the dataSource externally
            if(dataSource !== this.state.dataSource){
                // if ViewModel instance was created internally, dispose it.
                if(this.state.dataSource && this.state.shouldDispose){
                    this.state.dataSource.dispose()
                }
                // inject the new one
                return {dataSource, shouldDispose: false}
            }
        }


        render(){
            return React.createElement(ObserverBaseComponent, {
                dataSource: this.state.dataSource
            }, this.props.children)
        }
    }

    return Component
}