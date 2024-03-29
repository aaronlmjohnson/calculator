
const buttons = document.querySelector('#buttons');
const styles = window.getComputedStyle;
const numberButtons = document.querySelector('#number-buttons');
const signButtons = document.querySelector('#sign-buttons');
const otherButtons = document.querySelector('#other-buttons');
const NUMBER_OF_BUTTONS = 19;
const MAX_SCREEN_CHARS = 13;


for(let i = 0; i < NUMBER_OF_BUTTONS; i++){
  let button = document.createElement('div');
  let num = document.createElement('p');

  switch(true){
    case (i < 10):
      num.textContent = Math.abs(i-9);
      button.classList.add('number');
      break;
    case (i === 10):
      num.textContent = '.';
      button.setAttribute('id', 'decimal');
      break;
    case (i === 11):
      num.textContent = 'neg'; 
      button.setAttribute('id', 'negative');
      break;
    case (i === 12):
      num.textContent = '+';
      button.setAttribute('id', 'add');
      break;
    case (i === 13):
      num.textContent = '-';
      button.setAttribute('id', 'subtract');
      break;
    case (i === 14):
      num.textContent = '*';
      button.setAttribute('id', 'multiply');
      break;
    case (i === 15):
      num.textContent = '/';
      button.setAttribute('id', 'divide');
      break;
    case (i === 16):
      num.textContent = '=';
      button.setAttribute('id', 'operate');
      break;
    case (i === 17):
      num.textContent = 'clear';
      button.setAttribute('id', 'clear');
      break;
    case (i === 18):
      num.textContent = '←';
      button.setAttribute('id', 'backspace');
      break;
  }   
  button.classList.add('button');
  button.append(num); 

  if(i < 12)
    numberButtons.append(button);
  else if(i >= 12  &&  i < 16)
    signButtons.append(button);
  else if(i >= 16){
    otherButtons.append(button);
  }

}
const buttonsArr = [...document.querySelectorAll('.button')];

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
  screenOffset = 0;
  screenValue.style.right = `0px`;
  
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
//TODO: deal with overflow of really large numbers or really small numbers
let displayToScreen = (content, pressedBackspace, pressedEquals)=>{
  let buffer = 18 
  if(typeof pressedBackspace === "undefined")
    pressedBackspace = false;
  if(typeof pressedEquals === "undefined")
    pressedEquals = false;
  
  if(screenOffset === 1 && screenValue.offsetWidth < screen.offsetWidth){ // need to reset the offset since the screen value is less than the display at this point
    screenOffset = 0;
    screenValue.style.right = `${screenOffset * buffer}px`;
  }
  screenValue.textContent = content;
  if(pressedEquals){
    if(content > (10 ** MAX_SCREEN_CHARS) || content < -1 * (10 ** MAX_SCREEN_CHARS)){
      screenValue.textContent = content.toExponential(6);
    }
      //screenValue.textContent = content.toExponential(6);
    screenOffset = 0;
    screenValue.style.right = `${buffer * screenOffset}px`;
  }else if(screenValue.offsetWidth > screen.offsetWidth){
    if(!pressedBackspace){
      screenOffset++;
      screenValue.style.right = `${buffer * screenOffset}px`;
    } else{
      if(screenOffset > 0)
        --screenOffset;
      screenValue.style.right = `${buffer * screenOffset}px`;
    }
  } 
  

}
let clearScreen = ()=>{screenValue.textContent = '';}

const equals = document.querySelector('#operate');
const screenValue = document.querySelector('#screenValue');

const screen = document.querySelector('#screen');
let screenOffset = 0;

let currentNum = '';
let currentSign = '';
let signIndex = '';
let expression = [];
let expressionStr = ''; // needed to keep track of the values that are being displayed on the screen before calculation
let signRegex = /[\+\-\/\*]/gm;
let negativeSymbol = '@';

buttonsArr.forEach((button)=>{
  button.addEventListener('click', ()=>{
    if(button.textContent === 'neg'){
      if(currentNum.indexOf(negativeSymbol) > -1 || currentNum > 0)
        return;
      else{
        currentNum += negativeSymbol // using @ instead of - due to how the calculator handles calculating  - symbols
        expressionStr += '-';
        displayToScreen(expressionStr);
      }
    }
    if(button.textContent === '.' && currentNum.indexOf('.') > -1)
      return;
    if(button.textContent === 'clear'){
      myMath.clear();
      clearScreen();
      return;
    }
    if(button.textContent === '←'){
      if(expressionStr.length > 0){
        expression.pop();
        expressionStr = expressionStr.slice(0, expressionStr.length - 1);
        currentNum = currentNum.slice(0, currentNum.length - 1);
        displayToScreen(expressionStr, true); 
      }
      return;    
    }
    if(button.textContent === '='){
      if(currentNum){
        expression.push(currentNum);
        currentNum = '';
      }
      //convert numbers with negativeSymbols from having @ to -
      for(let i = 0; i < expression.length; i++){
        if(expression[i].indexOf(negativeSymbol) > -1)
          expression[i] = expression[i].replace(negativeSymbol, '-');
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
        expression[0] = Math.round(expression[0] * (10 ** MAX_SCREEN_CHARS)) / (10 ** MAX_SCREEN_CHARS);
      }
      displayToScreen(expression[0], false, true);
      myMath.clear();

    } else if (!!button.textContent.match(signRegex) && !!currentNum){
      if(currentNum === negativeSymbol)
        return;

        expression.push(currentNum);
        expression.push(button.textContent);
        expressionStr += button.textContent;
        currentNum = '';
    } else if(!button.textContent.match(signRegex) && button.textContent !== 'neg'){
        currentNum += button.textContent;
        expressionStr += button.textContent;
    }
    if(button.textContent !== '=')
      displayToScreen(expressionStr);
  })
})




