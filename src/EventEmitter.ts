import {IEventEmitter, IEventListener, IEventListenerDisposer} from './interfaces'

export class EventEmitter<TEvent> implements IEventEmitter<TEvent>{
    /**
     * Holds an array of listening functions
     */
    protected listeners: IEventListener<TEvent>[] = []

    /**
     * Emits an Event
     */    
    emit(e?: TEvent){
        this.listeners.map(listener => listener(e))
    }

    /**
     * Subscribes to the event, and return an event listener disposer
     */
    subscribe(listener: IEventListener<TEvent>): IEventListenerDisposer{
        // subscribe by appending the listener
        var isSubscribed = true
        this.listeners.push(listener)

        // returns a disposer to cancel the subscription
        return () => {
            // avoid multiple unsubscriptions
            if(!isSubscribed) return
            isSubscribed = false

            // performs the unsubscription
            const index = this.listeners.indexOf(listener)
            this.listeners.splice(index, 1)
        }
    }

    /**
     * Disposes the EventEmitter
     */
    dispose(){
        this.listeners = []
    }
}