import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {render} from './TodoView'
import {TodoViewModel} from './TodoViewModel'
import {createComponent} from '../../src/index'

const TodoEditor = createComponent({
    displayName: 'TodoEditor',
    view: render,
    inputs: ['user'],
    outputs: ['onTodoAdded']
})(TodoViewModel)

ReactDOM.render(<TodoEditor user="mattiamanzati" onTodoAdded={(todo) => alert('New todo!')} />, document.getElementById('app'))