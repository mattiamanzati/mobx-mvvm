export type IEventListener<TEvent> = (e?: TEvent) => void
export type IEventListenerDisposer = () => void

export interface IEventEmitter<TEvent>{
    emit(e?: TEvent): void
    subscribe(listener: IEventListener<TEvent>): IEventListenerDisposer
    dispose(): void
}