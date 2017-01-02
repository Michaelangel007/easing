"use strict";

function Rect() {}

Rect.prototype =
{
    /**
     * @param {Number}    params.w             - Width
     * @param {Number}    params.h             - Height
     * @param {Number}   [params.r=0]          - Normalized red   [0.0 .. 1.0]
     * @param {Number}   [params.g=0]          - Normalized green [0.0 .. 1.0]
     * @param {Number}   [params.b=0]          - Normalized blue  [0.0 .. 1.0]
     * @param {Number}   [params.a=1]          - Normalized alpha [0.0 .. 1.0]
     * @param {Object}   [params.border]       - Optional border
     * @param {Number}   [params.border.size]  - Single value will be applied to top,left,bottom,right border thickness
     * @param {Number[]} [params.border.skirt] - Array for [top,right,bottom,left] for border thickness
     * @param {Number}   [params.border.r=0]   - Normalized border color red   [0.0 .. 1.0]
     * @param {Number}   [params.border.g=0]   - Normalized border color green [0.0 .. 1.0]
     * @param {Number}   [params.border.b=0]   - Normalized border color blue  [0.0 .. 1.0]
     */
    // ========================================================================
    init: function( params )
    {
        Widget.prototype.init.call( this, "Rect" );

        if( params.w !== undefined ) this.setW( params.w );
        if( params.h !== undefined ) this.setH( params.h );
        if( params.r !== undefined ) this.setR( params.r );
        if( params.g !== undefined ) this.setG( params.g );
        if( params.b !== undefined ) this.setB( params.b );
        if( params.a !== undefined ) this.setA( params.a );

        if( params.border )
        {
            var border = params.border;
            var skirt  = border.size
                ? [ border.size, border.size, border.size, border.size ]
                : border.skirt;

            if( !Array.isArray( skirt ) )
                console.error( "Border is not array!" );

            this._borderR   = border.r || 0;
            this._borderG   = border.g || 0;
            this._borderB   = border.b || 0;
            this._borderDim = skirt;
        }

        return this;
    },

    // ========================================================================
    onCreate: function()
    {
        if( this._borderDim )
        {
            var div = this._div;

            div.style.borderColor = Widget.RGBtoHex( this._borderR, this._borderG, this._borderB );
            div.style.borderStyle = 'solid solid solid solid';
            div.style.borderWidth = ''
                + this._borderDim[0] + 'px ';
                + this._borderDim[1] + 'px ';
                + this._borderDim[2] + 'px ';
                + this._borderDim[3] + 'px ';
        }
    },
};

