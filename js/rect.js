"use strict";

function Rect() {}

Rect.prototype =
{
    /**
     * @param {Number}  params.w    - Width
     * @param {Number}  params.h    - Height
     * @param {Number} [params.r=0] - Normalized red   (0.0 .. 1.0)
     * @param {Number} [params.g=0] - Normalized green (0.0 .. 1.0)
     * @param {Number} [params.b=0] - Normalized green (0.0 .. 1.0)
     * @param {Number} [params.a=1] - Normalized alpha (0.0 .. 1.0)
     */
    init: function( params )
    {
        Widget.prototype.init.call( this, "Rect" );

        if( params.w ) this.setW( params.w );
        if( params.h ) this.setH( params.h );
        if( params.r ) this.setR( params.r );
        if( params.g ) this.setG( params.g );
        if( params.b ) this.setB( params.b );
        if( params.a ) this.setA( params.a );

        return this;
    },
};

