# This en JS

A día de hoy podemos argumentar que JavaScript es el lenguaje de programación del mundo, el que mas hype tiene seguro.

Es un lenguaje que cuenta con más de 21 años de edad. Que requiere retrocompatibilidad con sus antiguas versiones y con cuatro grandes motores de distintas empresas compitiendo por tener la mejor implementación (google, microsoft, apple y mozilla).

Un lenguaje estandarizado a través del estándar ECMA-262, en el cual gente de todas partes de la comunidad interviene para decidir que funcionalidades se añaden o modifican.

Todo este bagaje tiene como resultado un lenguaje particular en algunos aspectos, que puede llevar a confundir si no se conoce bien su funcionamientos. El artefacto `This` es uno de ellos. 

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
	console.log( this.a );
}

parentScope(); // => undefined
```
Hay varios errores en este código. La llamada `this.childScope()` funciona unicamente debido a la falta del modo estricto. ambas funciones son creadas como globales, por lo tanto son añadidas como métodos del mismo objeto y la llamada de una otra con `this` funciona.

Sin embargo, la intención detras de dicha llamada es referenciar el alcance de *parentScope* en *childScope*, y como hemos comentado antes, no es posible.

entonces...

## ¿Que es `this`?
