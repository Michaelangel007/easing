"use strict";

function Plot() {}

Plot.prototype =
{
    init: function()
    {
        Widget.prototype.init.call( this, "Plot" );

        var w = 300, h = 300;

        var left  = 150, top = 150;
        var right = left + w, bot = top + h;

        // font
            var size = 32;
            var pad  = size/4;

            var x, n = w+1, y;

        // Grid
            var major = 1.0; // alpha of major grid line
            var minor = 1/3; // alpha of minor grid line

            var line;
            var grid = new Widget().init(); // container

            var text;
            var gridLabelX = new Widget().init();
            var gridLabelY = new Widget().init();

            var dx    = (right - left) / 10;
            var dy    = (bot   - top ) / 10;

            var i;
            var r, g, b, a;

            var extra = 4; // number of extra cells on edges

            var gw = w + dx*extra*2;
            var gh = h + dy*extra*2;

            var gx = -dx*extra; // pad
            var gy = -dy*extra;

            var gb = gh + 2*gy; // bottom

            x = gx;
            y = -dy*extra;

            // Axis label colors
            var xR = 0.5;
            var xG = 0.0;
            var xB = 0.0;

            var yR = 0.0;
            var yG = 0.5;
            var yB = 0.0;

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

                if( (i === -extra) || ((i-10) === extra) )
                {
                    r = g = b = 0;
                }

                if( (i <   -extra) || ((i-10) >   extra) )
                {
                    r = 0;
                    g = 0;
                    b = 1;
                    a = 0;
                }

                // Vertical grid lines
                line = new Rect().init( { w:1, h: gh, r: r, g: g, b: b, a: a } );
                grid.addXY( line, x, gy );

                // Axis labels x and y
                if( (i >= 0) && (i <= 10) )
                {
                    var axisLabel = (i/10).toFixed(1);

                    text = new Text().init( { text: axisLabel, r:xR, g:xG, b:xB } );
                    gridLabelX.addXY( text, x, gb );

                    if( i ) // don't duplicate '0.0'
                    {
                        text = new Text().init( { text: axisLabel, r:yR, g:yG, b:yB } );
                        gridLabelY.addXY( text, 0, gb - y );
                    }
                }

                // Horizontal grid lines
                line = new Rect().init( { w: gw, h: 1, r: r, g: g, b: b, a:a } );
                grid.addXY( line, gx, gb - y );

                x += dx;
                y += dy;
            }

            this.addXY( grid, left, top );
            this._grid = grid;

            this.addXY( gridLabelX, left, top );
            this.addXY( gridLabelY, left, top );
            this._gridLabelX = gridLabelX;
            this._gridLabelY = gridLabelY;

        // Label showing easing type
            text = new Text().init( { text:'', size: size } );
            this.addXY( text, left, gh + dy );

        // Graph
            var rect;
            var plot = new Widget().init();
            this.addXY( plot, left, top );

            for( x = 0; x < n; ++x )
            {
                rect = new Rect().init( { w: 1, h: 1, r: 1/3, g: 2/3, b: 1, a:1 } );
                y = h - x;
                plot.addXY( rect, x, y );
            }

        // Animation
            this._easing = Easing.LINEAR;

            var steps = 1000;
            var dim   = 3;
            rect = new Rect().init( { w:2*dim+1, h:2*dim+1, r:1, g:0, b:0 } );
            rect.setT( 0 );
            rect._dim      = dim + 1;
            rect._steps    = steps;
            rect._invSteps = 1 / steps;
            this.addXY( rect, 0, 0 );

            var self     = this;
            var onIncDec = function( axis, widget )
            {
                self.onIncDec( widget );
            };

            var objInc = {};
            var objDec = {};
            var params = function( obj, onEnd, t )
            {
                obj.axis  = Axis.T;
                obj.ms    = 2000;
                obj.type  = self._easing;
                obj.onInc = onIncDec;

                obj.onEnd = onEnd;
                obj.t     = t;
            };

            var cbInc = function( axis ) { self.objInc.type = self._easing; self._anim.animate( self.objInc ); }; // Done decrement, start increment animation
            var cbDec = function( axis ) { self.objInc.type = self._easing; self._anim.animate( self.objDec ); }; // Done increment, start decrement animation

            params( objInc, cbDec, steps ); // Count up   to 1000
            params( objDec, cbInc,     0 ); // Count down to    0

            this._cbInc = cbInc;
            this._cbDec = cbDec;
            this.objInc = objInc;
            this.objDec = objDec;

            var val = new Text().init( { text: 'ABC' } );
            this.addXY( val, left + gw, gb );

        // layout needs access
            this._top    = top;
            this._left   = left;
            this._w      = w;
            this._h      = h;
            this._plot   = plot;
            this._gb     = gb;
            this._text   = text;
            this._val    = val;
            this._anim   = rect;

        return this;
    },

    // ========================================================================
    layout: function( delta )
    {
        var easing = this._easing;

        easing += delta;
        if( easing < Easing.LINEAR )
            easing = Easing.NUM - 1;
        if( easing >=Easing.NUM    )
            easing = Easing.LINEAR ;

        this._easing = easing;

        var op = EasingFuncs[ easing ];

        var plot = this._plot;
        var w    = this._w;
        var h    = this._h;

        var x, n = w + 1;
        var p, y;

        var p0, p1;

        Game.bg.clearRect( 0, 0, Game.w, Game.h );
        Game.fg.clearRect( 0, 0, Game.w, Game.h );

        for( x = 0; x < n; ++x )
        {
            /*
                Notes:
                * 100 - y, since origin is top-left
                * Math.floor() to work around crappy double precision floating point
                    y = h - ( op( p ) * h );
                  Linear:
                    55% = 44.99999999999999
                    56% = 43.99999999999999
                    57% = 43.00000000000001
                    58% = 42.00000000000001
            */
            p = x / n;
            y = h - Math.floor( op( p )*h + 0.5 );

            plot._children[ x ].setY( y );


            // Since 'pixel' plotting leaves gaps
            // Use canvas line drawing
            if( x > 0 )
            {
                p0 = plot._children[ x - 1 ].getAbsXY();
                p1 = plot._children[ x     ].getAbsXY();
                this.drawLine( p0.x, p0.y, p1.x, p1.y, '#007FFF', Game.bg );
            }
        }

        var i_n  = '' + this._easing + ' of ' + (Easing.NUM - 1) + ': ';
        var text = EasingNames[ this._easing ];

        this._text.setText( i_n + text );

        var isAnimating = this._anim.isAnimating( Axis.T );
        this._anim.stop( Axis.T );
        if( isAnimating )
            this._cbInc();
        else
            this.onIncDec( this._anim );
    },

    // ========================================================================
    drawLine: function( x0, y0, x1, y1, color, context )
    {
        context.beginPath();
            context.strokeStyle = color;
            context.moveTo( x0, y0 );
            context.lineTo( x1, y1 );
        context.stroke();
    },

    // ========================================================================
    fixupGridLabels: function()
    {
        var kid;
        var x, y;
        var w, h;
        var i, n;
        var gridLabelX = this._gridLabelX;
        var gridLabelY = this._gridLabelY;
        var pad = 2;
        var dim;

        n = gridLabelX._children.length;
        for( i = 0; i < n; ++i )
        {
            kid = gridLabelX._children[i];
            dim = kid.getMetrics();
            y   = pad;
            y  += (i & 1) ? dim.h :  0;
            kid.setX( dim.x - dim.w*0.5 ); // Center
            kid.setY( dim.y + y );

            if( i != (n-1) )
            {
                kid = gridLabelY._children[i];
                dim = kid.getMetrics();
                kid.setX( dim.x - dim.w - pad );
            }
        }
    },

    // ========================================================================
    onCreate: function()
    {
        this.fixupGridLabels();
        this.layout( 0 );
        this._cbInc();
    },

    // Update animating rect position
    // ========================================================================
    onIncDec: function( rect )
    {
        var w  = this._w;
        var h  = this._h;

        var t  = rect.getT();
        var op = EasingFuncs[ this._easing ];
        var p  = t * rect._invSteps;
        var q  = op( p );

        // NOTE: InOutBack() can actually go negative!
        //     EasingFuncs[ Easing.IN_OUT_BACK ]( 0.008 )
        var x  = this._left + w*p;
        var n  = h*q;
        var y  = this._top  + this._gb - n;
        rect.setX( x - rect._dim );
        rect.setY( y - rect._dim );

        rect._parent._val.setText( p.toFixed( 5 ) );
    },

    // ========================================================================
    onInput: function( isKeyPressed, key )
    {
        if( isKeyPressed )
        {
            if( key === KEY.DOWN ) // Set to zero
            {
                this._anim.clearOnEnd( Axis.T );
                this._anim.stop( Axis.T );
                this._anim.setT( 0 );
                this.onIncDec( this._anim );
            }

            if( key === KEY.UP ) // Set to one
            {
                this._anim.clearOnEnd( Axis.T );
                this._anim.stop( Axis.T );
                this._anim.setT( this._anim._steps );
                this.onIncDec( this._anim );
            }

            if( key === KEY.MINUS ) // Move red anim dot closer to zero
            {
                this._anim.clearOnEnd( Axis.T );
                this._anim.stop( Axis.T );

                var t = this._anim.getT();
                t -= 10;
                if( t < 0 )
                    t = 0;
                this._anim.setT( t );
                this.onIncDec( this._anim );
            }

            if( key === KEY.EQUAL ) // Move red anim dot closer to one
            {
                this._anim.clearOnEnd( Axis.T );
                this._anim.stop( Axis.T );

                var t = this._anim.getT();
                t += 10;
                if( t > this._anim._steps)
                    t = this._anim._steps;
                this._anim.setT( t );
                this.onIncDec( this._anim );
            }

            if( key === KEY.ENTER ) // Stop animation
            {
                // resume( Axis.T )
                this._anim.clearOnEnd( Axis.T );
                this._anim.stop( Axis.T );
                this._anim.setT( 0 );
                this.onIncDec( this._anim );
            }

            if( key === KEY.SPACE ) // Toggle animation
            {
                var isAnimating = this._anim.isAnimating( Axis.T );
                if( isAnimating )
                {
                    this._anim.clearOnEnd( Axis.T );
                    this._anim.stop( Axis.T );
                    this.onIncDec( this._anim );
                }
                else
                {
                    this._cbInc();
                }
            }

            if( key === KEY.LEFT )
                this.layout( -1 );

            if( key === KEY.RIGHT )
                this.layout( +1 );
        }
    },
};
