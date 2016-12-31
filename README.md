# Code Poetry: Easing Tutorial & Optimizations

# Table of Contents

* Demos
* Pictures
 * Easing Cheat Sheet
 * Comparision of easing functions
* TL:DR; Overview
* Easing ... what is it and why is it important?
* Parameter `t` or `p`
* Simultaneous Animations
* Cleanup
* Why Javascript
* The Color Axis
* Interpolation
* De Facto Easing Functions
* Easing Cleanup
 * Cleanup - Linear
 * Cleanup - In Back
 * Cleanup - In Bounce
 * Cleanup - In Circle
 * Cleanup - In Cubic
 * Cleanup - In Elastic
 * Cleanup - In Exponent 2
 * Cleanup - In Exponent e
 * Cleanup - In Log10
 * Cleanup - In Octic
 * Cleanup - In Quadratic
 * Cleanup - In Quartic
 * Cleanup - In Septic
 * Cleanup - In Sextic
 * Cleanup - In Sine


# Demos (HTML + Javascript)

* [Compare Demo](https://htmlpreview.github.io/?https://github.com/Michaelangel007/easing_optimizations/blob/master/compare.html)
* [Graph   Demo](https://htmlpreview.github.io/?https://github.com/Michaelangel007/easing_optimizations/blob/master/graph.html)


# Pictures

## Easing Cheet Sheet

![Cheat Sheet 1080p](pics/easing_cheat_sheet_1080.png)

There is also a high resolution [4861x4000 Cheat Sheet](pics/easing_cheat_sheet.png)

## Comparision of easing functions

* Start of animation
![Begin](pics/begin.png)

* Middle of animation
![Middle](pics/middle.png)

* End of animation
![End](pics/end.png)


# TL:DR; Overview

This a tutorial in how to:

* understand easing functions
* how to implement them,
* how to optimize them, and
* how to write beautiful code such as:

```
// Optimized Easing Functions by Michael Pohoreski
// https://github.com/Michaelangel007/easing_optimizations
// License: Free as in speech and beer; Attribution is always appreciated!
// Note: Please keep the URL so people can refer back to how these were derived.
var EasingFuncs = // Array of Functions
[
// Power -- grouped by In,Out,InOut
    function None          (p)  { return 1;               }, // p^0 Placeholder for no active animation
    function Linear        (p)  { return p;               }, // p^1 Note: In = Out = InOut
    function InQuadratic   (p)  { return p*p;             }, // p^2 = Math.pow(p,2)
    function InCubic       (p)  { return p*p*p;           }, // p^3 = Math.pow(p,3)
    function InQuartic     (p)  { return p*p*p*p;         }, // p^4 = Math.pow(p,4)
    function InQuintic     (p)  { return p*p*p*p*p;       }, // p^5 = Math.pow(p,5)
    function InSextic      (p)  { return p*p*p*p*p*p;     }, // p^6 = Math.pow(p,6)
    function InSeptic      (p)  { return p*p*p*p*p*p*p;   }, // p^7 = Math.pow(p,7)
    function InOctic       (p)  { return p*p*p*p*p*p*p*p; }, // p^8 = Math.pow(p,8)

    function OutQuadratic  (p)  { var m=p-1; return 1-m*m;             },
    function OutCubic      (p)  { var m=p-1; return 1+m*m*m;           },
    function OutQuartic    (p)  { var m=p-1; return 1-m*m*m*m;         },
    function OutQuintic    (p)  { var m=p-1; return 1+m*m*m*m*m;       },
    function OutSextic     (p)  { var m=p-1; return 1-m*m*m*m*m*m;     },
    function OutSeptic     (p)  { var m=p-1; return 1+m*m*m*m*m*m*m;   },
    function OutOctic      (p)  { var m=p-1; return 1-m*m*m*m*m*m*m*m; },

    function InOutQuadratic(p)  { var m=p-1,t=p*2; if (t < 1) return p*t;             return 1-m*m            *  2; },
    function InOutCubic    (p)  { var m=p-1,t=p*2; if (t < 1) return p*t*t;           return 1+m*m*m          *  4; },
    function InOutQuartic  (p)  { var m=p-1,t=p*2; if (t < 1) return p*t*t*t;         return 1-m*m*m*m        *  8; },
    function InOutQuintic  (p)  { var m=p-1,t=p*2; if (t < 1) return p*t*t*t*t;       return 1+m*m*m*m*m      * 16; },
    function InOutSextic   (p)  { var m=p-1,t=p*2; if (t < 1) return p*t*t*t*t*t;     return 1-m*m*m*m*m*m    * 32; },
    function InOutSeptic   (p)  { var m=p-1,t=p*2; if (t < 1) return p*t*t*t*t*t*t;   return 1+m*m*m*m*m*m*m  * 64; },
    function InOutOctic    (p)  { var m=p-1,t=p*2; if (t < 1) return p*t*t*t*t*t*t*t; return 1-m*m*m*m*m*m*m*m*128; },

// Standard -- grouped by Type
    function InBack        (p)  { var              k = 1.70158        ;              return p*p*(p*(k+1) - k);                                        },
    function InOutBack     (p)  { var m=p-1,t=p*2, k = 1.70158 * 1.525; if (p < 0.5) return p*t*(t*(k+1) - k); else return 1 + 2*m*m*(2*m*(k+1) + k); }, // NOTE: Can go negative! i.e. p = 0.008
    function OutBack       (p)  { var m=p-1,       k = 1.70158        ;                                             return 1 +   m*m*(  m*(k+1) + k); },

    function InBounce      (p)  { return 1 - EasingFuncs[ Easing.OUT_BOUNCE ]( 1-p ); },
    function InOutBounce   (p)  {
                                    var t = p*2;
                                    if (t < 1) return 0.5 - 0.5*EasingFuncs[ Easing.OUT_BOUNCE ]( 1 - t );
                                    return            0.5 + 0.5*EasingFuncs[ Easing.OUT_BOUNCE ]( t - 1 );
                                },
    function OutBounce     (p)  {
                                    var r  = 1  / 2.75; // reciprocal
                                    var k1 =         r; // 36.36%
                                    var k2 = 2     * r; // 72.72%
                                    var k3 = 1.5   * r; // 54.54%
                                    var k4 = 2.5   * r; // 90.90%
                                    var k5 = 2.25  * r; // 81.81%
                                    var k6 = 2.625 * r; // 95.45%
                                    var k0 = 7.5625, t;

                                    /**/ if (p < k1) {             return k0 * p*p;            }
                                    else if (p < k2) { t = p - k3; return k0 * t*t + 0.75;     } // 48/64
                                    else if (p < k4) { t = p - k5; return k0 * t*t + 0.9375;   } // 60/64
                                    else             { t = p - k6; return k0 * t*t + 0.984375; } // 63/64
                                },
    function InCircle      (p)  {                             return  1-Math.sqrt( 1 - p*p );                                                      },
    function InOutCircle   (p)  { var m=p-1,t=p*2; if (t < 1) return (1-Math.sqrt( 1 - t*t ))*0.5; else return (Math.sqrt( 1 - 4*m*m ) + 1) * 0.5; },
    function OutCircle     (p)  { var m=p-1      ;                                                      return  Math.sqrt( 1 -   m*m );            },

    function InElastic     (p)  { var m = p-1; return  - Math.pow( 2,10*m  ) * Math.sin( ( m*40 - 3) * Math.PI/6  ); },
    function InOutElastic  (p)  {
                                    var s = 2*p-1;                 // remap: [0,0.5] -> [-1,0]
                                    var k = (80*s-9) * Math.PI/18; // and    [0.5,1] -> [0,+1]

                                    if (s < 0) return   -0.5*Math.pow(2, 10*s) * Math.sin( k );
                                    else       return 1 +0.5*Math.pow(2,-10*s) * Math.sin( k );
                                },
    function OutElastic    (p)  {              return 1+(Math.pow( 2,10*-p ) * Math.sin( (-p*40 - 3) * Math.PI/6 )); },

    // NOTE: 'Exponent2' needs clamping for 0 and 1 respectively
    function InExponent2   (p)  {   if (p <= 0) return 0; return   Math.pow( 2,  10*(p-1) ); },
    function InOutExponent2(p)  {
                                    if (p <= 0) return 0;
                                    if (p >= 1) return 1;
                                    if (p <0.5) return             Math.pow( 2,  10*(2*p-1)-1);
                                    else        return           1-Math.pow( 2, -10*(2*p-1)-1);
                                },
    function OutExponent2  (p)  {   if (p >= 1) return 1; return 1-Math.pow( 2, -10* p    ); },

    function InSine        (p)  { return      1 - Math.cos( p * Math.PI*0.5 );  },
    function InOutSine     (p)  { return 0.5*(1 - Math.cos( p * Math.PI     )); },
    function OutSine       (p)  { return          Math.sin( p * Math.PI*0.5 );  },
];
```

But we're getting ahead of ourselves ...



## Easing ... what is it and why is it important?

In UI (User Interface) design, or CG (Computer Graphics) rendering, often times
we want to animate some "thing" over time. For eample:

* fade out an object (e.g. transistion alpha from 1.0 to 0.0),
* interpolate its location so it "slides offscreen" (e.g. change x (or y) over time), or
* the "reverse" animation of one of the above

Before we can do that we first need to know four things ..

* The `start` value
* The `end`   value
* The `duration` of the animation
* The current `elapsed` time

... then we can calculate the current value. Once we have all the variables we
can use this equation:

```
    current = start + (end-start)*(elapsed/duration);
```

The _units_ of the initial `start` and final `end` values can be anything we wish
as long as they all have the same consistent units. We could be animating something
in _px_ (pixels), over _m/s_ (meters/second), etc. It doesn't matter.

Likewise the `duration` and `elapsed` time could be in seconds, or milliseconds,
etc., as long as we are again consistent and use the same units.  Our
calculations would be incorrect if we mixed the units -- say `duration` was in
seconds and `elapsed` in milliseconds.  Hey, even _rocket scientists_ sometimes
have trouble with this concept in practice -- don't pull a NASA. :-)

For example, a designer wants us to animate an dialog panel from 30 pixels to 40 pixels
over 10 seconds. We draw the screen at 60 times a second.  What would be the current
value (i.e. position) after 2 seconds?

Yes, this is a trivial example, but bear with me.

Our _knowns_:

    start     = 30 px
    end       = 40 px
    elapsed   =  2 seconds
    duration  = 10 seconds
    framerate = 60 Hz

**Note:** The framerate was _extraneous_ information. It never hurts to
_categorize_ ALL the information. We can always discard, or ignore,
information that isn't pertinent to the problem.

Anyways, solving for the unknown _current_ `position`:

    position = start + (elapsed/duration)*(end-start);
    position = 30 + (2/10)*(40-30)
    position = 30 + (0.2*10)
    position = 30 + 2
    position = 32 px

If you don't have an intuitive feel for what easing is then maybe this alternative
**analogy** might help.  Mathematically, easing is the _same concept as
calculating distance_ from Physics:

For example, when we have constant, linear motion we use the formula:

```
    Velocity = Distance/Time
```

And, solving for `distance`:

```
    Distance = Velocity*Time
```

Digressing slightly, in Physics `Time`, really is the `Elapsed` time, starting from zero.
We'll avoid sloppy ambigious terms like `Time` to minimize confusion.

Getting back on-topic. Note, that this is _relative_ distance.

If we have an **absolute** start and end position the formula becomes:

```
    Position = Start + (End-Start)*(Elapsed/Duration)
```

Where did this formula come from?

We can replace `Velocity` with `(Distance/Time)` and re-solving for this new equation:

```
    Distance = Velocity*Time

    Position = Start + Velocity*Elapsed
    Position = Start + (Difference/Durationo)*Elapsed
    Position = Start + (End-Start)*Elapsed
```

Notice how if `start` is zero the formula becomes the common:

```
    Position = 0 + (End-0)*(Elapsed/Duration)
    Position = End*(Elapsed/Duration)
    Distance = (End/Duration)*Elapsed
    Distance = Velocity*Elapsed
    Distance = Velocity*Time
```

Now as programmers we love to invent our own terminology.

However, instead of a "hard-coded" formula we:

1. we call animation the name _"easing"_, and
2. paramaterize it.

What the heck is _Parameterization_ ?

_Parameterization_ is just a fancy word for abstraction or _generalizing_.
Instead of using a hard-coded fixed function we instead use a
generic or custom function. We'll discuss this more later.

Remember, our easing function looks like:

```
    position = start + (end - start)*(elapsed/duration);
```

As a function, it might look like:

```
    position = Easing( ... )
```

With parameterization, it might look like:

```
    position = Easing( type, ... )
```

But before we can calculate the final position we need the relevent information:

```
    position = Easing( type, elapsed/duration, start, end )
```

We'll get to easing `types` shortly but first we need to talk about time.



## Parameter `t` or `p`

That `elapsed / duration` term is kind of clunky.

For _convenience_ we _normalize_ time to be a **normalized percentage**
of the elapsed time.  Now that is a bit of a mouthful, so let's break it down
into simpler terms:

 * _Percentage_ means between 0% and 100%,
 * _Normalized_ in this context means between 0.0 and 1.0. Mathematically the range is
 [0,1], that is, between 0.0 (inclusive) and 1.0 (inclusive).
 See my StackOverflow answer about [What does the square bracket and parenthesis mean?](http://stackoverflow.com/a/37171635/1339447)

Since `normalized percentage` is so common and unweidly most people just use the
shorted `normalized` phrase to mean this value is inbetween 0.0 and 1.0.

If you are familiar with OpenGL or DirectX graphic API's,
when a vertex is tranformed through the pipleine you will run across something
called _"Normalized Device Coordinates"_ which embody the same idea.

If we wanted to place an object at the middle of the screen we could place
its center point at:

 * `<screen width/2, screen height/2, 0.0>` (in pixels),

OR, in normalized coordinates:

 * `<0.5, 0.5>` -- basically half the width, and half the height.

Getting back to our normalized time value `p` ...

```
    p = elapsed / duration.
```

What does this mean?  Visually when `p` is:

| p  | Animation ... |
|:---|:--------------|
| 0.0| ... has not yet started -- the object is still at its initial value |
| 0.5| ... is half way done |
| 1.0| ... is complete -- the object has reached its final value |


**Note**: Often you'll see the paramater name `t` in formulas.  I'll avoid it since
it can be confused with `time` which _may_ or _may not_ be normalized.  UGH.

Instead, I'll use the variable `p` as a visual mnemonic that we are representing
a normalized percentage time, that is, `elapsed/duration`.


## Simultaneous Animations

There is no reason why we couldn't even have multiple simulataneous animations
on the _same_ object all going on at once!  Typically objects have more then
one dimension, such as eight dimensions (8D).

Eight dimensions!?

Whoa! Where did all those come from? When did this turn into String Theory? :-)

Relax, we're not talking about the esoteric nature of reality,
only simulating some of the useful bits, pardon the pun.

For example we could have:

* an object starts faded out (alpha = 0.0),
* is offscreen (start x = -width of object),
* starts small (start width & height = 1 px)
* slides in to the center of the screen (final x = screen width/2), and
* becomes opaque (alpha = 1.0)
* grows to full size (end width & height = 1920x1080 px respectively)

These animation or easing `axis` are all **independent.**  We could represent
these axis in Javascript as:

```
var Axis =
{
    X   : 0, // left position    (in pixels)
    Y   : 1, // top  position    (in pixels)
    W   : 2, // width  dimension (in pixels)
    H   : 3, // height dimension (in pixels)
    R   : 4, // normalized red   color
    G   : 5, // normalized green color
    B   : 6, // normalized blue  color
    A   : 7, // normalized alpha color
    NUM : 8,
};
```


## Why Javascript

Javascript is a crappy language designed in 10 days. If it is so bad then why use it?

Two reasons:

* Every modern computer has a web browser which means there is _nothing to install,_ and
* More importantly, _to show that is possible_ to write **good** code in any language,
even as one as bad as Javascript.

Getting back to our axis of evil, er, 8D axis ...


## The Color Axis

The astute reader will notice I snuck color in there!

i.e. What if we wanted
to fade an object from Black to Yellow and back to Black again, say for a glowing
highlight? By separting the hue into separate axis such as red, green, and blue,
our animation engine could support this very easily.

Why seperate the axis?

We may be given two colors in a hex string format, `#RRGGBB`,
and want to interpolate between them. Before we can do this we would need to

 * Break this down into the 3 components, or Red, Green, Blue axis, respectively.
 * Then we need to scale the triad (between 0 and 255), and
 * Combine them to form a valid `#RRGGBB` hex string.
 * Lastly, then when we need to apply the color to the HTML element.

For example this function will do exactly the middle part.

```
// Convert numeric r,g,b values to a HTML color hex string `#RRGGBB`
function RGBtoHex = function( r, g, b )
{
    return '#'
        + ('0' + ((255 * r) | 0).toString( 16 )).slice( -2 )
        + ('0' + ((255 * g) | 0).toString( 16 )).slice( -2 )
        + ('0' + ((255 * b) | 0).toString( 16 )).slice( -2 )
};
```

Sometimes you'll see the terminology of a `controller`.

i.e. If wanted to animate across the rainbow
from Red,Orange,Yellow,Green,Cyan,Azure,Blue,Violet,Magenta
it might be more convenient to use a `hue` controller.

At the high level it would be:

```
    /** {Number} startAngle - starting color in degrees
     *  {Number} endAngle   - end      color in degrees
     *  {Number} duration   - duration in seconds
     */
    function HueControllerAnimate( startAngle, endAngle, duration )
    {
        // Animate an angle from startAngle to endAngle over a duration
        // On each update
        //    convert hue to r,g,b
        //    apply it to the object
    }
```

This would in turn _drive_ the animation values red, green, blue over time.

The reason I bring up color is that if you start interpolating color you may
need to look into PMA (Premultiplied alpha) -- where you need to multiply `alpha`
**into** the red, green, and blue channels.

See Tom Forsyth's
[Blog](http://eelpi.gotdns.org/blog.wiki.html) for these 2 articles:

* Premultiplied alpha, 18 March 2015 (created 15 July 2006)
* Premultiplied alpha part 2, 18 March 2015 (created 18 March 2015)

But I digress.


## Interpolation

In _computer graphics_ terminology this calculating "inbetween" values is
called `interpolation`. In _animation_ it is called `tweening`.

Given different times, we want these values:

| p   | Value           |
|:----|:----------------|
| 0.0 | start           |
| 0.5 | 0.5*(end-start) |
| 1.0 | end             |

What we have just discussed is the simplist type of interpolation:
a `linear` interpolation.


The graph looks like this:

![Linear Interpolation](pics/01_linear.png)


Since this type of interpolation is so common it has its own abbreviation: `Lerp`

* "Lerp" - [linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation).

_Lerp_ is typically shown in one of two common forms:

```
    function lerp(t,a,b)
    {
        return a + (t-1)(b-a);
    }

    function lerp(t,a,b)
    {
        return (1-t)*a + t*b;
    }
```

This is one of those times where `t` is commonly used.

Let's replace those abbreviations with descriptive names for now since we
want to understand what they mean.

```
    function lerp(p,start,end)
    {
        return start + (p-1)(end-start);
    }

    function lerp(p,start,end)
    {
        return (1-p)*start + p*end;
    }
```

**Note**: Some programmers factor out `(end-start)` and call it `c` for
_change_ or `d` for _delta_ but with the latter `d` could also mean
_duration_ so be aware of different conventions used by people.

Mathematically, the two lerp equations are equivalent but since computers are
finite they have precision errors which can and do creep in.  You should be
familiar with both forms as you'll see them in common usage.

The first one _in practice_ may not be as accurate as the latter due to
floating-point error accumulation.  Why would it be used then?  The first form
is popular due to modern hardware often having a native _FMA_
[Fused Multiply-Add](https://en.wikipedia.org/wiki/Multiply%E2%80%93accumulate_operation)
hardware instruction. Thus sometimes you'll see the second form to maximize
precision and minimize error, at the cost of slightly slower performance.

This is a common trade-off in computing -- you can have speed or accuracy, pick one. :-/



# De Facto Easing Functions

Robert Penner provided the original, "canonical" 'de facto' easing functions in 2001 in ActionScript.

First, let's tabulate the variables we'll be using:

```
Legend:
    x = not used
    t = elapsed time (starting from zero)
    b = begin val
    c = change val (end-begin)
    d = duration (BUG: generates NaN if zero)
```

And without further ado:

```Javascript
// http://www.robertpenner.com/easing
// by Robert Penner Copyright 2001
// License: BSD -- http://robertpenner.com/easing_terms_of_use.html
var Original =
{
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c*(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - Original.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d/2) return Original.easeInBounce (x, t*2, 0, c, d) * .5 + b;
        return Original.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};
```
Let's learn how to clean up this _fugly, overengineered code_ into the _beautiful_, exact equivalent mentioned at the beginning.

The astute reader will notice that `jQuery` initially adapted these _"as-is"_
before coming to their sense and cleaning them up eventually.

* https://raw.githubusercontent.com/danro/jquery-easing/master/jquery.easing.js



# Easing Cleanup

There are numerous problems with the defacto easing 5 parameter easing functions.
This is **crap code** -- that's the technical term for _over-engineered._

Problems can be placed into two general categories:

* Meta
* Implementation

The _meta_ coding problems are:

 * Functions aren't alphabetized making searching/finding them non-intuitiave,
 * While _inter-easing_ functions are grouped together there is no seperator between _intra-easing_ such as whitespace.,
 * Names are abbreviated making them not obvious, such as `Expo` -- Exponent comes in multiple variations such as `Exponent_2` and `Exponent_e`,
 * Initially there seems to be a lot of easing functions, but they are incomplete -- they are missing some of the more common mathematical ones.

The _implementation_ problems are:

1. Buggy 1     - Generates NaN when d == 0
2. Buggy 2     - Doesn't handle edge cases when t<0 or t>d
3. Inefficient - t/d is always done to normalize the time; If there are multiple animations with the same duration then this causes extra processing
4. Slow 1      - due to inefficient, redundant, or dead code
5. Slow 2      - b can be replaced with 0.0
6. Slow 3      - c can be replaced with 1.0
7. Wasteful    - argument x is declared in to all functions but never used

We will address and fix **all** of these bugs.


## Cleanup - Linear

First, let's start with the linear easing.

It's graph looks like this:

![Linear graph](pics/01_linear.png)


Hmm, there isn't one. Let's add one for completeness.

```
    easeInLinear: function (x, t, b, c, d) {
        return c*(t/=d) + b;
    },
```

Now, when `d` is 0, this generates a bug #1 `NaN`.  Let's digress slightly and
address bug #2, `t < 0` and `t > d` before we fix this.

```
    easeInLinear: function (x, t, b, c, d) {
        if (t <= 0) return b    ; // start
        if (t >= d) return b + c; // end
        return c*(t/=d) + b;
```

What happens when `d` == 0 ? It returns the `end` for free!

```
    easeInLinear: function (x, t, b, c, d) {
        if (t <= 0) return b    ;
        if (t >= d) return b + c; // t >= 0 return end
        return c*(t/=d) + b;
```

Let's make this a little more robust:

```
    easeInLinear: function (x, t, b, c, d) {
        if (t <= 0) return b    ; // If d=0, then t is always t >= d
        if (t >= d) return b + c; // due to t < 0 already being handled
        var p = t/d;
        return c*p + b;
    },
```

Hmmm, some of these equations are starting to look familiar !


## Cleanup - In Back

![In Bounce graph](pics/23_in_back.png)

## Cleanup - In Bounce

![In Bounce graph](pics/26_in_bounce.png)

## Cleanup - In Circle

![In Circle graph](pics/20_in_bounce.png)

## Cleanup - In Cubic

![In Cubic graph](pics/3_in_cubic.png)

## Cleanup - In Elastic

![In Elastic graph](pics/32_in_elastic.png)

## Cleanup - In Exponent 2

![In Exponent 2 graph](pics/35_in_elastic.png)

## Cleanup - In Exponent e

![In Exponent e graph](pics/41_in_elastic.png)

## Cleanup - In Log10

![In Log10 graph](pics/44_in_log10.png)

## Cleanup - In Octic

![In Octic graph](pics/8_in_octic.png)

## Cleanup - In Quadratic

![In Quadratic graph](pics/2_in_quadratic.png)

## Cleanup - In Quartic

![In Quartic graph](pics/4_in_quartic.png)

## Cleanup - In Quintic

![In Quintic graph](pics/5_in_quintic.png)

## Cleanup - In Septic

![In Bounce graph](pics/26_in_bounce.png)
![In Septic graph](pics/7_in_septic.png)

## Cleanup - In Sextic

![In Sextic graph](pics/6_in_sextic.png)

## Cleanup - In Sine

![In Sine graph](pics/38_in_sine.png)


To be continued.

# TODO

* [x] Optimize easing functions
* [x] Demo
* [x] Plot easing functions (code)
 * [x] Linear
 * [x] In Back
 * [x] In Bounce
 * [x] In Circle
 * [x] In Cubic
 * [x] In Elastic
 * [x] In Exponent 2
 * [x] In Exponent e
 * [x] In Log10
 * [x] In Octic
 * [x] In Quadratic
 * [x] In Quartic
 * [x] In Quintic
 * [x] In Septic
 * [x] In Sextic
 * [x] In Sine
 * [x] In Square Root
 * [x] In Out Back
 * [x] In Out Bounce
 * [x] In Out Circle
 * [x] In Out Cubic
 * [x] In Out Elastic
 * [x] In Out Exponent 2
 * [x] In Out Exponent e
 * [x] In Out Log10
 * [x] In Out Octic
 * [x] In Out Quadratic
 * [x] In Out Quartic
 * [x] In Out Quintic
 * [x] In Out Septic
 * [x] In Out Sextic
 * [x] In Out Sine
 * [x] In Out Square Root
 * [x] Out Back
 * [x] Out Bounce
 * [x] Out Circle
 * [x] Out Cubic
 * [x] Out Elastic
 * [x] Out Exponent 2
 * [x] Out Exponent e
 * [x] Out Log10
 * [x] Out Octic
 * [x] Out Quadratic
 * [x] Out Quartic
 * [x] Out Quintic
 * [x] Out Septic
 * [x] Out Sextic
 * [x] Out Sine
 * [x] Out Square Root
* [ ] Write up tutorial (Work-In-Progress)
 * [ ] Linear
 * [ ] In Back
 * [ ] In Bounce
 * [ ] In Circle
 * [ ] In Cubic
 * [ ] In Elastic
 * [ ] In Exponent 2
 * [ ] In Exponent e
 * [ ] In Log10
 * [ ] In Octic
 * [ ] In Quadratic
 * [ ] In Quartic
 * [ ] In Quintic
 * [ ] In Septic
 * [ ] In Sextic
 * [ ] In Sine
 * [ ] In Square Root
 * [ ] In Out Back
 * [ ] In Out Bounce
 * [ ] In Out Circle
 * [ ] In Out Cubic
 * [ ] In Out Elastic
 * [ ] In Out Exponent 2
 * [ ] In Out Exponent e
 * [ ] In Out Log10
 * [ ] In Out Octic
 * [ ] In Out Quadratic
 * [ ] In Out Quartic
 * [ ] In Out Quintic
 * [ ] In Out Septic
 * [ ] In Out Sextic
 * [ ] In Out Sine
 * [ ] In Out Square Root
 * [ ] Out Back
 * [ ] Out Bounce
 * [ ] Out Circle
 * [ ] Out Cubic
 * [ ] Out Elastic
 * [ ] Out Exponent 2
 * [ ] Out Exponent e
 * [ ] Out Log10
 * [ ] Out Octic
 * [ ] Out Quadratic
 * [ ] Out Quartic
 * [ ] Out Quintic
 * [ ] Out Septic
 * [ ] Out Sextic
 * [ ] Out Sine
 * [ ] Out Square Root

By: Michael Pohoreski
Copyright: 2017

