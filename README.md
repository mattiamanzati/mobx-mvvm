# MobX-MVVM
MobX MVVM solution based off React and inspired by Prism and Angular2

## 1. Create the ViewModel
Here you'll store all your component logic!
```javascript
import {observable, action} from 'mobx'
import {input, output, EventEmitter} from 'mobx-mvvm'

class CounterViewModel{
    // @input will sync properties with component props
    @input @observable min = 0
    @input @observable max = 100

    // @output will create a callback property that will emit +1 or -1
    @output onClick = new EventEmitter()

    @observable current = 0

    @action
    increase(){
        this.current = Math.min(this.max, this.current + 1)
        this.onClick.emit(1)
    }

    @action
    decrease(){
        this.current = Math.max(this.min, this.current - 1)
        this.onClick.emit(-1)
    }
}
```

## 2. Create the View
It's just a React component with a "model" property!
```javascript
import React from 'react'

const view = ({model}) => <div>
    <button onClick={model.decrease()}>-</button>
    <span>{model.current}</span>
    <button onClick={model.increase()}>+</button>
</div>
```

## 3. Wire it up
With this step, you'll create a new React component that will automatically create the ViewModel instance and dispose it on unmount.
```javascript
const Counter = createComponent({
    displayName: 'Counter',
    view
})(CounterViewModel)
```

## 4. Render it!
You're done! You can now pass in values and listen to callbacks!
```javascript
ReactDOM.render(
    <Counter
        min={0}
        max={10}
        onClick={(i) => console.log('Clicked:', i)}
         />, 
    document.getElementById('app')
)
```

## 5. Encountered a problem?
Simply open an issue! :D
