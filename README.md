# function qualityGuide () {

> A **quality conscious** and _organic_ JavaScript quality guide

This style guide aims to provide the ground rules for an application's JavaScript code, such that it's highly readable and consistent across different developers on a team. The focus is put on quality and coherence across the different pieces of your application.

## Modules

This style guide assumes you're using a module system such as [CommonJS][1], [AMD][2], [ES6 Modules][3], or any other kind of module system. Modules systems provide individual scoping, avoid leaks to the `global` object, and improve code base organization by **automating dependency graph generation**, instead of having to resort to manually creating tens of `<script>` tags.

Module systems also provide us with dependency injection patterns, which are crucial when it comes to testing individual components in isolation.

## Strict Mode

**Always** put [`'use strict';`][6] at the top of your modules. Strict mode allows you to catch non-sensical behavior, discourages poor practices, and _is faster_ because it allows compilers to make certain assumptions about your code.

## Spacing

Spacing must be consistent across every file in the application. To this end, using something like [`.editorconfig`][4] configuration files is highly encouraged. Here are the defaults I suggest to get started with JavaScript indentation.

```ini
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

Settling for either tabs or spaces is up to the particularities of a project, but I recommend using 2 spaces for indentation. The `.editorconfig` file can take care of that for us and everyone would be able to create the correct tabs by pressing the tab key.

Spacing doesn't just entail tabbing, but also the spaces before, after, and in between arguments of a function declaration. This kind of spacing is **typically highly irrelevant to get right**, and it'll be hard for most teams to even arrive at a scheme that will satisfy everyone.

```js
function () {}
```

```js
function( a, b ){}
```

```js
function(a, b) {}
```

```js
function (a,b) {}
```

Try to keep these differences to a minimum, but don't put much thought to it either.

Where possible, improve readability by keeping lines below the 80-character mark.

## Semicolons`;`

Automatic Semicolon Insertion _(ASI)_ is not a feature. [Don't rely on it][17]. It's [super complicated][18] and there's no practical reason to burden all of the developers in a team for not possessing **the frivolous knowledge of how ASI works**. Avoid headaches, avoid ASI.

> **Always add semicolons where needed**

## Style Checking

**Don't**. Seriously, [this is super painful][11] for everyone involved, and no observable gain is attained from enforcing such harsh policies.

## Linting

On the other hard, linting is sometimes necessary. Again, don't use a linter that's super opinionated about how the code should be styled, like [`jslint`][12] is. Instead use something more lenient, like [`jshint`][13] or [`eslint`][14].

A few tips when using JSHint.

- Declare a `.jshintignore` file and include `node_modules`, `bower_components`, and the like
- You can use a `.jshintrc` file like the one below to keep your rules together

```json
{
  "curly": true,
  "eqeqeq": true,
  "newcap": true,
  "noarg": true,
  "noempty": true,
  "nonew": true,
  "sub": true,
  "undef": true,
  "unused": true,
  "trailing": true,
  "boss": true,
  "eqnull": true,
  "strict": true,
  "immed": true,
  "expr": true,
  "latedef": "nofunc",
  "quotmark": "single",
  "indent": 2,
  "node": true
}
```

By no means are these rules the ones you should stick to, but **it's important to find the sweet spot between not linting at all and not being super obnoxious about coding style**.

## Strings

Strings should always be quoted using the same quotation mark. Use `'` or `"` consistently throughout your codebase. Ensure the team is using the same quotation mark in every portion of JavaScript that's authored.

##### Bad

```js
var message = 'oh hai ' + name + "!";
```

##### Good

```js
var message = 'oh hai ' + name + '!';
```

Usually you'll be a happier JavaScript developer if you hack together a parameter-replacing method like [`util.format` in Node][15]. That way it'll be far easier to format your strings, and the code looks a lot cleaner too.

##### Better

```js
var message = util.format('oh hai %s!', name);
```

You could implement something similar using the piece of code below.

```js
function format () {
  var args = [].slice.call(arguments);
  var initial = args.shift();

  function replacer (text, replacement) {
    return text.replace('%s', replacement);
  }
  return args.reduce(replacer, initial);
}
```

To declare multi-line strings, particularly when talking about HTML snippets, it's sometimes best to use an array as a buffer and then join its parts. The string concatenating style may be faster but it's also much harder to keep track of.

```js
var html = [
  '<div>',
    format('<span class="monster">%s</span>', name),
  '</div>'
].join('');
```

With the array builder style, you can also push parts of the snippet and then join everything together at the end. This is in fact what some [string templating engines like Jade][24] prefer to do.

## Variable Declaration

Always declare variables in **a consistent manner**, and at the top of their scope. Keeping variable declarations to _one per line is encouraged_. Comma-first, a single `var` statement, multiple `var` statements, it's all fine, just be consistent across the project, and ensure the team is on the same page.

##### Bad

```js
var foo = 1,
    bar = 2;

var baz;
var pony;

var a
  , b;
```

```js
var foo = 1;

if (foo > 1) {
  var bar = 2;
}
```
##### Good

<sub>Just because they're consistent with each other, not because of the style</sub>

```js
var foo = 1;
var bar = 2;

var baz;
var pony;

var a;
var b;
```

```js
var foo = 1;
var bar;

if (foo > 1) {
  bar = 2;
}
```

Variable declarations that aren't immediately assigned a value are acceptable to share the same line of code.

##### Acceptable

```js
var a = 'a';
var b = 2;
var i, j;
```

## Conditionals

**Brackets are enforced**. This, together with a reasonable spacing strategy will help you avoid mistakes such as [Apple's SSL/TLS bug][5].

##### Bad

```js
if (err) throw err;
```

##### Good

```js
if (err) { throw err; }
```

Avoid using `==` and `!=` operators, always favor `===` and `!==`. These operators are called the "strict equality operators", while [their counterparts will attempt to cast the operands][26] into the same value type.

##### Bad

```js
function isEmptyString (text) {
  return text == '';
}

isEmptyString(0);
// <- true
```

##### Good

```js
function isEmptyString (text) {
  return text === '';
}

isEmptyString(0);
// <- false
```

## Ternary Operators

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices. As a rule, if you can't eye-parse it as fast as your brain can interpret the text that declares the ternary operator, chances are it's probably too complicated for its own good.

jQuery is a prime example of a codebase that's [**filled with nasty ternary operators**][25].

##### Bad

```js
function calculate (a, b) {
  return a && b ? 11 : a ? 10 : b ? 1 : 0;
}
```

##### Good

```js
function getName (mobile) {
  return mobile ? mobile.name : 'Generic Player';
}
```

In cases that may prove confusing just use `if` and `else` statements instead.

## Functions

When declaring a function, always use the [function declaration form][8] instead of [function expressions][7].

##### Bad

```js
var sum = function (x, y) {
  return x + y;
};
```

##### Good

```js
function sum (x, y) {
  return x + y;
}
```

That being said, there's nothing wrong with function expressions that are just [currying another function][10].

##### Good

```js
var plusThree = sum.bind(null, 3);
```

Keep in mind that [function declarations will be hoisted][9] to the top of the scope so it doesn't matter the order they are declared in. That being said, you should always keep functions at the top level in a scope, and avoid placing them inside conditional statements.

##### Bad

```js
if (Math.random() > 0.5) {
  sum(1, 3);
  
  function sum (x, y) {
    return x + y;
  }
}

```

##### Good

```js
if (Math.random() > 0.5) {
  sum(1, 3);
}

function sum (x, y) {
  return x + y;
}
```

```js
function sum (x, y) {
  return x + y;
}

if (Math.random() > 0.5) {
  sum(1, 3);
}
```

If you need a _"no-op"_ method you can use either `Function.prototype`, or `function noop () {}`. Ideally a single reference to `noop` is used throughout the application.

Whenever you have to manipulate the `arguments` object, or other array-likes, cast them to an array.

##### Bad

```js
var i;

for (i = 0; i < arguments.length; i++) {
  console.log(arguments(i));
}
```

##### Good

```js
[].slice.call(arguments).forEach(function (value) {
  console.log(value);
});
```

Don't declare functions inside of loops.

##### Bad

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function () {
    console.log(values[i]);
  }, 1000 * i);
}
```

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    return function () {
      console.log(values[i]);
    };
  }(i), 1000 * i);
}
```

##### Good

```js
var values = [1, 2, 3];
var i;

for (i = 0; i < values.length; i++) {
  wait(i);
}

function wait (i) {
  setTimeout(function () {
    console.log(values[i]);
  }, 1000 * i);
}
```

Or even better, just use `.forEach` which doesn't have the same caveats as declaring functions in `for` loops.

##### Better

```js
[1, 2, 3].forEach(function (value, i) {
  setTimeout(function () {
    console.log(value);
  }, 1000 * i);
});
```

Whenever a method is non-trivial, make the effort to **use a named function declaration rather than an anonymous function**. This will make it easier to pinpoint the root cause of an exception when analyzing stack traces.

##### Bad

```js
function once (fn) {
  var ran = false;
  return function () {
    if (ran) { return };
    ran = true;
    fn.apply(this, arguments);
  };
}
```

##### Good

```js
function once (fn) {
  var ran = false;
  return function run () {
    if (ran) { return };
    ran = true;
    fn.apply(this, arguments);
  };
}
```

Avoid keeping indentation levels from raising more than necessary by using guard clauses instead of flowing `if` statements.

##### Bad

```js
if (car) {
  if (black) {
    if (turbine) {
      return 'batman!';
    }
  }
}
```

```js
if (condition) {
  // 10+ lines of code
}
```

##### Good

```js
if (!car) {
  return;
}
if (!black) {
  return;
}
if (!turbine) {
  return;
}
return 'batman!';
```

```js
if (!condition) {
  return;
}
// 10+ lines of code
```

## Prototypes

Hacking native prototypes should be avoided at all costs, use a method instead. If you must extend the functionality in a native type, try using something like [poser][16] instead.

##### Bad

```js
String.prototype.half = function () {
  return this.substr(0, this.length / 2);
};
```

##### Good

```js
function half (text) {
  return text.substr(0, text.length / 2);
}
```

**Avoid prototypical inheritance models** unless you have a very good _performance reason_ to justify yourself.

- Prototypical inheritance boosts puts need for `this` through the roof
- It's way more verbose than using plain objects
- It causes headaches when creating `new` objects
- Needs a closure to hide valuable private state of instances
- Just use plain objects instead

## Object Literals

Instantiate using the egyptian notation `{}`. Use factories instead of constructors, here's a proposed pattern for you to implement objects in general.

```js
function util (options) {
  // private methods and state go here
  var foo;
  
  function add () {
    return foo++;
  }
  
  function reset () { // note that this method isn't publicly exposed
    foo = options.start || 0;
  }
  
  reset();
  
  return {
    // public interface methods go here
    uuid: add
  };
}
```

## Array Literals

Instantiate using the square bracketed notation `[]`. If you have to declare a fixed-dimension array for performance reasons then it's fine to use the `new Array(length)` notation instead.

It's about time you master array manipulation! [Learn about the basics][19]. It's way easier than you might think.

- [`.forEach`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [`.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [`.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- [`.join`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- [`.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [`.unshift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
- [`.shift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
- [`.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [`.pop`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

Learn and abuse the functional collection manipulation methods. These are **so** worth the trouble.

- [`.filter`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`.map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`.reduce`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`.reduceRight`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
- [`.some`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [`.every`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [`.sort`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [`.reverse`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

## Regular Expressions

Keep regular expressions in variables, don't use them inline. This will vastly improve readability.

##### Bad

```js
if (/\d+/.test(text)) {
  console.log('so many numbers!');
}
```

##### Good

```js
var numeric = /\d+/;
if (numeric.test(text)) {
  console.log('so many numbers!');
}
```

Also [learn how to write regular expressions][20], and what they actually do. Then you can also [visualize them online][21].

## `console` statements

Preferrably bake `console` statements into a service that can easily be disabled in production. Alternatively, don't ship any `console.log` printing statements to production distributions.

## Comments

Comments **aren't meant to explain what** the code does. Good **code is supposed to be self-explanatory**. If you're thinking of writing a comment to explain what a piece of code does, chances are you need to change the code itself. The exception to that rule is explaining what a regular expression does. Good comments are supposed to **explain why** code does something that may not seem to have a clear-cut purpose.

##### Bad

```js
// create the centered container
var p = $('<p/>');
p.center(div);
p.text('foo');
```

##### Good

```js
var container = $('<p/>');
var contents = 'foo';
container.center(parent);
container.text(contents);
megaphone.on('data', function (value) {
  container.text(value); // the megaphone periodically emits updates for container
});
```

```js
var numeric = /\d+/; // one or more digits somewhere in the string
if (numeric.test(text)) {
  console.log('so many numbers!');
}
```

Commenting out entire blocks of code _should be avoided entirely_, that's why you have version control systems in place!

## Variable Naming

Variables must have meaningful names so that you don't have to resort to commenting what a piece of functionality does. Instead, try to be expressive while succint, and use meaningful variable names.

##### Bad

```js
function a (x, y, z) {
  return z * y / x;
}
a(4, 2, 6);
// <- 3
```

##### Good

```js
function ruleOfThree (had, got, have) {
  return have * got / had;
}
ruleOfThree(4, 2, 6);
// <- 3
```

## Polyfills

Where possible use the native browser implementation and include [a polyfill that provides that behavior][22] for unsupported browsers. This makes the code easier to work with and less involved in hackery to make things just work.

If you can't patch a piece of functionality with a polyfill, then [wrap all uses of the patching code][23] in a globally available method that is accessible from everywhere in the application.

## Everyday Tricks

Use `||` to define a default value. If the left-hand value is [falsy][27] then the right-hand value will be used.

```js
function a (value) {
  var defaultValue = 33;
  var used = value || defaultValue;
}
```

Use `.bind` to [partially-apply][10] functions.

```js
function sum (a, b) {
  return a + b;
}

var addSeven = sum.bind(null, 7);

addSeven(6);
// <- 13
```

Use `Array.prototype.slice.call` to cast array-like objects to true arrays.

```js
var args = Array.prototype.slice.call(arguments);
```

Use [event emitters][28] on all the things!

```js
var emitter = contra.emitter();

body.addEventListener('click', function () {
  emitter.emit('click', e.target);
});

emitter.on('click', function (elem) {
  console.log(elem);
});

// simulate click
emitter.emit('click', document.body);
```

Use `Function.prototype` as a _"no-op"_.

```js
function (cb) {
  setTimeout(cb || Function.prototype, 2000);
}
```

## License

MIT

> Fork away!

# }

[1]: http://wiki.commonjs.org/wiki/CommonJS
[2]: http://requirejs.org/docs/whyamd.html
[3]: http://eviltrout.com/2014/05/03/getting-started-with-es6.html
[4]: https://github.com/sindresorhus/editorconfig-sublime
[5]: https://www.imperialviolet.org/2014/02/22/applebug.html
[6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
[7]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function
[8]: http://stackoverflow.com/q/336859/389745
[9]: https://github.com/buildfirst/buildfirst/tree/master/ch05/04_hoisting
[10]: http://ejohn.org/blog/partial-functions-in-javascript/
[11]: https://github.com/mdevils/node-jscs
[12]: http://www.jslint.com/
[13]: https://github.com/jshint/jshint/
[14]: https://github.com/eslint/eslint
[15]: http://nodejs.org/api/util.html#util_util_format_format
[16]: https://github.com/bevacqua/poser
[17]: http://benalman.com/news/2013/01/advice-javascript-semicolon-haters/
[18]: http://www.2ality.com/2011/05/semicolon-insertion.html
[19]: http://blog.ponyfoo.com/2013/11/19/fun-with-native-arrays
[20]: http://blog.ponyfoo.com/2013/05/27/learn-regular-expressions
[21]: http://www.regexper.com/#%2F%5Cd%2B%2F
[22]: http://remysharp.com/2010/10/08/what-is-a-polyfill/
[23]: http://blog.ponyfoo.com/2014/08/05/building-high-quality-front-end-modules
[24]: https://github.com/visionmedia/jade
[25]: https://github.com/jquery/jquery/blob/c869a1ef8a031342e817a2c063179a787ff57239/src/ajax.js#L117
[26]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
[27]: http://james.padolsey.com/javascript/truthy-falsey/
[28]: https://github.com/bevacqua/contra#%CE%BBemitterthing-options
