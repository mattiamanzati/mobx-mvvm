import * as React from 'react'
import {observer} from 'mobx-react'

export interface IDataTemplateChildParams{
    source: any
}

export interface IDataTemplateChild{
    (params: IDataTemplateChildParams): React.ReactElement<any>
}

export interface IDataTemplateProps{
    children: IDataTemplateChild
    source: any
}

/**
 * This class is used in order to provide a binding mechanism.
 * It uses function as a children to provide a simple an clean API,
 * without messing up too much with the react core.
 **/
export class DataTemplate extends React.Component<IDataTemplateProps, any>{
    /**
     * This is the source object
     */
    source: any = null

    /**
     * This is the template function/template component
     */
    children: React.ClassicComponentClass<IDataTemplateChildParams> = null

    /**
     * Lifecycle methods
     */
    constructor(props, ctx){
        super(props, ctx)
        this.updateProps(props)
    }

    componentWillReceiveProps(newProps: IDataTemplateProps){
        this.updateProps(newProps)
    }

    /**
     * Internal method to update the internal props
     */
    updateProps(newProps: IDataTemplateProps){
        const {source, children} = newProps

        console.log(newProps)

        this.source = source
        this.children = observer(children)
    }

    /**
     * Just... DOIT! Erm... render-it!
     */
    render(){
        return React.createElement(this.children, {source: this.source})
    }
}