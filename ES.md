# This en JS

A día de hoy podemos argumentar que JavaScript es el lenguaje de programación más usado del mundo, el que mas hype tiene seguro.

Es un lenguaje que cuenta con más de 21 años de edad. Que requiere retrocompatibilidad con sus antiguas versiones y con cuatro grandes motores de distintas empresas compitiendo por tener la mejor implementación (google, microsoft, apple y mozilla).

Un lenguaje estandarizado a través del estándar ECMA-262, en el cual gente de todas partes de la comunidad interviene para decidir que funcionalidades se añaden o modifican.

Todo este bagaje tiene como resultado un lenguaje particular en algunos aspectos, que puede llevar a confundir si no se conoce bien su funcionamiento. El artefacto `This` es uno de ellos.

Veamos un pequeño ejemplo.

```js
var man = {
	greeting: 'Hi!',
	greet: function() {
		console.log(this.greeting);
	}
}

man.greet();
```

Nuestro objeto `hombre` tiene la propiedad *saludo* y el método *saludar*, el cual imprime por consola el saludo. Cuando ejecutamos el saludo, la respuesta es:

```js
`Hi!`
```
Pero ¿Como se comportaria la función de saludo si decidimos asignarla a una variable diferente?

```js
var manGreeting = man.greet;

manGreeting();
```
Nada deberia haber cambiado. ¿No? `manGreeting` imprimira el saludo: 'Hi!' por pantalla:

```js
undefined
```

¿Que? ¿Como?... (╯°□°）╯

## Principales confusiones con `this`

La mayoría de problemas con this vienen de la asociación de la palabra 'this' con el uso que se le da en otros lenguajes.

### A sí mismo

Un asociación inicial comun es pensar que se refiere a un función en sí. Muchos desarrolladores nuevos en JS piensan que referenciar un función como un objeto te permiter guardar el estado entre las diferentes llamadas. Probemos un ejemplo para ver que una función no consigue una referencia a sí misma.

```js
var proxy = function() {
	this.timesCalled++;

	//...
}

proxy.timesCalled = 0;

proxy();
proxy();
proxy();
proxy();
proxy();

console.log(proxy.timesCalled);
```

Como resultado obtenemos: `0`. ¿Como puede ser que después de llamar 5 veces a la función proxy el contador este a 0?¿Por qué no ha saltado ningún error? El problema reside en una interpretación muy literal de `this` en la sentencia `this.timesCalled++`. Cuando se ejecuta `proxy.timesCalled = 0;` se añade la propiedad *timesCalled* al objeto *proxy*, pero cuando se ejecuta `this.timesCalled++` `this` no esta apuntando a *proxy*.

Entonces, ¿Que contador se ha incrementado? Si indagamos un poco encontraremos que he creado una variable global llamada `timesCalled` cuyo valor es `NaN`.

Si hubieramos ejecutado el ejemplo anterior en modo estricto, habriamos recibido un `TypeError` ya que este modo nos evita, entre otras cosas, crear accidentalmente variables globales indeseadas.

### Su alcance

*El alcance es el contexto en el cual ciertos valores y expresiones son "visibles", o pueden ser referenciados. Si una variable o otra expresión no estan "en el alcance actual", no estan disponibles para su uso. Los alcances pueden estar ordenados en una jerarquia, de modo que los hijos pueden acceder al alcance de los padres, pero no viceversa*

```js
function parentScope() {
	var parentVariable = 'Parent scope';

	function childScope() {
		var childVariable =  'Child scope'

		console.log(parentVariable); \\ => 'Parent scope'
	}

	childScope();
	console.log(childVariable); \\ => 'ReferenceError: childVariable is not defined'
}

parentScope();
```

Otro error común es asumir que `this` hace referencia al alcance de la función. La respuesta es, no. El "objeto" alcance no es accesible desde el código JS, es una parte interna de la implementación del motor. Consideremos un ejemplo que intenta emular el uso de `this` como el alcance léxico de la función.

```js
function parentScope() {
	var fatherVariable = 2;
	this.childScope();
}

function childScope() {
	console.log( this.fatherVariable );
}

parentScope(); // => undefined
```

Hay varios errores en este código. La llamada `this.childScope()` funciona unicamente debido a la falta del modo estricto. ambas funciones son creadas como globales, por lo tanto son añadidas como métodos del mismo objeto y la llamada de una otra con `this` funciona.

Sin embargo, la intención detras de dicha llamada es referenciar el alcance de *parentScope* en *childScope*, y como hemos comentado antes, no es posible.

entonces...

## ¿Que es `this`?

Después de ver estos últimos ejemplos podriamos concluir que el `this` de una función no depende de donde ha sido declarada. Y tendriamos razón, `this` no tiene relación con el punto de declaración sino con el momento de invocación.

Cuando una función es invocada, se genera un *contexto de ejecución* (activation record), este contexto contiene información acerca de la el punto donde se lllamo a la función (call-stack), *como* fue invocada, que parametros ha recibido,... Una de las propiedades es la referencia a `this` que sera usada mientras dure la ejecución de la función. un pequeño ejemplo:

```js
function paco() {
	this.name = 'paco';
	ramon(); // --> punto de invocación de ramon
} // --> declaración de paco

function ramon() {
	console.log(this.name); // => paco
	//...
} // --> declaración de ramon

paco(); // --> punto de invocación de paco
```

Una vez sabemos que es `this`, ¿como podemos saber a que hace referencia? Hay 4 casos que podemos tener en cuenta:

### Enlace por defecto

```js
function a_function() {
	console.log( this.a_variable );
}

var a_variable = 2;

a_function(); // 2
```

El primer ejemplo, tiene que ver con ejemplos anteriores. `a_variable` y `a_function` se ha creado como variables globales. En `a_function` usamos `this` el cual hace uso del enlace por defecto y llama a la propiedad `a_variable` del objeto global, el cual retorna 2. hay que tener en cuenta que si se usara el modo estricto, la referencia a `this` referenciara a undefined y no al global, por lo que saltara un error.

### Enlace implícito

Otra regla a considerar es si el punto de invocación tiene objeto de contexto, tambien referido como "esta contenido por un objeto":

```js
function greet(){
	console.log(this.greeting);
}

var man = {
	greeting: 'Hi!',
	greet: greet
}

man.greet();
```

La función `greet` es declarada primero y posteriormente añadida como una referencia del objeto `man`. Independientemente de si es declarada en el objeto o fuera, podemos decir que la función esta "contenida" por el objeto `man`.

En el momento que se llama a `greet`, este esta precedido por una referencia al objeto `man`, enlazando el contexto de `man` al `this` de `greet`. Como `man` es el `this` de greet, decir `this.greeting` es sinonimo de `man.greeting`.  

#### Perder el `this` de forma implícita

 Uno de los errores más comunes es el sucedido en el primer ejemplo de la presentación:


```js
var man = {
	greeting: 'Hi!',
	greet: function() {
		console.log(this.greeting);
	}
}

var manGreeting = man.greet;

manGreeting(); // => undefined
```

Al crear la variable `manGreeting` pasamos la referencia de la función `greet`, pero perdemos la referencia a `man` que teniamos al ejecutar `man.greet`. `manGreeting` en este caso hara uso del caso anterior *enlace por defecto*, por lo que `this` hara referencia al global, el cual devolvera `undefined` al no tener la propiedad `greeting`.

### Enlace explícito

Con el *enlace implícito* hemos tenido que modificar el objeto en cuestión para incluir una referencia en el mismo de la función, y usar esta propiedad para referencia de forma indirectar el `this` al objeto.

Pero ¿Como podemos forzar a una función a usar un objecto de nuestra elección como su `this`, añadir la function como una propiedad de dicho objeto? Para ayudarnos a conseguir nuestro objetivo tenemos los metodos *apply* y *call* que todas las funciones que creemos poseen. Ambas funciones aceptan como primer paramétro un objeto para ser usado como `this` de la función al ser ejecutada.

```js
var man = {
	greeting: 'Hi!'
}

var boy = {
	greeting: 'Wazaaaaaaaa!!!!'
}

function greet() {
	console.log(this.greeting);
}

greet.call(man); // => 'Hi!'
greet.apply(boy); // => 'Wazaaaaaaaa!!!!'
```
*call* y *apply* se comportan igual en lo que a `this` se refiere, la diferencia reside en como tratan el resto de parametros

```js
function logFullName(name, surname) {
	console.log(name + ' ' + surname);
}

logFullName.call(null, 'pepito', 'palotes'); // => 'pepito palotes'
logFullName.apply(null, ['pepito', 'palotes']);  // => 'pepito palotes'
```

Desgraciadamente este solución por si sola no nos libra de perder el `this` de forma implícita. Para ello tenemos que *forzar* el enlace explícito

```js
function a_function() {
	console.log( this.a_varaiable );
}

var an_object = {
	a_varaiable: 2
};

var another_function = function() {
	a_function.call( an_object );
};

another_function(); // => 2
setTimeout( another_function, 100 ); // => 2
another_function.call( window ); // => 2
```

Aunque `another_function` use *call* para cambiar su contexto de ejecución, `a_function` seguira usando `an_object` como `this`, ya que forzamos el enlace en la declaracion de `another_function`. Este patrón es tan común, que en ES5 se añadio al lenguaje el metodo `bind`.

```js
var another_function = function() {
	a_function.call( an_object );
}

var another_function = a_function.bind( an_object );
```

`bind` devuelve una function que es una referencia a la original con su `this` enlazado al objeto especificado.

#### "Contextos" En APIs

Muchas funciones incluyen un parametro opcional "context", que esta diseñado como un work-around para que no tengas que usar `bind` para asignar un `this` particular.

```js
function is_a(name) {
	console.log( name + " is a " + this.id );
}

var role = {
	id: "student"
};

["Paco", "Manel", "Leo", "Raul"].forEach( is_a, role ); // Paco is a student Manel is a student Leo is a student Raul is a student
```
### Enlace con `new`

Cuarto y último caso. En los lenguajes que soportan clases, los "constructores" son metodos especiales unidos a las clases. Cuando la clase es instanciada con el operador `new` se llama a el constructor de la clase.

JS tiene el operador `new`, y aunque el código es similar a lo que se ve en ese tipo de lenguajes, no hay una conexión con esa "orientación a clases" en JS. En JS los constructores son funciones normales que son llamadas con el operador `new` delate de ellas. No estan asociadas a clases ni estan instanciando una clase. Ni siquiera son un tipo especial de funciones. Una funcion llamada con el operador `new` delante genera una *llamada constructora*. Cuando esto sucede varias cosas son hechas de forma automática:

  1. Un objeto nuevo es construido (aka, construido) de la nada
  2. Al objeto nuevo se le enlaza el [[Prototype]]
  3. Al objeto nuevo se le asigna a la propiedad `this` una referencia a el mismo
  4. A no ser que la función retorne un objeto alternativo, la función invocada con `new` automáticamente retorna el objeto nuevo

Considera este código:

```js
function Dog(name) {
	this.name = name;
}

var whiskey = new Dog( 'whiskey' );
console.log( whiskey.name ); // => 'whiskey'
```
### Orden de prioridad de los casos

  1. new: ¿Ha sido la función llamada con `new`? En ese caso `this` es el nuevo objeto
  2. explícito: ¿Ha sido la función llamada con *call*, *apply* o se ha definido con *bind*? Entonces `this` es el objeto especificado explícitamente
  3. implícito: ¿Ha sido la función llamada con un contexto? pues `this` hace referencia al objeto del contexto
  4. defecto: en modo estricto: undefined, en otro caso `this` hara referencia al objeto global

### `this` léxico

En **ES6** se introdujo un tipo de función que no sigue estas 4 reglas. Las funciones flecha (arrow-functions) no usan la palabra reservada *function* sino que usan el operador conocido como *fat-arrow* (fleach gorda) `=>`. Estas funciones enlazan en el `this` el alcance de la funcion que las envuelven.

```js
function generator() {
	return (a_parameter) => {
		console.log( this.a_variable );
	};
}

var an_object = {
	a_variable: 2
};

var another_object = {
	a_variable: 3
};

var bar = generator.call( an_object );
bar.call( another_object ); // => 2
```
La *arrow-function* creada en `generator` captura el `this` de `generator` en el momento en que se llamo.

## Otros usos para `this`

Veamos algunos ejemplos del uso de this.

### Currying o Currificación

La currificación es una técnica que consiste en transformar una función que utiliza múltiples argumentos en una secuencia de funciones que utilizan un único argumento.

```js
function again(verb, noun, adjective) {
	console.log('lets ' + verb + ' ' + noun + ' ' + adjective + ' again!!!');
}

console.log(again('fish', 'cookies', 'awesomely'));
```

Tenemos la función `again` que recibe 3 parametros e imprime por consola una fras generada a partir de ellos. Curryfiquemos la function

```js
function curryedAgain(verb) {
	return function(noun) {
		return function(adjective) {
			again(verb, noun, adjective);
		}
	}
}

var fish = curryedAgain('fish');
//...

var fishedCookies = fish('cookies');
//...

fishedCookies('awesomely');
```

De esta forma podemos ir proveyendo los parametros en diferentes puntos de ejecución. un ejemplo de currying con `this` puede ser el siguiente:

```js
var members = [
	{ name: 'Manel', origin : 'Barcelona' },
	{ name: 'Raul', origin : 'Valencia' },
	{ name: 'Demi', origin : 'Valencia' }
];

var is_from = function(origin, member) {
	return member.origin == origin;
}

var fromValencia = members.filter(function(member) {
	return is_from('Valencia', member);
});

console.log(fromValencia);
```

Usamos una función de filtro para seleccionar los miembros que son de *valencia*, sin embardo la función que le pasamos a filtrado no es muy legible, vamos a mejorarlo un poco con `this`.

```js
var membersFrom = function(origin) {
	return is_from.bind(null, origin);
}

var fromValencia = members.filter(membersFrom('Valencia'));
```

Al enlazar el origen a `is_from`, retornamos una función que estara esperando el parametro `member`, que le proveera la función filter al invocarlo.

### `This` en los eventos del DOM

¿Como afecta `this` a los elementos del DOM?

```js
function paintRed() {
   this.style.color = '#cc0000';
}

element.addEventListener('click', paintRed);
```
¿Que pasa cuando asociamos `paintRed` al evento click de un elemento? La función se ejecutara con el contexto de el elemento HTML. Obtendremos el mismo comportamiento de estas formas:

```js
element.onclick = paintRed;
element.addEventListener('click',paintRed,false);
element.onclick = function () {this.style.color = '#cc0000';}
<element onclick="this.style.color = '#cc0000';">
```

#### Event Bubbling

Cuando *clickas* en un elemento que esta contenido dentro de otro, se lanzara un evento de `click` en ambos.. Pero, ¿En que orden se lanzaran? Aquí es donde aparece el término *event bubbling*, el primer evento de `click` se lanzara en el elemento que ha sido *clickado* e ira subiendo progesivamente por el DOM hasta llegar al document (bubble up).

Si añadimos varios eventos de `click`, ¿como podemos distiguir quien esta tratando el evento? El objeto *evento* se pasa como parametro a la función de callback que gestiona el evento. En el objeto *evento* entre muchas propiedades se incluyen `target` y `currentTarget`.

`target` hace referencia al elemento que ha sido clickado, mientras que `currentTarget` referencia el elemento que esta procesando el evento, que coincide con el `this` de la función de callback.

```js
var element1 =  document.createElement('button');
var element2 =  document.createElement('button');

element1.appendChild(element2);

function onClick(e) {
	console.log(this == e.target);
	console.log(this == e.currentTarget);
}

element1.addEventListener('click', onClick);
element2.addEventListener('click', onClick);

 document.body.appendChild(element1);

 element2.click();
```

Para `element1` ambas comparaciones seran `true` ya que se ha hecho *click* en el mismo, pero para `element2` solo la segunda recibiremos `true` en la segunda.
