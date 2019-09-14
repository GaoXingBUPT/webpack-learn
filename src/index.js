import _ from 'lodash';
import './style/style.css';
import './style/a.scss'

function createDomElement() {
  console.log('aaaaa11111')
  var dom = document.createElement('div');
  dom.innerHTML = _.join(['aicoder', '.com', ' wow'], '');
  dom.className = 'hello scssStyle';
  return dom;
  
}

document.body.appendChild(createDomElement());

//es6
class TempAaa {
  show() {
    console.log('this.Age :', this.Age);
  }
  get Age() {
    return this._age;
  }
  set Age(val) {
    this._age = val + 1;
  }
}

let t = new TempAaa()
t.Age = 19

t.show()
