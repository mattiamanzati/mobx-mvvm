import {observable} from 'mobx'
import {IViewModel, IMountAware, createEvent} from '../../src/index'
import {Todo} from './Todo'

export class TodoViewModel implements IViewModel, IMountAware{
    // list of todos
    @observable todos: Todo[] = []   
    // current user, passed in from inputs in createComponent()
    @observable user: string = ''
    // action to fire whenever a todo is added, subscribed from outputs in createComponent()
    onTodoAdded = createEvent<Todo>()
    onTodoSaved = createEvent<Todo[]>()

    // view action
    add(){
        // create a todo
        const newTodo = new Todo()
        this.todos.push(newTodo)
        // dispatch the onTodoAdded event
        this.onTodoAdded.dispatch(newTodo)
    }

    save(){
        this.onTodoSaved.dispatch(this.todos)
    }

    // lifecycle method example
    willMount(){
        console.log('I will be mount! :D')
    }
}