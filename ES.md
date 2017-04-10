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
