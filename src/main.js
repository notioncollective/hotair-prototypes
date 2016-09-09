// polyfills
require('es6-promise').polyfill();
require('whatwg-fetch');

// deps
var keydown = require('keydown');
var Hammer = require('hammerjs');
var browserSize = require('browser-size')();

module.exports = function(Crafty) {

	// components
	require('./doubletap')(Crafty);
	require('./balloon')(Crafty);
	require('./tweet-text')(Crafty);

	// vars 
	var assets = {
		"images" : "assets/notion_logo.png"
	};
	var params = {
		scene: 'simple-touch'
	}
	var scenes = [
		'simple-touch'//,
		// 'gravity'
	];
	var sceneIndex = 0;
	var dims;
	var ctx;
	var gameWidth;
	var touchEvents;
	var tweets;
	var dataPromise;
	var assetsPromise;


	//
	// SCENES
	// 
	
	//
	// loading scene
	// 
	Crafty.defineScene("loading", function() {
		Crafty.background("#000");
	  Crafty.e("2D, Canvas, Text")
		  .attr({ w: 100, h: 20, x: 150, y: 120 })
		  .text("Loading")
		  .textColor("#FFFFFF");
	});

	// Intro gravity scene
	// Crafty.defineScene("gravity",
	// 	function init() {
	// 	Crafty.background("rgb(150,200,255)");


	// 	// logo
	// 	var logo = Crafty.e('2D, WebGL, Image, Draggable, Gravity')
	// 		.image('assets/notion_logo.png')
	// 		.gravity('2D');
	// 	  // .attr({x: dims.width/2-size/2, y: dims.height/2-size/2, w: size, h: size})

	// 	// bottom platform
	// 	var platform = Crafty.e('2D, WebGL, Color')
	// 									.color(0, 255, 100, 1)
	// 									.attr({x: 0, y: dims.height-5, w: dims.width, h: 10});	
	// 	},
	// 	function uninit() {
	// 		Crafty('2D').get().forEach(function(e) { e.destroy(); });
	// 	}
	// );

	// Simple touch interface scene
	Crafty.defineScene("simple-touch",
		function init() {
			Crafty.background("rgb(150,200,255)");
			
			var balloon;
			var tweetText;

			function createBalloon() {

				tweetText = Crafty.e('2D, DOM, Text')
						.attr({x: 20, y: 20, w: 200})
			
				balloon = Crafty.e('Balloon');
				balloon
					.color('red')
					.attr({ w: 50, h: 50, x: Math.random()*dims.width, y: dims.height-50 })

				tweetText.text(getNextTweet().value.text);

				balloon.attachText(tweetText);

				// check if balloon is offscreen
				balloon.bind("Offscreen", function() {
					balloon.destroy();
					createBalloon();
				});
				
				// create new balloon when balloon is hit
				balloon.bind("Hit", createBalloon);

				balloon.bind('DoubleClick', balloon.hit );
				balloon.bind('DoubleTap', balloon.hit );

				balloon.bind('MouseDown', balloon.showTweet);
				balloon.bind('TouchDown', balloon.showTweet);

			}


			createBalloon();
		},
		function uninit() {
			Crafty('2D').get().forEach(function(e) { e.destroy(); });		
		}
	);

	//
	// HELPER FUNCTIONS
	// 

	function getDims() {
		if(!ctx) {
			Crafty.webgl.init();
			ctx = Crafty.webgl.context;
		}
		return { width: ctx.drawingBufferWidth, height: ctx.drawingBufferHeight };
	}

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

	function getNextTweet() {
		return tweets[Math.floor(Math.random()*tweets.length)];
	}


	//
	// LOADING & INITIALIZATION
	//

	// setup crafty
	

	// limit width of game
	if(browserSize.width > browserSize.height) {
		gameWidth = browserSize.height*(.9);
	}

	Crafty.init(gameWidth);
	Crafty.multitouch(true);
	Crafty.enterScene("loading");

	// loading promises
	dataPromise = fetch('assets/tweets.json').then(function(r) { return r.json() });
	assetsPromise = new Promise(function(resolve, reject) {
		Crafty.load(assets, resolve, null, reject);
	});

	// loading
	Promise.all([dataPromise, assetsPromise]).then(function(data) {

		dims = getDims();

		data = data.length ? data[0] : undefined;
		tweets = data.rows;

		touchEvents = new Hammer(Crafty.stage.elem);
		Crafty.enterScene(scenes[sceneIndex]);

		// touch events
		touchEvents.on('swipeleft', previousScene);
		touchEvents.on('swiperight', nextScene);

		// mouse events
		keydown('<left>').on('pressed', previousScene);
		keydown('<right>').on('pressed', nextScene);

	});
};