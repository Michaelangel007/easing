"use strict";

var game = undefined;

// ========================================================================
function Extend( BaseClass, DerivedClass )
{
    // Keep reference to pre-existing prototypes
    var DerivedFuncs = DerivedClass.prototype;

    DerivedClass.prototype             = Object.create( BaseClass.prototype );
    DerivedClass.prototype.constructor = DerivedClass;

    // Since we over-wrote all the derived prototypes with the base class ones
    // we need to restore the pre-existing ones
    for( var key in DerivedFuncs )
        DerivedClass.prototype[ key ] = DerivedFuncs[ key ];
}

// ========================================================================
function OnAnimFrame( timestamp )
{
    game.run( timestamp );
    window.requestAnimationFrame( OnAnimFrame );
}

/*
 * @param {Widget} screen          - Ease or Plot
 * @param {Number} [bCanvasMask=3] - Bitmask of which canvas to create. 1 = Background, 2 = Foreground
 */
// ========================================================================
function OnLoad( screen, bCanvasMask )
{
    // Core
    Extend( Widget, Game );
    Extend( Widget, Rect );
    Extend( Widget, Text );

    // Screen
    Extend( Widget, Ease );
    Extend( Widget, GraphScreen );

    game = new Game().init( bCanvasMask );
    game.pushScreen( screen );

    OnAnimFrame( 0 );
}

