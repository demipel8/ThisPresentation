#Bibliography

https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures
https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/README.md

https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/this
https://developer.mozilla.org/en-US/docs/Glossary/Scope

https://www.youtube.com/watch?v=GhbhD1HR5vk&t=3s&index=1&list=PL0zVEGEvSaeHBZFy6Q8731rcwk0Gtuxub
https://www.youtube.com/watch?v=CQqwU2Ixu-U
https://www.youtube.com/watch?v=iZLP4qOwY8I&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=6

http://www.quirksmode.org/js/events_order.html

http://tomhicks.github.io/code/2014/08/11/some-of-this.html

## Simple example


```js
>>>>>>> c36d78d5b7e894372df471bcd70f3e3323d5a2a4
var Doorbell = {
  sound: 'beeeeeeep',
  press: function() {
    console.log(this.sound);
  }
}

Doorbell.press();

var event = new Event('pulse_button');

document.addEventListener('pulse_button', Doorbell.press);
document.dispatchEvent(event);
```

##Itself
```js
	function counter() {
	  this.value++;
	}

	counter.value = 0;

	counter();
	counter();
	counter();
	counter();

	console.log(counter.value);  //0/

```

##lexical scope
```js
function ramon() {
	var pastuca = 2;
	this.pepe();
}

function pepe() {
	console.log( this.a );
}

ramon(); //undefined
```

Cunado una función es invocada, se genera un *contexto de ejecución* (activation record), este contexto contiene información acerca de la el punto donde se lllamo a la función (call-stack), *como* fue invocada, que parametros ha recibido,... Una de las propiedades es la referencia a *this* que sera usada mientras dure la ejecución de la función.

##Curry

let students = [
  { name: 'Manel', age : 46 },
  { name: 'Raul', age : 50 },
  { name: 'Paco', age : 40 },
  { name: 'Leo', age : 30 }
];

let olderThan = function(age, student) {
  return student.age > age
}

let clousureCurryOlderThan = function(age, student) {
  return function(student) {
    return student.age > age 
  };
}

let bindCurryOlderThan = function(age) {
  return olderThan.bind(null, age);
}


let OldStudents = students.filter(bindCurryOlderThan(40));

console.log(OldStudents)



