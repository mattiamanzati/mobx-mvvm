import {CommandBase, ICommand} from './CommandBase'

/**
 * Since CompositeCommand provides a mechanism to subscribe sub-commands, wi will allow to do that
 */
export interface ICompositeCommand<TPayload> extends ICommand<TPayload>{
    registerCommand(command: ICommand<TPayload>)
    unregisterCommand(command: ICommand<TPayload>)
}

/**
 * Composite commands are just a group of commands,
 * If all the commands can be executed, the composite command can be executed as well
 * The composite command execution is just all the commands being executed at once.
 */
export class CompositeCommand<TPayload> extends CommandBase<TPayload> implements ICommand<TPayload>{
    /**
     * Holds a set of references to sub commands
     */
    protected _registeredCommands: ICommand<TPayload>[] = []

    /**
     * Registers a command
     */
    registerCommand(command: ICommand<TPayload>){
        const isRegistered = this._registeredCommands.indexOf(command) > -1
        if(!isRegistered){
            this._registeredCommands.push(command)
        }
    }

    /**
     * Unregisters a command
     */
    unregisterCommand(command: ICommand<TPayload>){
        const index = this._registeredCommands.indexOf(command)
        if(index > -1){
            this._registeredCommands.splice(index, 1)
        }
    }

    /**
     * Can this command be executed?
     * Check if every subcommand can, if so, yes.
     */
    canExecute(payload?: TPayload){
        // make a shallow copy to avoid problems
        const commands = this._registeredCommands.slice()

        // if any of the sub commands fails, than the CompositeCommand cannot run
        for(var i = 0; i < commands.length; i++){
            const command = commands[i]
            if(!command.canExecute(payload)) return false
        }

        return true
    }

    /**
     * Execute all subcommands.
     * TODO: Execute them one-by-one
     */
    execute(payload?: TPayload){
        if(!this.canExecute(payload)) return Promise.reject(false)

        // make a shallow copy to avoid problems
        const commands = this._registeredCommands.slice()
        var executedCommands = []

        // runs all subcommands
        for(var i = 0; i < commands.length; i++){
            executedCommands.push(commands[i].execute())
        }

        // returns if them all resolves
        return Promise.all(executedCommands).then(resolved => true, rejected => {throw false})
    }
}