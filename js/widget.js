"use strict";

var Axis =
{
    X   : 0, // left position    (in pixels)
    Y   : 1, // top  position    (in pixels)
    W   : 2, // width  dimension (in pixels)
    H   : 3, // height dimension
    R   : 4, // normalized red   color
    G   : 5, // normalized green color
    B   : 6, // normalized blue  color
    A   : 7, // normalized alpha color
    S   : 8, // Font size        (in pixels)
    _   : 9, // whiteSpace 'nowrap' // http://www.w3schools.com/jsref/prop_style_whitespace.asp
    NUM : 9, // NOTE: NOT a typo -- there is no point to interpolate whitespace
    INIT:10,
};

var Easing =
{
    NONE            :  0,
    LINEAR          :  1,

// Power
    IN_QUADRATIC    :  2,
    IN_CUBIC        :  3,
    IN_QUARTIC      :  4,
    IN_QUINTIC      :  5,
    IN_SEXTIC       :  6,
    IN_SEPTIC       :  7,
    IN_OCTIC        :  8,

    OUT_QUADRATIC   :  9,
    OUT_CUBIC       : 10,
    OUT_QUARTIC     : 11,
    OUT_QUINTIC     : 12,
    OUT_SEXTIC      : 13,
    OUT_SEPTIC      : 14,
    OUT_OCTIC       : 15,

    IN_OUT_QUADRATIC: 16,
    IN_OUT_CUBIC    : 17,
    IN_OUT_QUARTIC  : 18,
    IN_OUT_QUINTIC  : 19,
    IN_OUT_SEXTIC   : 20,
    IN_OUT_SEPTIC   : 21,
    IN_OUT_OCTIC    : 22,

// Standard
    IN_BACK         : 23,
    IN_OUT_BACK     : 24,
    OUT_BACK        : 25,

    IN_BOUNCE       : 26,
    IN_OUT_BOUNCE   : 27,
    OUT_BOUNCE      : 28,

    IN_CIRC         : 29,
    IN_OUT_CIRC     : 30,
    OUT_CIRC        : 31,

    IN_ELASTIC      : 32,
    IN_OUT_ELASTIC  : 33,
    OUT_ELASTIC     : 34,

    IN_EXPO         : 35,
    IN_OUT_EXPO     : 36,
    OUT_EXPO        : 37,

    IN_SINE         : 38,
    IN_OUT_SINE     : 39,
    OUT_SINE        : 40,

    NUM             : 41,
};

/**
 * Given an normalized elapsed time (between 0.0 and 1.0 inclusive)
 * an easing function returns an ajusted, or 'warped', elapsed time
 * For example, a linear function returns the time "as-is".
 * An Out Quadratic easing quickly accelerates then deaccelerates
 * as it closes to the final total time.
 *
 * @param {Number} p - Normalized Standard Time Percentage [0.0,1.0] (inclusive)
 * @returns {Number} - Normalized Adjusted Time Percentage
 *
 * @Notes:
 *
 *   Distance = Velocity*Time
 *   d = v*t
 *
 *   Distance = Start + (Finish-Start)*Time
 * Or
 *   Current = Min + (Max-Min)*Time
 */
var EasingFuncs = // Array of Functions
[
    function None          (p)  { return 1;               }, // p^0
    function Linear        (p)  { return p;               }, // p^1 Note: In = Out = InOut

// Power
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

    function InCirc        (p)  {                             return  1-Math.sqrt( 1 - p*p );                                                      },
    function InOutCirc     (p)  { var m=p-1,t=p*2; if (t < 1) return (1-Math.sqrt( 1 - t*t ))*0.5; else return (Math.sqrt( 1 - 4*m*m ) + 1) * 0.5; },
    function OutCirc       (p)  { var m=p-1      ;                                                      return  Math.sqrt( 1 -   m*m );            },

    function InElastic     (p)  { var m = p-1; return  - Math.pow( 2,10*m  ) * Math.sin( ( m*40 - 3) * Math.PI/6  ); },
    function OutElastic    (p)  {              return 1+(Math.pow( 2,10*-p ) * Math.sin( (-p*40 - 3) * Math.PI/6 )); },
    function InOutElastic  (p)  {
                                    var s = 2*p-1;                 // remap: [0,0.5] -> [-1,0]
                                    var k = (80*s-9) * Math.PI/18; // and    [0.5,1] -> [0,+1]

                                    if (s < 0) return   -0.5*Math.pow(2, 10*s) * Math.sin( k );
                                    else       return 1 +0.5*Math.pow(2,-10*s) * Math.sin( k );
                                },

    // NOTE: InExpo and OutExpo need clamping for 0 and 1 respectively
    function InExpo        (p)  {   if (p <= 0) return 0; return   Math.pow( 2,  10*(p-1) ); },
    function OutExpo       (p)  {   if (p >= 1) return 1; return 1-Math.pow( 2, -10* p    ); },
    function InOutExpo     (p)  {
                                    if (p <= 0) return 0;
                                    if (p >= 1) return 1;
                                    if (p <0.5) return             Math.pow( 2,  10*(2*p-1)-1);
                                    else        return           1-Math.pow( 2, -10*(2*p-1)-1);
                                },

    function InSine        (p)  { return      1 - Math.cos( p * Math.PI*0.5 );  },
    function InOutSine     (p)  { return 0.5*(1 - Math.cos( p * Math.PI     )); },
    function OutSine       (p)  { return          Math.sin( p * Math.PI*0.5 );  },

/*
// Alternative: Standard -- Grouped by In, Out, InOut

    function InBack      (p) { var k = 1.70158; return p*p*(p*(k+1) - k); },
    function InBounce    (p) { return 1 - EasingFuncs[ 'easeOutBounce' ]( 1-p ); },
    function InCirc      (p) { return 1 - Math.sqrt( 1 - p*p ); },
    function InElastic   (p) { var m = p-1; return  - Math.pow( 2,10*m  ) * Math.sin( ( m*40 - 3) * Math.PI/6 ); },
    function InExpo      (p) { if (p <= 0) return 0; return  Math.pow( 2, 10*(p-1) ); },
    function InSine      (p) { return      1 - Math.cos( p * Math.PI*0.5 );  },

    function OutBack     (p) { var m=p-1, k = 1.70158; return 1 + m*m*( m*(k+1) + k); },
    function OutBounce   (p) {
                                var k1 = 1   / 2.75; // 36.36%
                                var k2 = 2     * k1; // 72.72%
                                var k3 = 1.5   * k1; // 54.54%
                                var k4 = 2.5   * k1; // 90.90%
                                var k5 = 2.25  * k1; // 81.81%
                                var k6 = 2.625 * k1; // 95.45%
                                var k0 = 7.5625, t;

                                     if (p < k1) {             return k0 * p*p;            }
                                else if (p < k2) { t = p - k3; return k0 * t*t + 0.75;     } // 48/64
                                else if (p < k4) { t = p - k5; return k0 * t*t + 0.9375;   } // 60/64
                                else             { t = p - k6; return k0 * t*t + 0.984375; } // 63/64
                             },
    function OutCirc     (p) { var m=p-1; return Math.sqrt( 1 - m*m ); },
    function OutElastic  (p) { return 1 + (Math.pow( 2,10*-p ) * Math.sin( (-p*40 - 3) * Math.PI/6 )); },
    function OutExpo     (p) { return 1 - Math.pow( 2, -10* p ); },
    function OutSine     (p) { return Math.sin( p * Math.PI*0.5 ); },

    function InOutBack   (p) { var m=p-1,t=p*2, k = 1.70158 * 1.525; if (p < 0.5) return p*t*(t*(k+1) - k); else return 1 + 2*m*m*(2*m*(k+1) + k); },
    function InOutBounce (p) {
                                var t = p*2;
                                if (t < 1) return 0.5 - 0.5*EasingFuncs[ EASEING.OUT_BOUNCE ]( 1 - t );
                                return            0.5 + 0.5*EasingFuncs[ EASEING.OUT_BOUNCE ]( t - 1 );
                             },
    function InOutCirc   (p) { var m=p-1,t=p*2; if (t < 1) return (1-Math.sqrt( 1 - t*t ))*0.5; else return (Math.sqrt( 1 - 4*m*m ) + 1) * 0.5; },
    function InOutElastic(p) {
                                var s = 2*p-1;                 // remap: [0,0.5] -> [-1,0]
                                var k = (80*s-9) * Math.PI/18; // and    [0.5,1] -> [0,+1]
                                if (s < 0) return -0.5*Math.pow(2, 10*s) * Math.sin( k );
                                return          1 +0.5*Math.pow(2,-10*s) * Math.sin( k );
                             },
    function InOutExpo   (p) {
                                if (p <0.5) return   Math.pow( 2,  10*(2*p-1)-1);
                                            return 1-Math.pow( 2, -10*(2*p-1)-1);
                             },
    function InOutSine   (p) { return 0.5 * (1 - Math.cos( p * Math.PI )); },
*/
];

var EasingNames = [];
EasingNames.insert = function( elem )
{
    // To insert name 'as-is':
    //     EasingNames.push( elem.name );
    //
    // OR
    //
    // To pretty print by inserting space when:
    //  * prev letter is lowercase, AND
    //  * next letter is uppercase
    var prev = elem.name.substr( 0, 1 );
    var next;

    var t = prev;
    var n = elem.name.length;

    var lo;
    var up;

    for( var i = 1; i < n; ++i )
    {
        next = elem.name.substr( i, 1 );

        lo = prev.charCodeAt(0);
        up = next.charCodeAt(0);

        if( ((lo > 96) && (lo <= 122))
        &&  ((up > 64) && (up <=  90)) )
            t += ' ';

        t += next;
        prev = next;
    }
    EasingNames.push( t );
};
EasingFuncs.map( EasingNames.insert );

/**
 * @classname Widget
 */
function Widget() {}

Widget.focus    = null;
Widget.ID       = 0;
Widget.time     = 0;
Widget.RGBtoHex = function( r, g, b )
{
        return '#'
            + ('0' + ((255 * r) | 0).toString( 16 )).slice( -2 )
            + ('0' + ((255 * g) | 0).toString( 16 )).slice( -2 )
            + ('0' + ((255 * b) | 0).toString( 16 )).slice( -2 )
};

Widget.prototype =
{
    /**
     * @param {String} [className] - Class name for debug out
     * Note: ALL derived classes need to do two things:
     *  - Manually chain to their parent init constructor
     *    i.e.
     *
     *      Foo.prototype =
     *      {
     *          init: function( params )
     *          {
     *              Widget.prototype.init.call( this, "Text" );
     *              :
     *          }
     *
     *  - Extend their class from their parent in OnLoad()
     *      Extend( Widget, Foo );
     */
    init: function( className )
    {
        this._id       = ++Widget.ID;
        this._class    = className;
        this._children = [];

        var vals  = new Array( Axis.INIT );
        for( var axis = 0; axis < Axis.INIT; ++axis )
            vals[ axis ] = 0;

        this._type  = vals.slice(); // animation easing type NOTE: Easing.NONE = 0, no active animation
        this._start = vals.slice(); // animation time start
        this._oodur = vals.slice(); // animation time One Over Duration (NOTE: This is 1/milliseconds in order to use multiply instead of divide)
        this._onEnd = vals.slice(); // callback when animation done
        this._onInc = vals.slice(); // callback while animationg active

        vals[ Axis.A ] =  1; // default alpha = opaque
        this._min = vals.slice();
        this._cur = vals.slice();
        this._max = vals.slice();

        this._cur[ Axis._ ] = 'nowrap';

        return this;
    },

    /**
     * Category: Creation
     * After a widget has been 'init' add it to its parent
     * @param {Widget} child - Child widget to add
     * @param {Number} x     - Left in pixels
     * @param {Number} y     - Top in pixels
     */
    // ========================================================================
    addXY: function( child, x, y )
    {
        if( !x ) x = 0;
        if( !y ) y = 0;

        this._children.push( child );

        child._parent = this;

        child._min[ Axis.X ] = x;
        child._cur[ Axis.X ] = x;
        child._max[ Axis.X ] = x;

        child._min[ Axis.Y ] = y;
        child._cur[ Axis.Y ] = y;
        child._max[ Axis.Y ] = y;
    },

    /**
     * Category: Animation
     * Animate specified axis
     * @param {Number}   [params.a]     - Alpha     to animate to
     * @param {Number}   [params.b]     - Blue      to animate to
     * @param {Number}   [params.g]     - Green     to animate to
     * @param {Number}   [params.h]     - Height    to animate to
     * @param {Number}   [params.r]     - Red       to animate to
     * @param {Number}   [params.s]     - Font size to animate to
     * @param {Number}   [params.w]     - Width     to animate to
     * @param {Number}   [params.x]     - Left      to animate to
     * @param {Number}   [params.y]     - Top       to animate to
     * @param {Number}   [params.ms     - Delay in milliseconds
     * @param {Function} [params.onEnd] - Callback when animation done
     * @param {Function} [params.onInc] - Callback while animating
     * @param {Easing}   [params.type]  - Type of easing animation
     * @see stop(), clearEnd()
     */
    // ========================================================================
    animate: function( params )
    {
        var key, axis, val, ms = params.ms | 0, easing = params.type;

        if( !easing )
             easing = Easing.OUT_QUADRATIC;

        for( key  in params )
        {
            switch( key )
            {
                case 'a': axis = Axis.A; break;
                case 'b': axis = Axis.B; break;
                case 'g': axis = Axis.G; break;
                case 'h': axis = Axis.H; break;
                case 'r': axis = Axis.R; break;
                case 's': axis = Axis.S; break;
                case 'w': axis = Axis.W; break;
                case 'x': axis = Axis.X; break;
                case 'y': axis = Axis.Y; break;
                default: break; // 'easing', 'ms', 'onEnd, 'onInc', 'type'
            }

            if( axis !== undefined )
            {
                val = params[ key ];
                if( !ms )
                     ms = 1; // we store 1/ms

                this._max  [ axis ] = val;
                this._min  [ axis ] = this._cur[ axis ];
                this._oodur[ axis ] = 1 / ms;      // anim time length
                this._onEnd[ axis ] = params.onEnd;
                this._onInc[ axis ] = params.onInc;
                this._start[ axis ] = Widget.time; // anim time start
                this._type [ axis ] = easing;
            }

            axis = undefined;
        }
    },

    /**
     * Category: Creation
     * Apply the current axis values to the div
     */
    // ========================================================================
    applyDiv: function()
    {
        this.setA( this._cur[ Axis.A ] );
        this.setH( this._cur[ Axis.H ] );
        this.setS( this._cur[ Axis.S ] );
        this.setW( this._cur[ Axis.W ] );
        this.setX( this._cur[ Axis.X ] );
        this.setY( this._cur[ Axis.Y ] );
        this.set_( this._cur[ Axis._ ] );
        this.setColor( this.getRGB() );
    },

    /**
     * Category: Animation
     */
    // ========================================================================
    clearOnEnd: function( axis )
    {
        this._onEnd[ axis ] = undefined;
    },

    /**
     * Category: Creation
     * Once a widget has 'init' and 'addXY' all its children
     * create the div container and append them their parent
     * @see createDiv(), applyDiv()
     * @example
     *     Foo.prototype =
     *     {
     *         init: function()
     *         {
     *             this._rect = new Rect().init( { w: 1, h: 1, r: 0, g: 0, b: 0 } );
     *             this.addXY( this._rect, 0, 0 );
     *
     *             // NOTE: There is NO createChildren
     *             // as pushScreen() will do that
     *         },
     *     };
     */
    // ========================================================================
    createChildren: function()
    {
        this.createDiv();
        this.applyDiv();

        var i, n = this._children.length;
        for( i = 0; i < n; ++i )
            this._children[i].createChildren();

        if( this.onCreate )
            this.onCreate();
    },

    /**
     * Category: Creation
     * Note: A screen is reponsible for creating all children
     */
    // ========================================================================
    createDiv: function()
    {
        var div = this._div = document.createElement( 'div' );
        if( this._id )
            div.id          = '_' + this._id;
        div.style.position  = 'absolute';
        div.style.margin    = '0px';

        if( this._parent )
            this._parent._div.appendChild( div );
    },

// Color
    getB: function() { return this._cur[ Axis.B ]; },
    getG: function() { return this._cur[ Axis.G ]; },
    getR: function() { return this._cur[ Axis.R ]; },
    getA: function() { return this._cur[ Axis.A ]; },
// Dimension
    getW: function() { return this._cur[ Axis.W ]; }, // return this._div.offsetHeight | 0;
    getH: function() { return this._cur[ Axis.H ]; }, // return this._div.offsetWidth  | 0;
// Position
    getX: function() { return this._cur[ Axis.X ]; },
    getY: function() { return this._cur[ Axis.Y ]; },
// Font
    getS: function() { return this._cur[ Axis.S ]; },
// Misc.
    get_: function() { return this._cur[ Axis._ ]; },

    /**
     * @returns {String} HTML hex color string '#RRGGBB'
     */
    getRGB: function()
    {
        return Widget.RGBtoHex( this._cur[ Axis.R ], this._cur[ Axis.G ], this._cur[ Axis.B ] );
    },

    /*
     * Get the absolute x and y
     * @returns {Object}
     */
    // ========================================================================
    getAbsXY: function()
    {
        var pos = { x: 0, y: 0 };
        var obj = this;

        while( obj )
        {
            pos.x += obj.getX() | 0;
            pos.y += obj.getY() | 0;
            obj    = obj._parent;
        };

        return pos;
    },

    /*
     * Returns the bounding box of the container
     * Iterate though all children keeping track of the maximum width and height
     * @returns {Object}
     */
    // ========================================================================
    getDimensions: function()
    {
        var dim = { w: this.getW() | 0, h: this.getH() | 0 };

        var kid;
        var kw, kh;

        var i = 0, n = this._children.length;
        for( ; i < n; ++i )
        {
            kid = this._children[ i ].getDimensions();
            kw  = this._children[ i ].getX() + kid.w;
            kh  = this._children[ i ].getY() + kid.h;
            if( dim.w < kw ) dim.w = kw;
            if( dim.h < kh ) dim.h = kh;
        }

        return dim;
    },

    /**
     * Category: Animation
     * Test if widget's axis is animating
     * @returns {Boolean} true if animating, else false
     */
    // ========================================================================
    isAxisAnimating: function( axis ) { return this._type[ axis ] !== Easing.NONE; },

    /**
     * Category: Animation
     * Test if any widget's axis is animating
     * @returns {Boolean} true if animating, else false
     */
    // ========================================================================
    isAnimating: function()
    {
        var bIsAnimating = false;
        for( var axis = 0; axis < Axis.NUM; ++axis )
            bIsAnimating |= this.isAxisAnimating( axis );

        return bIsAnimating;
    },

    /**
     * Category: Focus
     */
    // ========================================================================
    focusRequest: function( widget )
    {
        if( Widget.focus.onFocusLost )
            Widget.focus.onFocusLost();

        Widget.focus = widget;

        if( Widget.focus.onFocusAccept )
            Widget.focus.onFocusAccept();
    },

    /**
     * Category: Input
     * Dispatch key to current widget with focus
     * @param {Boolean} isKeyPressed - true if pressed else false
     * @param {Number}  key          - key code
     */
    // ========================================================================
    input: function( isKeyPressed, key )
    {
        var focus = Widget.focus;

        while( focus )
        {
            if((focus.onInput !== undefined)
            &&  focus.onInput( isKeyPressed, key ) )
                break;

            focus = focus._parent;
        }
    },

/*
    // You need to provide if you over-ride:
    onCreate     : function() {}, // Called when a widget's div and all their children has been created
    onFocusAccept: function() {},
    onFocusLost  : function() {},
    onResize     : function() {}, // Game.w and/or Game.h has changed
    onUpdate     : function( dt ) { },
*/

    /**
     * Category: Animation
     * @param {Axis}   axis - Which axis to set
     * @param {Number} val  - New value
     */
    // ========================================================================
    setAxis: function( axis, val )
    {
        switch( axis )
        {
            case Axis.A: this.setA( val ); break;
            case Axis.B: this.setB( val ); break;
            case Axis.G: this.setG( val ); break;
            case Axis.H: this.setH( val ); break;
            case Axis.R: this.setR( val ); break;
            case Axis.S: this.setS( val ); break;
            case Axis.W: this.setW( val ); break;
            case Axis.X: this.setX( val ); break;
            case Axis.Y: this.setY( val ); break;
        }
    },
// Color
    setR  : function( r ) { this._cur[ Axis.R ] = r; this.setColor( this.getRGB() ); },
    setG  : function( g ) { this._cur[ Axis.G ] = g; this.setColor( this.getRGB() ); },
    setB  : function( b ) { this._cur[ Axis.B ] = b; this.setColor( this.getRGB() ); },
    setA  : function( a ) { this._cur[ Axis.A ] = a; if( this._div ) this._div.style.opacity    =      a       ; },
// Font
    setS  : function( s ) { this._cur[ Axis.S ] = s; if( this._div ) this._div.style.fontSize   = '' + s + 'px'; },
// Position
    setX  : function( x ) { this._cur[ Axis.X ] = x; if( this._div ) this._div.style.left       = '' + x + 'px'; },
    setY  : function( y ) { this._cur[ Axis.Y ] = y; if( this._div ) this._div.style.top        = '' + y + 'px'; },
// Dimension
    setW  : function( w ) { this._cur[ Axis.W ] = w; if( this._div ) this._div.style.width      = '' + w + 'px'; },
    setH  : function( h ) { this._cur[ Axis.H ] = h; if( this._div ) this._div.style.height     = '' + h + 'px'; },
// Misc
    set_  : function( _ ) { this._cur[ Axis._ ] = _; if( this._div ) this._div.style.whiteSpace =      _       ; },

    setColor: function( color )
    {
        if( this._div )
            this._div.style.backgroundColor = color;
    },

    // ========================================================================
    resize: function()
    {
        if( this.onResize )
            this.onResize();

        var n = this._children.length;
        for( var child = 0; child < n; ++child )
            this._children[ child ].resize();
    },

    /**
     * Category: Animation
     * @param {Axis} axis - Stop specific axis from animating
     */
    // ========================================================================
    stop: function( axis )
    {
        if( axis === undefined )
            console.error( "Widget.stop() Axis not specified" );

        this._type[ axis ] = Easing.NONE;
        this._max [ axis ] = this._cur[ axis ];

        var callback = this._onEnd[ axis ];
        if( callback ) // initialized to 0, not undefined
        {
            this._onEnd[ axis ] = undefined;
            callback( axis, this );
        }
    },

    /**
     * Category: Animation
     * Update all axis animation, and then children
     * If there is an on end callback will call with (Axis, Widget)
     * @param {Number} dT - Delta Time (in milliseconds)
     */
    // ========================================================================
    update: function( dT )
    {
        var n = Axis.NUM, dx, t, x;

        for( var axis = 0; axis < n; ++axis )
        {
            var easing = this._type[ axis ];
            if( easing ) // Animation != Easing.NONE
            {
                var min = this._min[ axis ];
                var max = this._max[ axis ];

                var total = this._oodur[ axis ];
                var start = this._start[ axis ];

                var dt = Widget.time - start;
                var p  = dt * total; // Note: total ms is reciprocal duration: 1/milliseconds

                // Animation done?
                if( p >= 1 )
                {
                    this.setAxis( axis, max );
                    this.stop   ( axis );
                }
                else
                {
                    t  = EasingFuncs[ easing ]( p );
                    dx = max - min;
                    x  = min + dx*t;
                    this.setAxis( axis, x );

                    var callback = this._onInc[ axis ];
                    if( callback )
                        callback( axis, this );
                }
            }
        }

        n = this._children.length;
        for( var child = 0; child < n; ++child )
            this._children[ child ].update();

        if( this.onUpdate )
            this.onUpdate( dT );
    },
};

Widget.prototype.constructor = Widget.init;
