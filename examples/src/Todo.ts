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
}