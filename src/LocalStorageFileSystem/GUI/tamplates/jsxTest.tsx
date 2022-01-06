import * as React from 'react';
import { render } from 'react-dom'

export default class MyComponent extends React.Component {
  render() {
    return <div>my component</div>;
  }
}

const test = (
  <div>
    heyyyyyyyyyyyyyyyyyy
  </div>
)


class Test {
  hey:string =  "hey"
  constructor() { }
  render() {
    return (
      <div>
        {this.hey}
      </div>
    )
  }
}


console.log(render(new Test().render(), document.querySelector("#jsxtest")))