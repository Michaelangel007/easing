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
        document.body.onkeyup   = function( keyEvent ) { self.onKeyUp  ( keyEvent ); };
        document.body.onkeydown = function( keyEvent ) { self.onKeyDown( keyEvent ); };

        return this;
    },

    // @param KeyboardEvent - data
    // =======================================================================
    onKeyDown: function( keyEvent )
    {
        this.input( true, keyEvent.keyCode );
    },

    // @param KeyboardEvent - data
    // ========================================================================
    onKeyUp: function( keyEvent )
    {
        this.input( false, keyEvent.keyCode );
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
        // Alternative: update( dT )
        //var dT = timestamp - Widget.time;
        Widget.time = timestamp;

        this.update();
    },
};

