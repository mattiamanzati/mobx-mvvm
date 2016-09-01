import {IComponentState, IComponentProps, IViewModel} from './interfaces/index'

export function disposeModel(state: IComponentState){
    if(state.model && state.shouldDispose && typeof state.model.dispose === 'function'){
        state.model.dispose()
    }
}