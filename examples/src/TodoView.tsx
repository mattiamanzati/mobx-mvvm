import * as React from 'react'
import {IView} from '../../src/index'
import {TodoViewModel} from './TodoViewModel'

export const render: IView<TodoViewModel> = ({dataSource}) => 
    <div>
        <button onClick={() => dataSource.add()}>New Todo</button>
        {dataSource.todos.map(
            (todo, i) => 
                <p key={todo.id}>
                    <input type="checkbox" checked={todo.done} onChange={e => todo.done = e.target.checked} />
                    <input type="text" value={todo.text} onChange={e => todo.text = e.target.value} />
                </p>
            )}
    </div>
