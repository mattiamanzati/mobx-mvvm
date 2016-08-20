import {observable} from 'mobx'

// newId is a utility function used to create a new progressive id
var _newId = 0
function newId(){
    ++_newId
    return _newId
}

// Create my domain-model for todos
export class Todo{
    id = newId()
    @observable text = ''
    @observable done = false

    serialize(){
        return {
            id: this.id,
            text: this.text,
            done: this.done
        }
    }

    static deserialize(json: Object){
        const todo = new Todo()
        todo.id = json['id'] || newId()
        todo.text = json['text'] || ''
        todo.done = json['done'] || false
        return todo
    }
}