#SimplBox

SimplBox is a lightweight image lightbox script. SimplBox is written in native JavaScript, that is, it does not depend on any 3rd-party libraries or frameworks such as jQuery or any other.

**Table of Contents**<br>
1. [Why SimplBox](https://github.com/Dendrochronologyy/SimplBox#why-simplbox)<br>
2. [How it works](https://github.com/Dendrochronologyy/SimplBox#how-it-works)<br>
3. [Usage](https://github.com/Dendrochronologyy/SimplBox#usage)<br>
4. [Options](https://github.com/Dendrochronologyy/SimplBox#options)<br>
5. [API](https://github.com/Dendrochronologyy/SimplBox#api)<br>
6. [Demo](https://github.com/Dendrochronologyy/SimplBox#demo)<br>
7. [Changelog](https://github.com/Dendrochronologyy/SimplBox#changelog)<br>
8. [Licence](https://github.com/Dendrochronologyy/SimplBox#licence)<br>


## Why SimplBox?
* SimplBox is written in **pure JavaScript** thus it does not depend on 3rd-party libraries such as jQuery.
* SimplBox is **responsive and touch-friendly** lightbox. 
* SimplBox is **Windows Phone 7/8/8.1, Android and iPhone** compatible.
* SimplBox is relatively **lightweight** for what it offers. 2.42KB gzipped (7.62KB uncompressed)
* SimplBox uses **hardware acceleration** for animations. 
* SimplBox works on both hardware accelerated devices and non-hardware accelerated devices such as infamous **Internet Explorer 8**.


## How it works?
At it's most basic, it simply creates an image element `<img/>` and appends it on the document. This however means that you must supply your own CSS styles separately.

```html
<!-- When thumbnail image or whatever you are using as trigger, this element will appear on the document. -->
<img src="picture.jpeg" alt="Picture description" id="simplbox" />
```

As for it goes with CSS styles, there is no default CSS therefore everything is up to you to design. However for the best user experience I recommend:

```css
/* Removes infamous 300ms touch delay */
html {
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}

#simplbox {
  z-index: 9999; /* Use whatever you want */
  ms-touch-action: none; /* Removes touch action */
  touch-action: none; /* Removes touch action */
}
```


## Usage
First, let's create an element:

```html
<a href="link/to/my/picture/full.jpg" data-simplbox>
	<img src="link/to/my/picture/thumbnail.jpg" alt="My image description that will be used"/>
</a>
```

Include `simplbox.js` script in your page and then:

```javascript
// Get elements.
var myelement = document.querySelectorAll("[data-simplbox]");
// Get constructor.
var simplbox = new SimplBox(myelement);
// Initialize.
simplbox.init();
```

Click on your image and lightbox will appear. See the demo for examples and inspiration.


## Options
SimplBox also accepts an options object to alter the way it behaves. You can the default options by inspecting SimplBox.options as follwing:

```javascript
{
    imageElementId: "simplbox", // Name that will be assigned to created image element as id.

    fadeInDistance: 100, // The distance that will be used for fading in when navigating between images via keyboard or touch screen.
    animationSpeed: 350, // The animation speed that will be used when image fades in.
    imageSize: 0.8, // This is used when image is bigger than user's viewport that is image is bigger than device's screen and therefore it will be scaled down by this multipler.

    quitOnImageClick: true, // Boolean variable whether to quit on image click or not.
    quitOnDocumentClick: false, // Boolean variable whether to quit on document click or not.
    enableKeyboard: true, // Boolean variable whether to enable keyboard support for navigating images or not.

    onImageLoadStart: function () {}, // Function that will be called when image caching and appearing process starts.
    onImageLoadEnd: function () {}, // Function that will be called when image has been cached and appears on the device's screen.
    onStart: function () {}, // Function that will be called when lightbox appears on device's screen.
    onEnd: function () {} // Function that will be called when lightbox disappears from device's screen.
};
```


## Demo
http://genert.laal.ee/demo/simplbox/


## Changelog
### v 1.0.0 (2014/8/4) ###
* First release.


## MIT Licence
Copyright © 2014 Dendrochronology

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
