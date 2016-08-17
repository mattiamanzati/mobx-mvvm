import {observable} from 'mobx'
import {IViewModel, IMountAware, createEvent} from '../../src/index'
import {Todo} from './Todo'

export class TodoViewModel implements IViewModel, IMountAware{
    @observable todos: Todo[] = []   
    @observable user: string = ''
    onTodoAdded = createEvent<Todo>()

    add(){
        const newTodo = new Todo()
        this.todos.push(newTodo)
        this.onTodoAdded.dispatch(newTodo)
    }

    willMount(){
        console.log('I will be mount! :D')
    }
}