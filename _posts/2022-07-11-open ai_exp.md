---
title: The future of cinema
author: Sebas
date: 2021-10-16
layout: page
---

This is a conversation I had with GPT-3:

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