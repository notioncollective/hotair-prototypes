// polyfills
require('es6-promise').polyfill();
require('whatwg-fetch');

var keydown = require('keydown');
var Hammer = require('hammerjs');

// var dat = require('exdat');

console.log('Crafty', Crafty);

var assets = {
	"images" : "assets/notion_logo.png"
};

var params = {
	scene: 'simple-touch'
}

var scenes = [
	'gravity',
	'simple-touch'
];
var sceneIndex = 0;

var dims;
var ctx;
var touchEvents;

// loading scene
Crafty.defineScene("loading", function() {
	Crafty.background("#000");
  Crafty.e("2D, Canvas, Text")
	  .attr({ w: 100, h: 20, x: 150, y: 120 })
	  .text("Loading")
	  .textColor("#FFFFFF");
});

//
// Balloon component
//
Crafty.c('Balloon', {
	init: function() {
		this.requires('2D, WebGL');

		// trigger the Offscreen event if balloon goes offscreen
		this.bind('Move', function(e) {
			if(e._y < 0) {
				this.trigger('Offscreen');
			}
		});

		// move on every frame
		this.bind('EnterFrame', this.move)

	},
	move: function(e) {
		this.y = this.y-1;
	},
	hit: function() {
		this.trigger('Hit');
		this.destroy();
	}
});

//
// Intro gravity scene
//
Crafty.defineScene("gravity",
	function init() {
	Crafty.background("rgb(150,200,255)");


	// logo
	var logo = Crafty.e('2D, WebGL, Image, Draggable, Gravity')
		.image('assets/notion_logo.png')
		.gravity('2D');
	  // .attr({x: dims.width/2-size/2, y: dims.height/2-size/2, w: size, h: size})

	// bottom platform
	var platform = Crafty.e('2D, WebGL, Color')
									.color(0, 255, 100, 1)
									.attr({x: 0, y: dims.height-5, w: dims.width, h: 10});	
	},
	function uninit() {
		Crafty('2D').get().forEach(function(e) { e.destroy(); });
	}
);



//
// Simple touch interface scene
//

Crafty.defineScene("simple-touch",
	function init() {
		Crafty.background("rgb(150,200,255)");

		// var dims = getDims();

		var balloon;

		function createBalloon() {
			balloon = Crafty.e('2D, WebGL, Color, Touch, Mouse, Balloon');
			balloon
				.color('red')
				.attr({ w: 50, h: 50, x: Math.random()*dims.width, y: dims.height-50 })

			// check if balloon is offscreen
			balloon.bind("Offscreen", balloon.destroy);
			
			// create new balloon when balloon is hit
			balloon.bind("Hit", createBalloon);

			balloon.bind('MouseDown', balloon.hit );
			balloon.bind('TouchDown', balloon.hit );

		}


		createBalloon();
	},
	function uninit() {
		Crafty('2D').get().forEach(function(e) { e.destroy(); });		
	}
);

function getDims() {

	if(!ctx) {
		Crafty.webgl.init();
		ctx = Crafty.webgl.context;
	}
	return { width: ctx.drawingBufferWidth, height: ctx.drawingBufferHeight };
}


// setup crafty
Crafty.init();
Crafty.enterScene("loading");

// var gui = new dat.GUI();
// gui.add(params, 'scene', ['gravity', 'simple-touch']).onChange(function(val) {
// 	Crafty.enterScene(val);
// });


function nextScene() {
	if(sceneIndex+1 < scenes.length) {
		sceneIndex++;
	} else {
		sceneIndex = 0;
	}
	Crafty.enterScene(scenes[sceneIndex]);	
}

function previousScene() {
	if(sceneIndex-1 >= 0) {
		sceneIndex--;
	} else {
		sceneIndex = scenes.length-1;
	}
	Crafty.enterScene(scenes[sceneIndex]);	
}


var dataPromise = fetch('assets/tweets.json').then(function(r) { return r.json() });
var assetsPromise = new Promise(function(resolve, reject) {
	Crafty.load(assets, resolve, null, reject);
});

Promise.all([dataPromise, assetsPromise]).then(function(data) {

	data = data.length ? data[0] : undefined;

	console.log('loaded!', data);

	dims = getDims();
	touchEvents = new Hammer(Crafty.stage.elem);
	Crafty.enterScene(scenes[sceneIndex]);

	// touch events
	touchEvents.on('swipeleft', previousScene);
	touchEvents.on('swiperight', nextScene);

	// mouse events
	keydown('<left>').on('pressed', previousScene);
	keydown('<right>').on('pressed', nextScene);

});