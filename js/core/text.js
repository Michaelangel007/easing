"use strict";

function Text() {}

Text.prototype =
{
    /**
     * @params {String} [params.text=''          ] - Text to display
     * @params {String} [params.font='sans-serif'] - Font family
     * @params {Number} [params.size=16          ] - Font size in pixels
     * @params {Number} [params.r=0              ] - Red   (normalized)
     * @params {Number} [params.g=0              ] - Green (normalized)
     * @params {Number} [params.b=0              ] - Blue  (normalized)
     * @params {Number} [params.a=1              ] - Alpha
     * @params {Number} [params.w=undefined      ] - Width  in pixels, undefined = auto width
     * @params {Number} [params.h=undefined      ] - Height in pixels, undefined = auto height
     */
    init: function( params )
    {
        Widget.prototype.init.call( this, "Text" );

        this.setS   ( params.size || 16 );
        this.setText( params.text );
        this._font = params.font || 'sans-serif'; // "Verdana"

        this.setR( params.r || 0 );
        this.setG( params.g || 0 );
        this.setB( params.b || 0 );
        this.setA( params.a || 1 );

        this.setW( params.w ); // Note: undefined is valid
        this.setH( params.h ); // Note: undefined is valid

        return this;
    },

    getW: function() { return this._div.offsetWidth ; },
    getH: function() { return this._div.offsetHeight; },

    onCreate: function()
    {
        var div = this._div;

        // .style.fontSize already set in Widget via setS()
        div.style.fontFamily = this._font;
        div.innerHTML        = this._text;
    },

    setColor: function( color )
    {
        if( this._div )
            this._div.style.color = color;
    },

    setText: function( text )
    {
        if( text === undefined )
            text = "";

        this._text = text;

        if( this._div )
            this._div.innerHTML = text;
    },
};

