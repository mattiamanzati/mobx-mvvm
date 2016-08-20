import * as React from 'react'
import {IView} from '../../src/index'
import {TodoViewModel} from './TodoViewModel'

// create my component view, it's a React Component taking a model instance as prop.
export const view: IView<TodoViewModel> = ({model}) => 
    <div>
        <h1>Hello {model.user}! Here's your todo list!</h1>
        <p><button onClick={() => model.add()}>New Todo</button><button onClick={() => model.save()}>Save Todos</button></p>
        {model.todos.map(
            (todo, i) => 
                <p key={todo.id}>
                    #{todo.id} <strong>{todo.text}</strong> <i>{todo.done ? 'DONE!' : ''}</i><br/>
                    <input type="checkbox" checked={todo.done} onChange={e => todo.done = e.target.checked} />
                    <input type="text" value={todo.text} onChange={e => todo.text = e.target.value} />
                    <button onClick={() => model.remove(todo)}>Delete</button>
                </p>
            )}
    </div>