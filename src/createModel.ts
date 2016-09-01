import {IComponentState, IComponentProps, IViewModel, IComponentContext} from './interfaces/index'
import {disposeModel} from './disposeModel'

export function createModel(state: IComponentState, props: IComponentProps<IViewModel>, ctx: any, ViewModel: any): IComponentState{
    // pick some props
    const {
        resolver = (ViewModelClass: any) => new ViewModelClass()
    } = ctx as IComponentContext
    const {
        modelRef = () => true
    } = props

    // if model is passed from props and is new, set it
    if(props.model && state.model !== props.model){
        modelRef(props.model)
        disposeModel(state)
        return {model: props.model, shouldDispose: false}
    }

    // if no model is present, create it on the fly
    if(!state.model){
        const model = resolver(ViewModel)
        modelRef(model)
        return {model, shouldDispose: true}
    }
    
    // nothing done, untouched!
    return state
}