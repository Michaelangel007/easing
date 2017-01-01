"use strict";

function Ease() {}

var Direction =
{
    LEFT : 0,
    RIGHT: 1,
};

Ease.prototype =
{
    init: function()
    {
        Widget.prototype.init.call( this, "Ease" );

        var dim = 7 + 2*(Game.h > 720) + 2*(Game.h > 1080) + 2*(Game.h > 1280); // cube dimensions (pixels) // 15 = 2560x1440

        var left  = 100;
        var right = left + dim*2*10;

        var extra = 5; // number of extra grid lines (for bounce)
        var dx    = (right - left) / 10;
        var pad   = extra*dx;
        var w     = (right - left) + 2*pad; // 2* for left and right edges
        var h     = 0; // auto-calculated

        var top   = 16;
        var space = 8;

        this.left  = left;
        this.right = right;

        var r = 0, g = 0, b = 0, a = 1;
        var x, y = top;
        var dx, dy = dim + space;

        var rect;
        var line;

        var aRect = []; // Note: length must stay in sync with labels
        var aVals = [];

        this._labels = new Widget().init(); // Container
        this._grid   = new Widget().init(); // Container

        var eEasing;
        var aEasing =
        [
            Easing.LINEAR          , // reference guide

        // Power
            Easing.IN_QUADRATIC    ,
            Easing.IN_CUBIC        ,
            Easing.IN_QUARTIC      ,
            Easing.IN_QUINTIC      ,
            Easing.IN_SEXTIC       ,
            Easing.IN_SEPTIC       ,
            Easing.IN_OCTIC        ,

            Easing.IN_OUT_QUADRATIC,
            Easing.IN_OUT_CUBIC    ,
            Easing.IN_OUT_QUARTIC  ,
            Easing.IN_OUT_QUINTIC  ,
            Easing.IN_OUT_SEXTIC   ,
            Easing.IN_OUT_SEPTIC   ,
            Easing.IN_OUT_OCTIC    ,

            Easing.OUT_QUADRATIC   ,
            Easing.OUT_CUBIC       ,
            Easing.OUT_QUARTIC     ,
            Easing.OUT_QUINTIC     ,
            Easing.OUT_SEXTIC      ,
            Easing.OUT_SEPTIC      ,
            Easing.OUT_OCTIC       ,

            Easing.LINEAR          , // show reference in vertical middle

        // Standard
            Easing.IN_BACK         ,
            Easing.IN_BOUNCE       ,
            Easing.IN_CIRCLE       ,
            Easing.IN_ELASTIC      ,
            Easing.IN_EXPONENT2    ,
            Easing.IN_EXPONENTE    , // Non-standard
            Easing.IN_LOG10        , // Non-standard
            Easing.IN_SINE         ,
            Easing.IN_SQRT         , // Non-standard

            Easing.IN_OUT_BACK     ,
            Easing.IN_OUT_BOUNCE   ,
            Easing.IN_OUT_CIRCLE   ,
            Easing.IN_OUT_ELASTIC  ,
            Easing.IN_OUT_EXPONENT2,
            Easing.IN_OUT_EXPONENTE, // Non-standard
            Easing.IN_OUT_LOG10    , // Non-standard
            Easing.IN_OUT_SINE     ,
            Easing.IN_OUT_SQRT     , // Non-standard

            Easing.OUT_BACK        ,
            Easing.OUT_BOUNCE      ,
            Easing.OUT_CIRCLE      ,
            Easing.OUT_ELASTIC     ,
            Easing.OUT_EXPONENT2   ,
            Easing.OUT_EXPONENTE   , // Non-standard
            Easing.OUT_LOG10       , // Non-standard
            Easing.OUT_SINE        ,
            Easing.OUT_SQRT        , // Non-standard
        ];

        var nType  = aEasing.length;

        // Linear line used as a visual reference
        this.middle = (dim * 0.5) | 0; // center in block
        rect = new Rect().init( { w:1, h:1, r: 0, g:0, b:0, a:0.5 } );

        // [0] is refence to tell when all animations are done
        rect.index = -1; // none
        aRect.push( rect );
        this.addXY( rect, left, 0 ); // Note: Or to show in center: left + this.middle

        var z = 0.6; // border color
        var m = 0.2; // monochrome
        var c = 1.0; // color 
        for( var iType = 1; iType < nType; ++iType )
        {
            eEasing = aEasing[ iType ];

            /**/ if( eEasing === Easing.LINEAR           ) { r = m; g = m; b = m; } // gray
            else if( eEasing === Easing.IN_QUADRATIC     ) { r = c; g = 0; b = 0; } // Red
            else if( eEasing === Easing.IN_OUT_QUADRATIC ) { r = 0; g = c; b = 0; } // Green
            else if( eEasing === Easing.OUT_QUADRATIC    ) { r = 0; g = 0; b = c; } // Blue
            else if( eEasing === Easing.IN_BACK          ) { r = z; g = z; b = 0; } // Yellow
            else if( eEasing === Easing.IN_OUT_BACK      ) { r = 0; g = z; b = z; } // Cyan
            else if( eEasing === Easing.OUT_BACK         ) { r = z; g = 0; b = z; } // Magenta

            var border = { size: 1       , r: r*z, g: g*z, b: b*z };
            var params = { w: dim, h: dim, r: r  , g: g  , b: b  , border: border };

            rect = new Rect().init( params );
            rect.index = iType - 1; // pointer to corresponding aVals[]
            aRect.push( rect );
            this.addXY( rect, left, y );

            var text = new Text().init( { text: EasingNames[ eEasing ], r: r, g: g, b: b, a:0.8 } );
            this._labels.addXY( text, 0, y );

            var val = new Text().init( { text: '?', r: 0, g: 0, b: 0 } );
            aVals.push( val );
            this.addXY( val, right + pad + dim, y ); // layout will fix x

            y += dy;
        }
        y += space;
        var bot = y;
        h = bot;

        this.addXY( this._labels,  right + pad + dim, 0 );

        aRect[0].setH( y ); // Didn't initially have total height, fix up reference guide

        // Visual Left and Right Edget Boundaries
        r = 0; g = 0; b = 0;

        // When all cubes moved right, black boundary line touching right edge
        var rectR = new Rect().init( { w: 1, h: y, r: r, g: g, b: b, a:0.5 } );
        this.addXY( rectR, right+dim+1, 0 ); // +1 to account for border

        // Grid
        var major = 1.0; // alpha of major grid line
        var minor = 1/3; // alpha of minor grid line

        // Vertical grid lines
        var i;
        x = left - dx*extra;
        for( i = -extra; i <= (10+extra); ++i )
        {
            // CellX
            //  0 dark
            //  5 darker
            // 10 dark
            //  ? "Ruler" Grid Blue
            r = (i === 0) ? 0 : 0.8;
            g = (i === 0) ? 0 : 0.9;
            b = (i === 0) ? 0 : 1.0;
            a = (i === 0) || (i === 5) || (i === 10)
                ? major
                : minor;

            line = new Rect().init( { w:1, h: h, r: r, g: g, b: b, a: a } );
            this._grid.addXY( line, x, 0 );

            x += dx;
        }

        // Horizontal grid lines
        r = 0.8;
        g = 0.9;
        b = 1.0;
        a = minor;

        for( y = top; y <= bot; y += dy )
        {
            line = new Rect().init( { w: w, h: 1, r: r, g: g, b: b, a: a } );
            this._grid.addXY( line, left - dx*extra, y + this.middle );
        }

        this.addXY( this._grid, 0, 0 );

        // Instructions
        var textHead = 'Easing Instructions';
        var textKeys =
        [
              '&larr;'
            , '&rarr;'
            , '&uarr;' 
            , '&darr;'
            , '{Return}'
            , '{Spacebar}'
        ];
        var textHelp =
        [
              'Animate left'
            , 'Animate right'
            , 'Set all boxes left' 
            , 'Set all boxes right'
            , 'Toggle direction'
            , 'Stop animation'
        ];
        var textFoot =
            '<a href="http://www.github.com/Michaelangel007/easing">http://www.github.com/Michaelangel007/easing</a>';

        var fontSize = 16;
        var head = new Text().init( { text: textHead, size: 2*fontSize } );

        this._instructions = new Widget().init();
        this._instructions.addXY( head,  0, 0 );

        y = fontSize*3;
        for( i = 0; i < textKeys.length; ++i )
        {
            var keys = new Text().init( { text: textKeys[i], size: fontSize } );
            var help = new Text().init( { text: textHelp[i], size: fontSize } );
            this._instructions.addXY( keys,  0, y );
            this._instructions.addXY( help, 96, y );

            y += fontSize * 1.5;
        }

        this._footer = new Text().init( { text: textFoot, size: fontSize*0.75|0 } );

        // layout will re-position to right align
        this.addXY( this._instructions, Game.w, 0 );
        this.addXY( this._footer      , Game.w, y );

        this._eases  = aEasing;
        this._rects  = aRect; // Save for anim start
        this._vals   = aVals;

        this._animating = 0; // current number of cubes in-flight
        this._direction = Direction.RIGHT;

        return this;
    },

    // While animating update the values with the current x position
    // ========================================================================
    onAnimInc: function( rect )
    {
        var i = rect.index; // child has offset/pointer into array of current x values
        if( i >= 0 )
            this._vals[ i ].setText( rect.getX() );
    },

    // ========================================================================
    onAnimDone: function( rect )
    {
        var edge = this._direction
            ? this.right
            : this.left;
        var done = rect.getX() === edge;
        if( done )
            rect.setA( 1.0 );

        this.onAnimInc( rect );

        --this._animating;
    },

    // ========================================================================
    onCreate: function()
    {
        this.onResize();
    },

    // ========================================================================
    onInput: function( isKeyPressed, key )
    {
        var bProcessed = true;

        if( isKeyPressed )
        {
            if( this._animating === 0 )
            {
                if((key === KEY.ENTER)
                || (key === KEY.LEFT)
                || (key === KEY.RIGHT))
                {
                    var prev = this._direction;
                    var edge = this._direction
                        ? this.right
                        : this.left;
                    var done = this._rects[0].getX() === edge;

                    if( key === KEY.ENTER )
                        this._direction = 1 - this._direction;

                    if( key === KEY.RIGHT )
                        this._direction = 1;

                    if( key === KEY.LEFT )
                        this._direction = 0;

                    if( !done || (done && (prev !== this._direction)) )
                        this.startAnim( this._direction, 2000 ); // milliseconds
                }
            }

            if( key === KEY.UP )
            {
                this._direction = 0;
                this.stopAnim();
                this.startAnim( this._direction, 0 );
                this._direction = 1 - this._direction;
            }

            if( key === KEY.DOWN )
            {
                this._direction = 1;
                this.stopAnim();
                this.startAnim( this._direction, 0 );
                this._direction = 1 - this._direction;
            }

            if( key === KEY.SPACE )
                if( this._animating > 0 )
                    this.stopAnim();
                else
                {
                    // TODO: Reverse direction if all are at the same edge
                    this.startAnim( this._direction, 2000 );
                }
        }

        return bProcessed;
    },

    // ========================================================================
    onResize: function()
    {
        // Fixup column of values
        var i, n = this._vals.length;

        var x     = this._labels.getX();
        var w     = this._labels.getDimensions().w;
        var align = x + w + this.middle;

        // set initial values
        for( i = 0; i < n; ++i )
        {
            this._vals[ i ].setX   ( align );
            this._vals[ i ].setText( this._rects[ i ].getX() );
        }

        // right align instructions
        var dim = this._instructions.getDimensions();
        this._instructions.setX( Game.w - (dim.w + this.middle) );

        // right align footer
        this._footer.setX( Game.w - this._footer.getW() );
    },

    /**
     * @param {Boolean} isDirectionRight
     * @param {Number}  durationMS
     */
    // ========================================================================
    startAnim: function( isDirectionRight, durationMS )
    {
        var edge = isDirectionRight
            ? this.right
            : this.left;

        this._animating = 0;

        var self = this;
        var cbEnd = function( axis, widget )
        {
            self.onAnimDone( widget );
        };

        var cbInc = function( axis, widget )
        {
            self.onAnimInc( widget );
        }

        var rect;
        var eases = this._eases;
        var rects = this._rects;
        var nRect = this._rects.length;

        for( var iRect = 0; iRect < nRect; ++iRect )
        {
            var easing = eases[ iRect ];

            rect = rects[ iRect ];
            var done = rect.getX() === edge;

            if( !done )
            {
                if( !durationMS )
                    rect.setA( 1.0 );
                else
                    rect.setA( 0.5 ); // 0.25

                ++this._animating;
                rect.animate( { x: edge, ms: durationMS, type: easing, onEnd: cbEnd, onInc: cbInc } );
            }
        }
    },

    // ========================================================================
    stopAnim: function()
    {
        var aRect = this._rects;
        var nRect = this._rects.length;

        for( var iRect = 0; iRect < nRect; ++iRect )
            aRect[ iRect ].stop( Axis.X );
    },
};

