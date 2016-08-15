import {observable} from 'mobx'

export class Todo{
    @observable text = ''
    @observable done = false
}