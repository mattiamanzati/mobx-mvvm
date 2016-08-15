import * as React from 'react'
import {IView} from '../../src/index'
import {TodoViewModel} from './TodoViewModel'

export const render: IView<TodoViewModel> = ({source}) => 
    <div>
        <button onClick={() => source.add()}>New Todo</button>
        {source.todos.map(
            todo => 
                <p>
                    <input type="checkbox" checked={todo.done} onChange={e => todo.done = e.target.checked} />
                    <input type="text" value={todo.text} onChange={e => todo.text = e.target.value} />
                </p>
            )}
    </div>
