import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {render} from './TodoView'
import {TodoViewModel} from './TodoViewModel'
import {createComponent} from '../../src/index'

const TodoEditor = createComponent(
    TodoViewModel,
    render
)

ReactDOM.render(<TodoEditor />, document.getElementById('app'))