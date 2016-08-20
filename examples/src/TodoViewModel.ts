import {observable} from 'mobx'
import {IViewModel, EventEmitter, input, output} from '../../src/index'

import {Todo} from './Todo'

export class TodoViewModel implements IViewModel{
    // list of todos
    @observable todos: Todo[] = []   
    // current user, passed in from Component
    @input @observable user: string = ''
    // action to fire whenever a todo is added, subscribed from Component
    @output onTodoAdded = new EventEmitter<Todo>()
    @output onTodoSaved = new EventEmitter<Todo[]>()

    constructor(){
        // load todos, if any are saved
        if(window.localStorage){
            const json = JSON.parse(window.localStorage.getItem("todos") || "[]")
            this.todos = json.map(todo => Todo.deserialize(todo))
        }
    }

    // another view action
    save(){
        // actual save logic
        if(window.localStorage){
            window.localStorage.setItem(
                "todos", 
                JSON.stringify(
                    this.todos.map(todo => todo.serialize())
                )
            )
        }
        // dispatch the saved event
        this.onTodoSaved.emit(this.todos)
    }

    // view action
    add(){
        // create a todo
        const newTodo = new Todo()
        this.todos.push(newTodo)
        // dispatch the onTodoAdded event
        this.onTodoAdded.emit(newTodo)
    }

    // view action
    remove(todo: Todo){
        const index = this.todos.indexOf(todo)
        if(index > -1){
            this.todos.splice(index, 1)
        }
    }
}