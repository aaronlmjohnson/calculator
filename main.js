const buttons = document.querySelector('#buttons');
const numberButtons = document.querySelector('#number-buttons');
const signButtons = document.querySelector('#sign-buttons');
const otherButtons = document.querySelector('#other-buttons');



for(let i = 0; i < 18; i++){
  let button = document.createElement('div');
  let num = document.createElement('p');

  switch(true){
    case (i < 10):
      num.textContent = Math.abs(i-9);
      button.classList.add('number');
      break;
    case (i === 10):
      num.textContent = '+';
      button.setAttribute('id', 'add');
      break;
    case (i === 11):
      num.textContent = '-';
      button.setAttribute('id', 'subtract');
      break;
    case (i === 12):
      num.textContent = '*';
      button.setAttribute('id', 'multiply');
      break;
    case (i === 13):
      num.textContent = '/';
      button.setAttribute('id', 'divide');
      break;
    case (i === 14):
      num.textContent = '=';
      button.setAttribute('id', 'operate');
      break;
    case (i === 15):
      num.textContent = 'clear';
      button.setAttribute('id', 'clear');
      break;
    case (i === 16):
      num.textContent = '.';
      button.setAttribute('id', 'decimal');
      break;
    case (i === 17):
      num.textContent = 'neg';
      button.setAttribute('id', 'negative');
  }   
  button.classList.add('button');
  button.append(num); 

  if(i < 10 || i === 17 || i === 16)
    numberButtons.append(button);
  else if(i >= 10  &&  i < 14)
    signButtons.append(button);
  else if(i >= 14 && i < 16){
    otherButtons.append(button);
    console.log('hi');
  }

}
const buttonsArr = [...document.querySelectorAll('.button')];
console.log(buttonsArr);

const myMath = {};

myMath.add = (a, b) => Number(a) + Number(b);
myMath.subtract = (a, b) => a - b;
myMath.multiply = (a, b) => a * b;
myMath.divide = (a, b) => a / b;
myMath.clear = ()=>{
  expression = [];
  expressionStr = '';
  currentNum = '';
  currentSign = '';
  signIndex = '';
}
myMath.operate = (operator, a, b) =>  {
  if(operator === '/')
    return myMath.divide(a,b);
  else if(operator === '*')
    return myMath.multiply(a,b);
  else if(operator === '+')
    return myMath.add(a,b);
  else if(operator === '-')
    return myMath.subtract(a,b);

};
let displayToScreen = (content)=>{screenValue.textContent = content;}
let clearScreen = ()=>{screenValue.textContent = '';}

const equals = document.querySelector('#operate');
const screenValue = document.querySelector('#screenValue');
let currentNum = '';
let currentSign = '';
let signIndex = '';
let expression = [];
let expressionStr = ''; // needed to keep track of the values that are being displayed on the screen before calculation
let signRegex = /[\+\-\/\*]/gm;

buttonsArr.forEach((button)=>{
  button.addEventListener('click', ()=>{
    if(button.textContent === '.' && currentNum.indexOf('.') > -1)
      return;
    if(button.textContent === 'clear'){
      myMath.clear();
      clearScreen();
      return;
    }
    if(button.textContent === '='){
      if(currentNum){
        expression.push(currentNum);
        currentNum = '';
      }
      while(expression.length > 1){
        if(expression.indexOf('/') !== -1)
          currentSign = '/';
        else if(expression.indexOf('*') !== -1)
          currentSign = '*';
        else if(expression.indexOf('+') !== -1)
          currentSign = '+';
        else if(expression.indexOf('-') !== -1)
          currentSign = '-';

        signIndex = expression.indexOf(currentSign);
        expression.splice(signIndex - 1, 3, myMath.operate(currentSign, expression[signIndex - 1], expression[signIndex + 1])); 
      }
      displayToScreen(expression[0]);
      myMath.clear();

    } else if (!!button.textContent.match(signRegex) && !!currentNum){
        expression.push(currentNum);
        expression.push(button.textContent);
        expressionStr += button.textContent;
        currentNum = '';
    } else if(!button.textContent.match(signRegex)){
        currentNum += button.textContent;
        expressionStr += button.textContent;
    }
    console.log(expression);
    if(button.textContent !== '=')
      displayToScreen(expressionStr);
  })
})

