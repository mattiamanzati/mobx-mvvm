import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {render} from './TodoView'
import {TodoViewModel} from './TodoViewModel'

const source = new TodoViewModel()

ReactDOM.render(<render source={source} />, document.getElementById('app'))