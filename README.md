# animate-scroll-to-hash

## Installing

Using npm:

```bash
$ npm install animate-scroll-to-hash
```

## How to use

```js
const AnimateScrollToHash = require('animate-scroll-to-hash');
new AnimateScrollToHash(); // set listeners to all links with hash on page
```

## Config

You can pass the configuration object to the constructor.
<br><br>
If you want set listeners on links only to children of block:
```js
new AnimateScrollToHash({
  block: document, // node where search links. default: document
});
```
If you have fixed header element, you may set margin:
```js
new AnimateScrollToHash({
  margin: 60, // top margin after scrolling (px). default: 0
});
```
If height of header may vary depending on screen width:
```js
new AnimateScrollToHash({
  margin: {
    0: 60, // if client width more or equal 0.
    960: 80, // if client width more or equal 960.
  },
});
```
You can change animation duration
```js
new AnimateScrollToHash({
  transition: 500, // animation duration (ms). default: 500
});
```