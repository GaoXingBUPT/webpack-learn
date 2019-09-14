import _ from 'lodash';
import './style/style.css';
import './style/a.scss'

function createDomElement() {
  console.log('aaaaa')
  var dom = document.createElement('div');
  dom.innerHTML = _.join(['aicoder', '.com', ' wow'], '');
  dom.className = 'hello scssStyle';
  return dom;
  
}

document.body.appendChild(createDomElement());
