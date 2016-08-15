import {ICommand, CommandBase} from './CommandBase'

export type ICommandThunk<T> = (payload?: T) => (any | Promise<any>)
export type ICanExecuteCommandThunk<T> = (payload?: T) => boolean

export class Command<TPayload> extends CommandBase<TPayload> implements ICommand<TPayload>{
    /**
     * Internal storage to the command thunk
     */
    private _executeThunk: ICommandThunk<TPayload> = null

    /**
     * Internal storage to the canExecute thunk
     */
    private _canExecuteThunk: ICanExecuteCommandThunk<TPayload> = null


    constructor(executeThunk: ICommandThunk<TPayload>, canExecuteThunk?: ICanExecuteCommandThunk<TPayload>){
        super()
        this._executeThunk = executeThunk
        this._canExecuteThunk = canExecuteThunk
    }

    /**
     * Can the action be executed?
     */
    canExecute(payload?: TPayload){
        return this._canExecuteThunk ? this._canExecuteThunk(payload) : true
    }

    /**
     * Execute the action
     */
    execute(payload?: TPayload): Promise<any>{
        // do not run if not allowed to
        if(!this.canExecute(payload)) return Promise.reject(false)
        // runs the result and ensures it's a promise!
        const result = this._executeThunk(payload)
        return result && typeof result === 'object' && typeof result.then === 'function' ? result : Promise.resolve(result)
    }
}