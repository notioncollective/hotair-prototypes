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


	var logo = Crafty.e('2D, WebGL, Image, Draggable').image('assets/notion_logo.png')
	  // .attr({x: dims.width/2-size/2, y: dims.height/2-size/2, w: size, h: size})


	var info = Crafty.e('2D, Canvas, Text')
							.attr({x: 5, y: dims.height - 15})
							.text("Drag & drop the logo!")
							.textColor('black');



});
