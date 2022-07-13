---
title: Open Ai conversations
author: Sebas
date: 2021-10-16
layout: page
---

Those are conversations I had with GPT-3:

_______________________________________________

For this SVG:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="yellow" id="face" />
  <circle cx="35" cy="35" r="5" fill="black" id="eye1" />
  <circle cx="65" cy="35" r="5" fill="black" id="eye2" />
  <path d="M50,80 C35,80 35,65 50,65" stroke="black" stroke-width="5" fill="none" id="mouth" />
</svg>
```

Can you write code with GSAP that moves the mouth up and down 5pixels ?

```js
var tl = new TimelineMax();

tl.to("#mouth", 1, {y: -5, repeat: -1, yoyo: true});
```

Can you write code with snap.svg that moves the mouth up and down 5pixels ?

```js
var mouth = Snap("#mouth");

mouth.animate({y: -5}, 1000, mina.bounce);
```

Can you write code that moves the mouth up and down 5pixels ?

```js
var mouth = document.getElementById("mouth");

mouth.animate([
  // keyframes
  { transform: 'translateY(0px)' }, 
  { transform: 'translateY(-5px)' }
], { 
  // timing options
  duration: 1000,
  iterations: Infinity
});
```

Which way is recommended ?

There is no definitive answer, but GSAP is generally considered more powerful and easy to use than other animation libraries.

______________________________________________

For this SVG:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="yellow" id="face" />
  <circle cx="35" cy="35" r="5" fill="black" id="eye1" />
  <circle cx="65" cy="35" r="5" fill="black" id="eye2" />
  <path d="M50,80 C35,80 35,65 50,65" stroke="black" stroke-width="5" fill="none" id="mouth" />
</svg>
```

The d attribute corresponds to an open mouth. Can you write d attribute of the mouth when it is closed ?

The d attribute for a closed mouth would be "M50,80 C35,80 65,80 50,65".

Can you write js code that morphs the d attribute of the mouth path from open to closed in 500ms in an infinite loop ?
```js
var mouth = document.getElementById("mouth");

function closeMouth() {
  mouth.setAttribute("d", "M50,80 C35,80 65,80 50,65");
}

function openMouth() {
  mouth.setAttribute("d", "M50,80 C35,80 35,65 50,65");
}

setInterval(function() {
  closeMouth();
  setTimeout(openMouth, 500);
}, 1000);
```

______________________________________

The bash commands available are:

- add {task name}: Create a task
- get {name}: returns task id from the name
- remove {name}: removes a task
- duration {id} {duration}: sets the duration of a task
- start {id} {hour}.: sets the starting hour of the task

Can you write the commands that creates 3 tasks:
- Buy bread from 9 lasting 5mn
- Clean Shoes from 10 lasting 30mn
- Implement this lasting 60mn

```bash
add Buy bread
get Buy bread
duration Buy bread 5
start Buy bread 9

add Clean Shoes
get Clean Shoes
duration Clean Shoes 30
start Clean Shoes 10

add Implement this
get Implement this
duration Implement this 60
start Implement this
```

Amazing !!!!
