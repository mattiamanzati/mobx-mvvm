// import once in your app the reflect-metadata polyfill
import 'reflect-metadata'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {createComponent} from '../../src/index'

// import the component View and ViewModel
import {view} from './TodoView'
import {TodoViewModel} from './TodoViewModel'

// create the todo editor component
const TodoEditor = createComponent({
    displayName: 'TodoEditor',
    view
})(TodoViewModel)

// render the app
ReactDOM.render(
    <TodoEditor 
        user="mattiamanzati" 
        onTodoSaved={() => alert('Todos saved!')} 
        onTodoAdded={(todo) => console.log('New todo:', todo)}
         />, 
    document.getElementById('app')
)
