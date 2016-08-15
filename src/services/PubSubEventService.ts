import {createEvent, IEvent, IEventListener, IEventListenerDisposer} from '../utils/createEvent'

export type IPubSubEventType = string | symbol
export type IPubSubEventListener = IEventListener<IPubSubEvent>
export type IPubSubEventDisposer = IEventListenerDisposer

export interface IPubSubEvent{
    type: IPubSubEventType
}

export interface IPubSubEventService{
    onMessage: IEvent<IPubSubEvent>
    subscribe(eventType: IPubSubEventType, listener: IPubSubEventListener): IPubSubEventDisposer
    dispatch(event: IPubSubEvent): void
}

export class PubSubEventService{
    /**
     * This is the event that will emit/you should subscribe to dispatch/listen for any pubsub event.
     */
    onMessage: IEvent<IPubSubEvent>

    /**
     * Subscribes to a public event that will be dispatched
     */
    subscribe(eventType: IPubSubEventType, listener: IPubSubEventListener): IPubSubEventDisposer{
        // just subscribe and filter events based on event type
        return this.onMessage.subscribe(e => e.type === eventType ? listener(e) : null)
    }

    /**
     * dispatches an event through pub sub
     */
    dispatch(event: IPubSubEvent){
        // simply dispatch the event
        return this.onMessage.dispatch(event)
    }
}