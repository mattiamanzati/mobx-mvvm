import * as React from 'react'
import {observable} from 'mobx'
import {DataTemplate, Command} from '../index'

/**
 * Note that:
 *  - link reads data from the view model, stores it in the state and commit to viewmodel on blur
 *      this allows to simply perform data validation using intercept and observe from mobx
 *  - command provides onClick to the viewModel action, and automatically disables the button when the command is not available
 */
const TodoEditor = ({viewModel}) => {
     return <DataTemplate source={viewModel}>{({link, command}) => {
         <div>
             <p>Task:<br/>
                 <input type="text" {...link.twoway('text', 'value')} />
             </p>
             <p>Done:<br/>
                 <input type="checkbox" {...link.twoway('done', 'checked')} />
             </p>
             <button {...command('send')}>Send to Server</button>
         </div>
     }}</DataTemplate>
}

class Todo{
     @observable id = Math.floor(Math.random() * 100)
     @observable text = ''
     @observable done = false

     send = new Command(this.executeSend.bind(this), this.canSend.bind(this))

     constructor(){
         this.send.observe(() => this.text)
     }

     protected canSend(){
         return !!this.text
     }

     protected executeSend(){
         console.log('sending to server task ', this.text, 'which is ', this.done ? '' : ' not ', 'done')
     }
}

const todoViewModel = new Todo()

ReactDOM.render(<TodoEditor viewModel={todoViewModel} />, document.getElementById('app'))