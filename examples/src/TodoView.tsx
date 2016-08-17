import * as React from 'react'
import {IView} from '../../src/index'
import {TodoViewModel} from './TodoViewModel'

// create my component view, it's a React Component taking a model instance as prop.
export const render: IView<TodoViewModel> = ({model}) => 
    <div>
        <h1>Hello {model.user}! Here's your todo list!</h1>
        <button onClick={() => model.add()}>New Todo</button>
        {model.todos.map(
            (todo, i) => 
                <p key={todo.id}>
                    <input type="checkbox" checked={todo.done} onChange={e => todo.done = e.target.checked} />
                    <input type="text" value={todo.text} onChange={e => todo.text = e.target.value} />
                </p>
            )}
    </div>
