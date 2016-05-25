var Crafty = require('craftyjs');

var assets = {
	"images" : "assets/notion_logo.png"
};

Crafty.load(assets, function() {

	Crafty.init();
	Crafty.background('rgb(150,200,255)');
	Crafty.webgl.init();

	var ctx = Crafty.webgl.context
	var dims = { width: ctx.drawingBufferWidth, height: ctx.drawingBufferHeight };
	var size = dims.width/5;


	var logo = Crafty.e('2D, WebGL, Image, Draggable, Gravity')
		.image('assets/notion_logo.png')
		.gravity('2D');
	  // .attr({x: dims.width/2-size/2, y: dims.height/2-size/2, w: size, h: size})

	var platform = Crafty.e('2D, WebGL, Color')
									.color(0, 255, 100, 1)
									.attr({x: 0, y: dims.height-5, w: dims.width, h: 10});

});
