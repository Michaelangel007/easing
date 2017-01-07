"use strict";

function GraphScreen() {}

GraphScreen.PAD = 4;

GraphScreen.prototype =
{
    init: function()
    {
        Widget.prototype.init.call( this, "GraphScreen" );

        var w = 300, h = 300;

        var left  = 150, top = 150;
        var right = left + w, bot = top + h;

        // font
            var fontSize = 24;
            var pad      = fontSize/4;

            var x, n = w+1, y;

        // Easing
        this._iEasing = 0;
        this._aEasing =
        [
            Easing.LINEAR          ,

        // Sorted "Visually" by slope
            Easing.IN_SQRT         ,
            Easing.IN_LOG10        ,
            Easing.IN_SINE         ,
            Easing.IN_QUADRATIC    ,
            Easing.IN_CUBIC        ,
            Easing.IN_CIRCLE       ,
            Easing.IN_QUARTIC      ,
            Easing.IN_QUINTIC      ,
            Easing.IN_BACK         ,
            Easing.IN_SEXTIC       ,
            Easing.IN_EXPONENT2    ,
            Easing.IN_SEPTIC       ,
            Easing.IN_OCTIC        ,
            Easing.IN_EXPONENTE    ,
            Easing.IN_ELASTIC      ,
            Easing.IN_BOUNCE       ,

            Easing.IN_OUT_SQRT     ,
            Easing.IN_OUT_LOG10    ,
            Easing.IN_OUT_SINE     ,
            Easing.SMOOTHSTEP      , // cubic variation
            Easing.IN_OUT_QUADRATIC,
            Easing.IN_OUT_CUBIC    ,
            Easing.IN_OUT_CIRCLE   ,
            Easing.IN_OUT_QUARTIC  ,
            Easing.IN_OUT_QUINTIC  ,
            Easing.IN_OUT_BACK     ,
            Easing.IN_OUT_SEXTIC   ,
            Easing.IN_OUT_EXPONENT2,
            Easing.IN_OUT_SEPTIC   ,
            Easing.IN_OUT_OCTIC    ,
            Easing.IN_OUT_EXPONENTE,
            Easing.IN_OUT_ELASTIC  ,
            Easing.IN_OUT_BOUNCE   ,

            Easing.OUT_SQRT        ,
            Easing.OUT_LOG10       ,
            Easing.OUT_SINE        ,
            Easing.OUT_QUADRATIC   ,
            Easing.OUT_CUBIC       ,
            Easing.OUT_CIRCLE      ,
            Easing.OUT_QUARTIC     ,
            Easing.OUT_QUINTIC     ,
            Easing.OUT_BACK        ,
            Easing.OUT_SEXTIC      ,
            Easing.OUT_EXPONENT2   ,
            Easing.OUT_SEPTIC      ,
            Easing.OUT_OCTIC       ,
            Easing.OUT_EXPONENTE   ,
            Easing.OUT_ELASTIC     ,
            Easing.OUT_BOUNCE      ,
        ];


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

            var gr = gw +   gx; // outer right edge
            var gb = gh + 2*gy; // x-axis bottom

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
            y = gh + dy;
            var typeLabel = new Text().init( { size: fontSize } ); // Type
            this.addXY( typeLabel, left, y );

            var iofnLabel = new Text().init( { size: fontSize } ); // # of #
            this.addXY( iofnLabel, left, y + fontSize );

            /*
                "Transport" or "Media Controls"
                https://en.wikipedia.org/wiki/Media_controls

                NOT the Unicode Transport Block
                http://unicode.org/charts/PDF/U1F680.pdf

                    Hex    Symbol Description
                    #5107B >      Play
                    #5111B ||     Pause
                    #5110B []     Stop
                    n/a    <<     Rewind
                    #5108B >>     Fast Forward
                    #5862  |<     Skip Previous
                    #5861  >|     Skip Next

                http://stackoverflow.com/questions/22885702/html-for-the-pause-symbol-in-a-video-control

                    http://fortawesome.github.io/Font-Awesome/icons/#video-player
                    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
                    <i class="fa fa-arrows-alt"></i>
                    <i class="fa fa-backward"></i>
                    <i class="fa fa-compress"></i>
                    <i class="fa fa-eject"></i>
                    <i class="fa fa-expand"></i>
                    <i class="fa fa-fast-backward"></i>
                    <i class="fa fa-fast-forward"></i>
                    <i class="fa fa-forward"></i>
                    <i class="fa fa-pause"></i>
                    <i class="fa fa-play"></i>
                    <i class="fa fa-play-circle"></i>
                    <i class="fa fa-play-circle-o"></i>
                    <i class="fa fa-step-backward"></i>
                    <i class="fa fa-step-forward"></i>
                    <i class="fa fa-stop"></i>
                    <i class="fa fa-youtube-play"></i>
            */
            var prevLabel = new Text().init( { text: '|<', size: fontSize } );
            var nextLabel = new Text().init( { text: '>|', size: fontSize } );
            this.addXY( prevLabel, left  + gx, y );
            this.addXY( nextLabel, right - gx, y );

            // TODO: <<  time -
            // TODO: >>  time +
            // TOOD: >   Play

            // And side labels and values
            x = left + gw;
            y = 0;

            var timeLabel = new Text().init( { text: 'x: ', size: fontSize, r:xR, g:xG, b:xB } ); // Normal Time
            var timeText  = new Text().init( { text: '?'  , size: fontSize                   } );

            var warpLabel = new Text().init( { text: 'y: ', size: fontSize, r:yR, g:yG, b:yB } ); // Warped Time
            var warpText  = new Text().init( { text: '?'  , size: fontSize                   } );


            this._sideL = new Widget().init(); // Container
            this._sideN = new Widget().init();

            this._sideL.addXY( timeLabel, 0, y );
            this._sideN.addXY( timeText , 0, y ); y += fontSize;
            this._sideL.addXY( warpLabel, 0, y );
            this._sideN.addXY( warpText , 0, y ); y += fontSize;

            this.addXY( this._sideL, left + gr + GraphScreen.PAD, top + gb );
            this.addXY( this._sideN, left + gr + GraphScreen.PAD, top + gb );

        // Graph
            var rect;
            var plot = new Widget().init();
            this.addXY( plot, left, top );

            for( x = 0; x < n; ++x )
            {
                rect = new Rect().init( { w: 1, h: 1, r: 1/3, g: 2/3, b: 1, a:0 } );
                y = h - x;
                plot.addXY( rect, x, y );
            }

        // Animation
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
                obj.type  = self._iEasing;
                obj.onInc = onIncDec;

                obj.onEnd = onEnd;
                obj.t     = t;
            };

            var cbInc = function( axis ) { self.objInc.type = self._iEasing; self._anim.animate( self.objInc ); }; // Done decrement, start increment animation
            var cbDec = function( axis ) { self.objInc.type = self._iEasing; self._anim.animate( self.objDec ); }; // Done increment, start decrement animation

            params( objInc, cbDec, steps ); // Count up   to 1000
            params( objDec, cbInc,     0 ); // Count down to    0

            this._cbInc = cbInc;
            this._cbDec = cbDec;
            this.objInc = objInc;
            this.objDec = objDec;

        // Instructions
        var textHead = 'Easing Graph Instructions';
        var textKeys =
        [
              '&larr;'
            , '&rarr;'
            , '&uarr;'
            , '&darr;'
            , '{Space}'
            , '{Enter}'
            , '+'
            , '-'
        ];
        var textHelp =
        [
              'Previous easing function'
            , 'Next easing function'
            , 'Set time to 1'
            , 'Set time to 0'
            , 'Toggle start/stop animation'
            , 'Stop animation, set time to 0'
            , 'Add 0.1 to time'
            , 'Subtract 0.1 to time'
        ];
        var textFoot =
            '<a href="http://www.github.com/Michaelangel007/easing">http://www.github.com/Michaelangel007/easing</a>';

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


        // layout needs access
            this._top    = top;
            this._left   = left;
            this._w      = w;
            this._h      = h;

            this._gridL  = left  + gx;
            this._gridR  = right - gx;
            this._gridW  = gw;

            this._plot   = plot;
            this._gb     = gb;

            this._type$  = typeLabel;
            this._iofn$  = iofnLabel;

            this._prev$  = prevLabel;
            this._next$  = nextLabel;

            this._time$  = timeText;
            this._warp$  = warpText;

            this._anim   = rect;

        return this;
    },

    // ========================================================================
    layout: function( delta )
    {
        var easing = this._iEasing;
        var last   = this._aEasing.length - 1;

        easing += delta;
        if( easing < 0 )
            easing = last;
        if( easing > last )
            easing = 0;

        this._iEasing = easing;
        var f = EasingFuncs[ this._aEasing[ easing ] ];

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
                    y = h - ( f( p ) * h );
                  Linear:
                    55% = 44.99999999999999
                    56% = 43.99999999999999
                    57% = 43.00000000000001
                    58% = 42.00000000000001
            */
            p = x / n;
            y = h - Math.floor( f( p )*h + 0.5 );

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

        var text = EasingNames[ this._aEasing[ this._iEasing ] ];
        var i_n  = '' + this._iEasing + ' of ' + last;

        this._type$.setText( text );
        this._iofn$.setText( i_n  );

        var dim;
        dim = this._type$.getMetrics(); this._type$.setX( this._gridL + (this._gridW - dim.w)*0.5 );
        dim = this._iofn$.getMetrics(); this._iofn$.setX( this._gridL + (this._gridW - dim.w)*0.5 );

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
            y  += (i & 1) ? dim.h :  0; // stagger horizontal axis labels vertically
            kid.setX( dim.x - dim.w*0.5 ); // Center
            kid.setY( dim.y + y );

            if( i != (n-1) )
            {
                kid = gridLabelY._children[i];
                dim = kid.getMetrics();
                kid.setX( dim.x - dim.w - pad );
                kid.setY( dim.y - dim.h*0.5 );
            }
        }
    },

    // ========================================================================
    fixupTextLabels: function()
    {
        // Put SideR's left edge adjacent SideL's width
        // SideL  SideR
        //
        // Head1  Val1
        // Head2  Val2
        // Head3  Val3
        var dim = this._sideL.getDimensions();
        var x   = this._sideN.getX();
        /*     */ this._sideN.setX( x + dim.w + GraphScreen.PAD );

        // Right Align '>' next button
        dim = this._next$.getDimensions();
        x   = this._next$.getX();
        /* */ this._next$.setX( x - dim.w );
    },

    // ========================================================================
    onCreate: function()
    {
        this.fixupGridLabels();
        this.fixupTextLabels();

        this.layout( 0 );
        this._cbInc();

        this.onResize();
    },

    // Update animating rect position
    // ========================================================================
    onIncDec: function( rect )
    {
        var w  = this._w;
        var h  = this._h;

        var t = rect.getT();
        var f = EasingFuncs[ this._aEasing[ this._iEasing ] ];
        var p = t * rect._invSteps;
        var q = f( p );

        // NOTE: InOutBack() can actually go negative!
        //     EasingFuncs[ Easing.IN_OUT_BACK ]( 0.008 )
        var x  = this._left + w*p;
        var n  = h*q;
        var y  = this._top  + this._gb - n;
        rect.setX( x - rect._dim );
        rect.setY( y - rect._dim );

        t /= 1000;

        this._time$.setText( t.toFixed( 5 ) );
        this._warp$.setText( q.toFixed( 5 ) );
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

    // ========================================================================
    onResize: function()
    {
        var dim = this._instructions.getDimensions();
        this._instructions.setX( Game.w - (dim.w               + GraphScreen.PAD) ); // right align instructions
        this._footer      .setX( Game.w - (this._footer.getW() + GraphScreen.PAD) ); // right align footer
        this._footer      .setY( Game.h - (this._footer.getH() + GraphScreen.PAD) );
    },
};
