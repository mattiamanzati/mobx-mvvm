import {computed} from 'mobx'
import {IEvent, IEventListenerDisposer, createEvent} from '../utils/createEvent'

export interface ICommand<T>{
    canExecuteChanged: IEvent<any>
    execute(parameter?: T): Promise<any>
    canExecute(parameter?: T): boolean
}

export abstract class CommandBase<TPayload>{
    /**
     * Used to dispatch whenever the command canExecute should be re-evaluated
     */
    canExecuteChanged = createEvent()

    /**
     * Tells the command to observe a value, and once it changes, dispatch the canExecuteChanged.
     */
    observe(funcToObserve: () => any): IEventListenerDisposer{
        return computed(funcToObserve)
            .observe(() => this.canExecuteChanged.dispatch())
    }
}
