"use strict";

function Game() {}

Game.w = 0;
Game.h = 0;

Game.prototype =
{
    // ========================================================================
    init: function()
    {
        Widget.prototype.init.call( this, "Game" );

        // setup for focusRequest()
        var self = this;
        Widget.focus = self;

        // root attachment point for all widgets
        this._parent      = document.body;
        this._parent._div = document.getElementById( 'root' );
        this.createChildren();

        Game.w = window.innerWidth ; // document.body.width;
        Game.h = window.innerHeight; // document.body.height;

        // Allow input once all children are created
        // @param {KeyboardEvent} keyEvent - data
        var onKeyDown = function( keyEvent )
        {
            self.input( true, keyEvent.keyCode );
        };
        var onKeyUp = function( keyEvent )
        {
            self.input( false, keyEvent.keyCode );
        };

        document.body.onkeyup   = onKeyUp;
        document.body.onkeydown = onKeyDown;

        var onResize = function()
        {
            Game.w = window.innerWidth ; // document.body.width;
            Game.h = window.innerHeight; // document.body.height;
            self.resize();
        };
        window.addEventListener( 'resize', onResize );

        return this;
    },

    // ========================================================================
    createCanvasContext: function( id )
    {
        // Normally
        //      var canvas = document.getElementById( 'canvas' );
        // But we are creating the canvas programmatically
        var canvas                = document.createElement( 'canvas' );
            canvas.id             = id;
            canvas.width          = Game.w;
            canvas.height         = Game.h;
            canvas.style.left     = 0;
            canvas.style.top      = 0;
            canvas.style.position = 'absolute';
            canvas.style.margin   = '0px';


        document.body.appendChild( canvas );
        Game[ id ] = canvas.getContext('2d'); // Game.fg, Game.bg
    },

    // @param {Widget} className - screen to create and switch focus to
    // @param {Object} [params]  - Additional configuration
    // ========================================================================
    pushScreen: function( className, params )
    {
        var screen = new className().init( params );

        this.addXY( screen, 0, 0 );
        screen.createChildren();

        this.focusRequest( screen );
    },

    // @param DOMHighResTimeStamp
    // ========================================================================
    run: function( timestamp )
    {
        var dT = timestamp - Widget.time;
        Widget.time = timestamp;

        this.update( dT );
    },
};

