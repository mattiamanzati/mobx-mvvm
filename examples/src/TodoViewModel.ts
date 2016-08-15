import {observable} from 'mobx'
import {Todo} from './Todo'

export class TodoViewModel{
    @observable todos: Todo[] = []   

    add(){
        this.todos.push(new Todo())
    }
}