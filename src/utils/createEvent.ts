
export type IEventListener<TEvent> = (e?: TEvent) => void
export type IEventListenerDisposer = () => void

export interface IEvent<TEvent>{
    dispose(): void
    subscribe(listener: IEventListener<TEvent>): IEventListenerDisposer
    dispatch(e?: TEvent): void
}

export function createEvent<TEvent>(){
    // store all the listeners
    var listeners: IEventListener<TEvent>[] = []

    // cleanup by unsubscribe everything
    function dispose(){
        // just remove any reference
        listeners = []
    }

    // to subscribe, just add to listeners
    function subscribe(listener: IEventListener<TEvent>){
        // avoid not cheap calculations
        var isSubscribed = true
        listeners.push(listener)

        // returns an unsubscribtion function!
        return () => {
            // avoid non-cheap recomputations
            if(!isSubscribed) return
            isSubscribed = false

            // unsubscribe
            const index = listeners.indexOf(listener)
            if(index > -1){
                listeners.splice(index, 1)
            }
        }
    }

    // to dispatch, just loop over subscribers
    function dispatch(e?: TEvent){
        listeners.slice().map(listener => listener(e))
    }

    return {subscribe, dispatch, dispose}
}