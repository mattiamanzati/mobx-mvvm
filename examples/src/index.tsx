import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {render} from './TodoView'
import {TodoViewModel} from './TodoViewModel'
import {createComponent} from '../../src/index'

const TodoEditor = createComponent({
    displayName: 'TodoEditor',
    view: render,
    inputs: ['user'],
    outputs: ['onTodoAdded', 'onTodoSaved']
})(TodoViewModel)

ReactDOM.render(<TodoEditor user="mattiamanzati" onTodoSaved={() => alert('Todos saved!')} onTodoAdded={(todo) => console.log('New todo:', todo)} />, document.getElementById('app'))