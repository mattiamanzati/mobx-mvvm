import {observable} from 'mobx'

var _newId = 0
function newId(){
    ++_newId
    return _newId
}

export class Todo{
    id = newId()
    @observable text = ''
    @observable done = false
}