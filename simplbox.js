/***
* SimplBox - v1.0.0 - 2014.08.02
* Author: (c) Dendrochronology - @Dendrochronolo - http://genert.laal.ee/
* Available for use under the MIT License.
***/
;(function (window, document, undefined) {
    "use strict";

    var docElem = document.documentElement,
        bodyElem = document.getElementsByTagName("body")[0],

        FALSE = false,
        ATTACHEVENT = "attachEvent",
        ADDEVENTLISTENER = "addEventListener",

        isEventListener = ADDEVENTLISTENER in document;

    function SimplBox (p_Elements, p_Options) {
        var base = this;

        base.m_Elements = p_Elements;
        base.m_UserOptions = p_Options || {};
        base.m_Options = {};

        base.m_CurrentTargetElements = FALSE;
        base.m_CurrentTargetElementsLength = FALSE;
        base.m_CurrentTargetNumber = FALSE;
        base.m_CurrentImageElement = FALSE;
        base.m_InProgress = FALSE;
        base.m_InstalledImageBox = FALSE;
        base.m_Alt = FALSE;
        base.m_AnimateDone = FALSE; // For browsers that do not support hardware acceleration.

        var __construct = function () {
            for (var i in SimplBox.options) {
                base.m_Options[i] = base.m_UserOptions[i] || SimplBox.options[i];
            }
        }();
    }

    SimplBox.prototype = {
        init: function () {
            var base = this;

            // API start
            base.API_AddEvent = base.addEvent;
            base.API_RemoveImageElement = base.removeImageElement;
            // API end

            base.checkBrowser();

            base.addEvents();
        },

        checkBrowser: function () {
            var base = this,
                getPrefix = function () {
                    var rootStyle = docElem.style;

                    if (rootStyle.WebkitTransition == "") return "-webkit-";
                    if (rootStyle.MozTransition == "") return "-moz-";
                    if (rootStyle.msTransition == "") return "-ms-";
                    if (rootStyle.OTransition == "") return "-o-";
                    if (rootStyle.KhtmlTransition == "") return "-khtml-";
                    if (rootStyle.transition == "") return "";

                    return FALSE;
                },
                isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints || navigator.maxTouchPoints || FALSE;

            base.browser = {
                "isHardwareAccelerated": (getPrefix() == FALSE ? FALSE : true),
                "isTouch": isTouch,
                "prefix": (getPrefix() == FALSE ? FALSE : getPrefix())
            };
        },

        addEvents: function () {
            var base = this;

            // Add click events on base elements.
            for (var i = 0; i < base.m_Elements.length; i++) {
                (function (i) {
                    base.addEvent(base.m_Elements[i], "click", function (event) {
                        event.preventDefault();

                        if (base.isFunction(base.m_Options.onStart())) {
                            base.m_Options.onStart(this);
                        }

                        base.m_CurrentTargetElements = base.m_Elements;
                        base.m_CurrentTargetElementsLength = base.m_Elements.length;
                        base.m_CurrentTargetNumber = i;

                        base.openImage(base.m_Elements[base.m_CurrentTargetNumber]);
                    });
                })(i);
            }

            // Add resize event on window.
            base.addEvent(window, "resize", function (event) {
                base.calculateImagePositionAndSize(base.m_CurrentImageElement, true);
            });

            // Add keyboard support.
            base.leftAnimationFunction = function () {
                if (base.m_CurrentTargetNumber - 1 < 0) {
                    base.openImage(base.m_CurrentTargetElements[base.m_CurrentTargetElementsLength - 1], "left");
                    base.m_CurrentTargetNumber = base.m_CurrentTargetElementsLength - 1;
                } else {
                    base.openImage(base.m_CurrentTargetElements[base.m_CurrentTargetNumber - 1], "left");
                    base.m_CurrentTargetNumber = base.m_CurrentTargetNumber - 1;
                }
            };

            base.rightAnimationFunction = function () {
                if (base.m_CurrentTargetNumber + 1 > base.m_CurrentTargetElementsLength - 1) {
                    base.openImage(base.m_CurrentTargetElements[0], "right");
                    base.m_CurrentTargetNumber = 0;
                } else {
                    base.openImage(base.m_CurrentTargetElements[base.m_CurrentTargetNumber+1], "right");
                    base.m_CurrentTargetNumber = base.m_CurrentTargetNumber + 1;
                }
            };

            if (base.m_Options.enableKeyboard) {
                var keyBoard = {
                    left: 37,
                    right: 39,
                    esc: 27
                },
                keyDownEventFunction = function (event) {
                    event.preventDefault();

                    if (base.m_CurrentImageElement) {
                        switch (event.keyCode) {
                            case keyBoard.esc: base.removeImageElement(); return false;
                            case keyBoard.right: base.rightAnimationFunction(); return false;
                            case keyBoard.left: base.leftAnimationFunction(); return false;
                        }
                    }
                };

                base.addEvent(window, "keydown", keyDownEventFunction);
            }

            if (base.m_Options.quitOnDocumentClick) {
                var documentClickEventFunction = function (event) {
                    var target = event.target ? event.target : event.srcElement;

                    event.preventDefault();

                    if (base.m_InProgress) {
                        return false;
                    }

                    if (target && target.id !== base.m_Options.imageElementId && base.m_InstalledImageBox && !base.m_InProgress) {
                        base.removeImageElement();
                        return false;
                    }
                }

                base.addEvent(bodyElem, "click", documentClickEventFunction);
            }
        },

        openImage: function (p_Source, p_Direction) {
            var base = this,
                documentFragment = document.createDocumentFragment(),
                imageElement = document.createElement("img"),
                imageElementControl = document.getElementById(base.m_Options.imageElementId),
                transformCssText = "";

            // If no 1 argument or 1 argument's tagname is not A, return.
            if (!p_Source || p_Source.tagName.toLowerCase() !== "a") {
                return;
            }

            if (imageElementControl) {
                bodyElem.removeChild(imageElementControl);
                base.m_CurrentImageElement = FALSE;
                base.m_InstalledImageBox = FALSE;
            }

            base.m_Alt = p_Source.firstChild.getAttribute("alt");
            base.m_InProgress = true;

            // Check if it funcion and return.
            if (base.isFunction(base.m_Options.onImageLoadStart())) {
                base.m_Options.onImageLoadStart();
            }

            // Set direction
            if (typeof p_Direction !== "undefined") {
                switch (p_Direction) {
                    case "left": p_Direction = -1; break;
                    case "right": p_Direction = 1; break;
                }
            }

            if (base.browser.isHardwareAccelerated && typeof p_Direction !== "undefined") {
                transformCssText = "transform: translateX(" + (p_Direction * base.m_Options.fadeInDistance) + "px);";
            }

            // Set attributes of new image element.
            imageElement.setAttribute("id", base.m_Options.imageElementId);
            imageElement.setAttribute("src", p_Source.getAttribute("href"));
            imageElement.setAttribute("alt", base.m_Alt);
            imageElement.setAttribute("style", "position: fixed; cursor: pointer; opacity: 0;" + base.browser.prefix + "transition: opacity " + base.m_Options.animationSpeed + "ms ease, transform " + base.m_Options.animationSpeed + "ms ease;" + transformCssText);

            // Append to fragment and append fragment to body.
            documentFragment.appendChild(imageElement);
            bodyElem.appendChild(documentFragment);

            // Set current image element.
            base.m_CurrentImageElement = document.getElementById(base.m_Options.imageElementId);
            base.m_CurrentImageElement.style.filter = 'alpha(opacity=0)'; // IE 8 opacity

            // Calculate image position and size and set them.
            base.calculateImagePositionAndSize(base.m_CurrentImageElement, FALSE, p_Direction);
                    
            // Add event listener.
            if (base.m_Options.quitOnImageClick) {
                base.addEvent(base.m_CurrentImageElement, "click", function (event) {
                    event.preventDefault();
                    base.removeImageElement();
                });
            }

            // Touch events.
            if (base.browser.isTouch) { // This check fixes bug in IE 10 & 11 because these browsers have pointers for odd reason(s).
                var touchXStart = -1,
                    touchXEnd = -1,
                    swipeDifference = 0;
            
                base.addEvent(base.m_CurrentImageElement, "touchstart pointerdown MSPointerDown", function (event) {
                    event.preventDefault();
            
                    touchXStart = event.pageX || event.touches[0].pageX;
                });
            
                base.addEvent(base.m_CurrentImageElement, "touchmove pointermove MSPointerMove", function (event) {
                    event.preventDefault();
            
                    touchXEnd = event.pageX || event.touches[0].pageX;
            
                    swipeDifference = touchXStart - touchXEnd;
            
                    if (base.browser.isHardwareAccelerated) {
                        base.m_CurrentImageElement.style[base.browser.prefix + "transition"] = "none";
                        base.m_CurrentImageElement.style[base.browser.prefix + "transform"] = "translateX(" + -swipeDifference + "px)";
                    }
                });
            
                base.addEvent(base.m_CurrentImageElement, "touchend pointerup pointercancel MSPointerUp MSPointerCancel", function (event) {
                    event.preventDefault();
            
                    if (Math.abs(swipeDifference) > 75) {
                        if (swipeDifference < 0) {
                            base.leftAnimationFunction();
                        } else {
                            base.rightAnimationFunction();
                        }
                    } else {
                        base.m_CurrentImageElement.style[base.browser.prefix + "transition"] = "all 200ms cubic-bezier(.52,.31,.47,1)";
                        base.m_CurrentImageElement.style[base.browser.prefix + "transform"] = "translateX(0px)";
                    }
                });
            }
        },

        calculateImagePositionAndSize: function (p_Element, p_Resize, p_Direction) {
            var base = this,
                temporaryImageObject = new Image(),
                imageWidth = 0,
                imageHeight = 0,
                imageSizeRatio = 0;

            // If no element provided, quit.
            if (!p_Element) {
                return;
            }

            base.m_ImageSource = p_Element.getAttribute("src"); // Get element's source attribute for loading image.
            base.m_ScreenHeight = window.innerHeight || docElem.offsetHeight; // Get window height.
            base.m_ScreenWidth = window.innerWidth || docElem.offsetWidth; // Get window width.

            temporaryImageObject.onload = function () {
                var thisImageWidth = this.width,
                    thisImageHeight = this.height;

                imageWidth = thisImageWidth;
                imageHeight = thisImageHeight;
                imageSizeRatio = imageWidth / imageHeight;

                // Height of image is too big to fit in viewport
                if (Math.floor(base.m_ScreenWidth / imageSizeRatio) > base.m_ScreenHeight) {
                    imageWidth = base.m_ScreenHeight * imageSizeRatio * base.m_Options.imageSize;
                    imageHeight = base.m_ScreenHeight * base.m_Options.imageSize
                } else { // Width of image is too big to fit in viewport
                    imageWidth = base.m_ScreenWidth * base.m_Options.imageSize;
                    imageHeight = base.m_ScreenWidth / imageSizeRatio * base.m_Options.imageSize;
                }

                if (imageWidth > thisImageWidth) {
                    imageWidth = thisImageWidth;
                }

                if (imageHeight > thisImageHeight) {
                    imageHeight = thisImageHeight;
                }

                // Set style attributes.
                p_Element.style.top = ((base.m_ScreenHeight - imageHeight) / 2) + "px";
                p_Element.style.left = ((base.m_ScreenWidth - imageWidth) / 2) + "px";
                p_Element.style.width = Math.floor(imageWidth) + "px";
                p_Element.style.height = Math.floor(imageHeight) + "px";

                if (!p_Resize) {
                    setTimeout(function () {
                        if (base.browser.isHardwareAccelerated) {
                            p_Element.style.opacity = 1;
                            p_Element.style.transform = "translateX(0px)";
                        } else {
                            var toOpacity = 1;

                            base.animate({
                                delay: 16,
                                duration: base.m_Options.animationSpeed,
                                delta: base.linear,
                                step: function (delta) {
                                    p_Element.style.opacity = (toOpacity * delta);
                                    p_Element.style.filter = "alpha(opacity=" + ((toOpacity * delta) * 100 ) + ")"; 
                                }
                            })
                        }

                        base.m_InProgress = FALSE;
                        base.m_InstalledImageBox = true;

                        if (base.isFunction(base.m_Options.onImageLoadEnd())) {
                            base.m_Options.onImageLoadEnd(p_Element);
                        }
                    }, 100);
                }
            };

            // Must be last because otherwise onload function won't be load.
            temporaryImageObject.src = base.m_ImageSource;
        },

        removeImageElement: function () {
            var base = this;

            if (!base.m_CurrentImageElement) {
                return;
            }

            if (base.isFunction(base.m_Options.onEnd())) {
                base.m_Options.onEnd();
            }

            if (base.browser.isHardwareAccelerated) {
                base.m_CurrentImageElement.style.opacity = 0;
                base.m_CurrentImageElement.style.transition = "opacity 250ms ease";
            } else {
                var toOpacity = 0;

                base.animate({
                    delay: 16,
                    duration: 250,
                    delta: base.linear,
                    step: function (delta) {
                        base.m_CurrentImageElement.style.opacity = (toOpacity * delta);
                        base.m_CurrentImageElement.style.filter = "alpha(opacity=" + ((toOpacity * delta) * 100 ) + ")"; 

                    }
                });
            }

            setTimeout(function () {
                if (base.m_CurrentImageElement) {
                    base.m_CurrentImageElement.parentNode.removeChild(base.m_CurrentImageElement);
                }

                base.m_CurrentImageElement = FALSE;
                base.m_InstalledImageBox = FALSE;
            }, 350);
        },

        isFunction: function (p_Function) {
            return !!(p_Function && p_Function.constructor && p_Function.call && p_Function.apply);
        },

        addEvent: function (p_Elements, p_Events, p_Callback) {
            p_Events = p_Events.split(" ");

            if (!p_Elements.length) {
                for (var i = 0; i < p_Events.length; i++) {
                    if (isEventListener) {
                        p_Elements.addEventListener(p_Events[i], p_Callback, false);
                    }
                }
            } else {
                for (var i = 0; i < p_Elements.length; i++) {
                    for (var j = 0; j < p_Events.length; j++) {
                        if (isEventListener) {
                            p_Elements[i].addEventListener(p_Events[j], p_Callback, false);
                        }
                    }
                }
            }
        },

        animate: function (p_Options) {
            var base = this,
                star = new Date();

            var id = setInterval(function () {
                var timePassed = new Date() - start,
                    progress = timePassed / p_Options.duration;

                if (progress > 1) {
                    progress = 1;
                }
    
                var delta = p_Options.delta(progress)
                p_Options.step(delta)
    
                if (progress == 1) {
                    base.m_AnimateDone = true;
                    clearInterval(id)
                }
            }, p_Options.delay || 10);
        },

        linear: function (progress) {
            return progress;
        }
    };

    SimplBox.options = {
        imageElementId: "simplbox",

        fadeInDistance: 100,
        animationSpeed: 350,
        imageSize: 0.8,

        quitOnImageClick: true,
        quitOnDocumentClick: false,
        enableKeyboard: true,

        onImageLoadStart: function () {},
        onImageLoadEnd: function () {},
        onStart: function () {},
        onEnd: function () {}
    };

    window.SimplBox = SimplBox;
})(window, document); 