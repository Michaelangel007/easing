"use strict";

var Axis = Object.freeze(
{
    X   : 0, // left position    (in pixels)
    Y   : 1, // top  position    (in pixels)
    W   : 2, // width  dimension (in pixels)
    H   : 3, // height dimension (in pixels)
    R   : 4, // normalized red   color
    G   : 5, // normalized green color
    B   : 6, // normalized blue  color
    A   : 7, // normalized alpha color
    S   : 8, // Font size        (in pixels)
    T   : 9, // User Timer
    _   :10, // whiteSpace 'nowrap' // http://www.w3schools.com/jsref/prop_style_whitespace.asp
    NUM :10, // NOTE: NOT a typo -- there is no point to interpolate whitespace
    INIT:11,
});

/**
 * @classname Widget
 */
function Widget() {}

Widget.focus    = null;
Widget.ID       = 0;
Widget.time     = 0;

// Convert numeric r,g,b values to a HTML color hex string `#RRGGBB`
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

        this._ease  = vals.slice(); // animation easing type NOTE: Easing.NONE = 0, no active animation
        this._start = vals.slice(); // animation time start
        this._oodur = vals.slice(); // animation time One Over Duration (NOTE: This is 1/milliseconds in order to use multiply instead of divide)
        this._onEnd = vals.slice(); // callback when animation done
        this._onInc = vals.slice(); // callback while animation active

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
     * @param {Number}   [params.ms]    - Delay in milliseconds
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
                case 't': axis = Axis.T; break;
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
                this._ease [ axis ] = easing;
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
     * Clears the on end callback
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
     * Note: A screen is responsible for creating all children
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

    getB: function() { return this._cur[ Axis.B ]; }, // Color
    getG: function() { return this._cur[ Axis.G ]; },
    getR: function() { return this._cur[ Axis.R ]; },
    getA: function() { return this._cur[ Axis.A ]; },
    getW: function() { return this._cur[ Axis.W ]; }, // Dimension // return this._div.offsetHeight | 0;
    getH: function() { return this._cur[ Axis.H ]; },              // return this._div.offsetWidth  | 0;
    getX: function() { return this._cur[ Axis.X ]; }, // Position
    getY: function() { return this._cur[ Axis.Y ]; },
    getS: function() { return this._cur[ Axis.S ]; }, // Font
    get_: function() { return this._cur[ Axis._ ]; }, // Whitespace
    getT: function() { return this._cur[ Axis.T ]; }, // User Timer

    /**
     * @returns {String} HTML hex color string '#RRGGBB'
     */
    getRGB: function()
    {
        return Widget.RGBtoHex( this._cur[ Axis.R ], this._cur[ Axis.G ], this._cur[ Axis.B ] );
    },

    /*
     * Category: Metrics
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
     * Category: Metrics
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

    /*
     * Category: Metrics
     * @returns {Object} - width, height, x, y
     */
    // ========================================================================
    getMetrics: function()
    {
        var    metrics   = {};
               metrics.x = this.getX();
               metrics.y = this.getY();
               metrics.w = this.getW();
               metrics.h = this.getH();
        return metrics;
    },

    /**
     * Category: Animation
     * Test if widget's axis is animating
     * @returns {Boolean} true if animating, else false
     */
    // ========================================================================
    isAxisAnimating: function( axis ) { return this._ease[ axis ] !== Easing.NONE; },

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
    onCreate     : function()     {}, // Called when a widget's div and all their children has been created
    onFocusAccept: function()     {}, // when a widget received focus
    onFocusLost  : function()     {}, // when a widget loses focus
    onInput      : function()     {}, // whenever a key is pressed or released
    onResize     : function()     {}, // Game.w and/or Game.h has changed
    onUpdate     : function( dt ) {}, // When Widget.update() has finished update all animation for this frame
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
            case Axis.T: this.setT( val ); break;
            case Axis.W: this.setW( val ); break;
            case Axis.X: this.setX( val ); break;
            case Axis.Y: this.setY( val ); break;
            default:
                console.error( 'ERROR: setAxis() invalid axis:' + axis );
        }
    },

    setR: function( r ) { this._cur[ Axis.R ] = r; this.setColor( this.getRGB() ); }, // Color
    setG: function( g ) { this._cur[ Axis.G ] = g; this.setColor( this.getRGB() ); },
    setB: function( b ) { this._cur[ Axis.B ] = b; this.setColor( this.getRGB() ); },
    setA: function( a ) { this._cur[ Axis.A ] = a; if( this._div ) this._div.style.opacity    =      a       ; },
    setS: function( s ) { this._cur[ Axis.S ] = s; if( this._div ) this._div.style.fontSize   = '' + s + 'px'; }, // Font
    setX: function( x ) { this._cur[ Axis.X ] = x; if( this._div ) this._div.style.left       = '' + x + 'px'; }, // Position
    setY: function( y ) { this._cur[ Axis.Y ] = y; if( this._div ) this._div.style.top        = '' + y + 'px'; },
    setW: function( w ) { this._cur[ Axis.W ] = w; if(w&&this._div)this._div.style.width      = '' + w + 'px'; }, // Dimension
    setH: function( h ) { this._cur[ Axis.H ] = h; if(h&&this._div)this._div.style.height     = '' + h + 'px'; },
    set_: function( _ ) { this._cur[ Axis._ ] = _; if( this._div ) this._div.style.whiteSpace =      _       ; }, // Misc
    setT: function( t ) { this._cur[ Axis.T ] = t;                                                             }, // User Timer

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

        this._ease[ axis ] = Easing.NONE;
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
            var easing = this._ease[ axis ];
            if( easing ) // Animation != Easing.NONE
            {
                var min = this._min[ axis ];
                var max = this._max[ axis ];

                var total = this._oodur[ axis ]; // reciprocal duration: 1/milliseconds
                var start = this._start[ axis ];

                var dt = Widget.time - start;
                var p  = dt * total; // Optimization: Removed divide; 1/duration stored at type of animate()

                // Animation done?
                if( p >= 1 )
                {
                    this.setAxis( axis, max );
                    this.stop   ( axis );
                }
                else
                {
                    t  = EasingFuncs[ easing ]( p ); // p = normal time, t = warped time
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
            this._children[ child ].update( dT );

        if( this.onUpdate )
            this.onUpdate( dT );
    },
};

Widget.prototype.constructor = Widget.init;
