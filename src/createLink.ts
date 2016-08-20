import {runInAction} from 'mobx'
import {IComponentState, ILinkDisposer, IComponentDefinition} from './interfaces/index'
import {EventEmitter} from './EventEmitter'
import {getInputs, getOutputs} from './decorators'

export function createLink(state: IComponentState, props: Object, definition: IComponentDefinition): ILinkDisposer{
    const {
        inputs = [],
        outputs = []
    } = definition
    const {
        model
    } = state
    var disposers = []

    // merge model-decorators-declared inputs
    const inputProperties = inputs.concat(getInputs(model))
    const outputProperties = outputs.concat(getOutputs(model))

    // inputs just copy props to the model
    inputProperties.forEach(propName => {
        // does the props exists on both model and props?
        if(props.hasOwnProperty(propName) && model.hasOwnProperty(propName)){
            // just set the value
            runInAction(() => model[propName] = props[propName])
        }
    })

    // outputs just subscribe the prop
    outputProperties.forEach(propName => {
        // does the props exists on both model and props?
        if(props.hasOwnProperty(propName) && model.hasOwnProperty(propName)){
            // ensure it's an EventEmitter instance
            const event = model[propName] as EventEmitter<any>
            if(event && event instanceof EventEmitter){
                // subscribe the given prop to the event emitter
                disposers.push(event.subscribe(props[propName]))
            }
        }
    })

    return () => {
        // cleanup disposers
        disposers.map(disposer => disposer())
        disposers = []
    }
}