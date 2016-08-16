import {observable} from 'mobx'
import {IViewModel, IMountAware} from '../../src/index'
import {Todo} from './Todo'

export class TodoViewModel implements IViewModel, IMountAware{
    @observable todos: Todo[] = []   

    add(){
        this.todos.push(new Todo())
    }

    willMount(){
        console.log('I will be mount! :D')
    }
}