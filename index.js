var Crafty = require('craftyjs');
var dat = require('exdat');

var assets = {
	"images" : "assets/notion_logo.png"
};

var params = {
	scene: 'gravity'
}

// loading scene
Crafty.defineScene("loading", function() {
	Crafty.background("#000");
  Crafty.e("2D, Canvas, Text")
	  .attr({ w: 100, h: 20, x: 150, y: 120 })
	  .text("Loading")
	  .textColor("#FFFFFF");
});

Crafty.defineScene("gravity",function() {
	Crafty.background("rgb(150,200,255)");

	var dims = getDims();

	// logo
	var logo = Crafty.e('2D, WebGL, Image, Draggable, Gravity')
		.image('assets/notion_logo.png')
		.gravity('2D');
	  // .attr({x: dims.width/2-size/2, y: dims.height/2-size/2, w: size, h: size})

	// bottom platform
	var platform = Crafty.e('2D, WebGL, Color')
									.color(0, 255, 100, 1)
									.attr({x: 0, y: dims.height-5, w: dims.width, h: 10});	
});

Crafty.defineScene("simple-touch", function() {
	Crafty.background("rgb(150,200,255)");

});

function getDims() {

	Crafty.webgl.init();

	// other basic stuff
	var ctx = Crafty.webgl.context
	return { width: ctx.drawingBufferWidth, height: ctx.drawingBufferHeight };
}


// setup crafty
Crafty.init();
Crafty.enterScene("loading");

var gui = new dat.GUI();
gui.add(params, 'scene', ['gravity', 'simple-touch']).onChange(function(val) {
	Crafty.enterScene(val);
});

// load & go!
Crafty.load(assets, function() {
	Crafty.enterScene(params.scene);
});
