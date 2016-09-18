// polyfills
require('es6-promise').polyfill();
require('whatwg-fetch');

// deps
var keydown = require('keydown');
var Hammer = require('hammerjs');
var browserSize = require('browser-size')();
var dat = require('exdat');
var quadratic = require('solve-quadratic-equation');


function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

module.exports = function(Crafty) {

	// components
	require('./doubletap')(Crafty);
	require('./balloon')(Crafty);
	require('./tweet-text')(Crafty);
	require('./player')(Crafty);
	require('./dart')(Crafty);
	require('./Swipe')(Crafty);

	// vars
	var assets = {
		"images" : "assets/notion_logo.png"
	};
	var params = {
		scene: 'simple-touch',
		balloonYV: -100,
		dartYA: 500,
		dartYV: 200,
		dartMaxXV: 500
	}
	var scenes = [
		'player-dart' //,
		// 'simple-touch'//,
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
	var score = {
		d: 0,
		r: 0
	}

	var gui;

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
	// Crafty.defineScene("simple-touch",
	// 	function init() {
	// 		Crafty.background("rgb(150,200,255)");


	// 		console.log('Scene: simple-touch');

	// 		// var balloon;
	// 		// var tweetText;

	// 		function createBalloon() {

	// 			var tweetText = Crafty.e('TweetText')
	// 					.attr({x: 30, y: 30, w: 400})

	// 			tweetText.hide();

	// 			var balloon = Crafty.e('Balloon');
	// 			balloon
	// 				.attr({ w: 150, h: 150, x: Math.random()*dims.width, y: dims.height-50 })

	// 			balloon.vy = params.balloonYV;


	// 			tweetText.text(getNextTweet().value.text);

	// 			balloon.attachText(tweetText);

	// 			// create new balloon when balloon is hit
	// 			// balloon.bind("Hit", createBalloon);

	// 			// balloon.bind('DoubleClick', balloon.hit );
	// 			// balloon.bind('DoubleTap', balloon.hit );



	// 			// balloon.bind('TouchEnd', balloon.tap);

	// 			balloon.bind('Fire', balloon.pop);

	// 		}

	// 		this.intervalId = window.setInterval(createBalloon.bind(this), 3000);
	// 	},
	// 	function uninit() {
	// 		window.clearInterval(this.intervalId);
	// 		Crafty('2D').get().forEach(function(e) { e.destroy(); });
	// 	}
	// );


	// Simple touch interface scene
	Crafty.defineScene("player-dart",
		function init() {
			Crafty.background("rgb(150,200,255)");

			console.log('Scene: player-dart');

			var player = Crafty.e('Player')
											.attr({ w: 50, h: 50, y: 10});


			player._x = (dims.width/2) - player.w/2;

			// var balloon;
			// var tweetText;

			var dScore = Crafty.e('2D, DOM, Text, Color')
				.attr({x: 20, y: 15, w: 300, h: 200})
				.textFont({size: '50px', weight: 'bold'})
				.css({ color: 'blue', 'text-align': 'left'})
				.text(score['d']);


			var rScore = Crafty.e('2D, DOM, Text, Color')
				.attr({x: Crafty.viewport._width - 320, y: 15, w: 300, h: 200})
				.textFont({size: '50px', weight: 'bold'})
				.css({ color: 'red', 'text-align': 'right'})
				.text(score['r']);


			function updateScore() {
				dScore.text(score['d']);
				rScore.text(score['r']);
			}

			function shootDart(balloon) {

				var dart = Crafty.e('Dart')
										.attr({x: player.x + (player.w/2), y: (player.y + player.h), w: 10, h:10})

				var bx = balloon.x + balloon.w/2;
				var by = balloon.y + balloon.h/2;
				var dx = dart.x + dart.w/2;
				var dy = dart.y + dart.h/2;

				dart.ay = params.dartYA;
				dart.vy = params.dartYV;

				var roots = quadratic(
					(.5*dart.ay), // a
					(dart.vy-balloon.vy), // b
					(dy - by) // c
				);

				var t = Math.max(roots[0], roots[1]);
				var vx = (bx-dx)/t;

				dart.vx =  vx; // (sign(vx)) * Math.min(Math.abs(vx), params.dartMaxXV);

			}

			function createBalloon() {

				var tweet = getNextTweet();
				var balloonSize = 150;
				var bx = (Math.random()*(dims.width-balloonSize))+balloonSize/2;

				var tweetText = Crafty.e('TweetText')
						.attr({x: 30, y: 30, w: 500})
						.setTweetText(tweet.value.text)
						.hide();

				var balloon = Crafty.e('Balloon')
						.attr({ w: balloonSize, h: balloonSize, x: bx, y: dims.height-50 })
						.checkHits('Dart')
						.setData(tweet);

				balloon.vy = params.balloonYV;

				balloon.attachText(tweetText);

				// check if balloon is offscreen
				// balloon.bind("Offscreen", function() {
				// 	balloon.destroy();
				// 	// createBalloon();
				// });

				// create new balloon when balloon is hit
				// balloon.bind("Hit", createBalloon);

				// balloon.bind('DoubleClick', balloon.hit );
				// balloon.bind('DoubleTap', balloon.hit );

				// balloon.bind('MouseDown', balloon.tap);
				// balloon.bind('TouchEnd', balloon.tap);

				balloon.bind('Fire', shootDart);

				balloon.bind('LeaveScreenTop', function(b) {
					score[b.getParty()]++;
					updateScore();
				});

				balloon.bind('HitOn', function(data) {
					var dart = data[0].obj;

					if (balloon.marked) {
						dart.destroy();
						balloon.pop();
					}
				});

				balloon.bind('SelectOn', function() {
					Crafty('Balloon').get().forEach(function(e) {
						if(e.getId() !== balloon.getId()) {
							e.unSelect();
						}
					});
				});
			}

			this.intervalId = window.setInterval(createBalloon.bind(this), 3000);
		},
		function uninit() {
			window.clearInterval(this.intervalId);
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

	function nextScene(e) {
		console.log('hammer event', e);

		if(sceneIndex+1 < scenes.length) {
			sceneIndex++;
		} else {
			sceneIndex = 0;
		}

		console.log('nextScene', scenes[sceneIndex])


		Crafty.enterScene(scenes[sceneIndex]);
	}

	function previousScene() {
		console.log('hammer event', e);
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
	// if(browserSize.width > browserSize.height) {
	// 	gameWidth = browserSize.height*(.9);
	// }

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


		gui = new dat.GUI();

		gui.add(params, 'balloonYV', -1000, 0);
		gui.add(params, 'dartYA', 0, 1000);
		gui.add(params, 'dartYV', 0, 1000);
		gui.add(params, 'dartMaxXV', 0, 1000);

		dat.GUI.toggleHide();

		dims = getDims();

		Crafty.bind('KeyDown', function(e) {
			if(e.key === Crafty.keys.G) {
				dat.GUI.toggleHide();
			}
		});

		data = data.length ? data[0] : undefined;
		tweets = data.rows;

		// touchEvents = new Hammer(Crafty.stage.elem);
		// touchEvents = new Hammer(Crafty.stage.elem, {
		// 	recognizers: [
		// 		// RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
		// 		// [Hammer.Rotate],
		// 		[Hammer.Tap],
		// 		[Hammer.Swipe,{ direction: Hammer.DIRECTION_ALL }],
		// 	]
		// });
		// touchEvents.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

		console.log(scenes, sceneIndex);

		Crafty.enterScene(scenes[sceneIndex]);

		// touch events
		// touchEvents.on('swipeleft', previousScene);
		// touchEvents.on('swiperight', nextScene);

		// touchEvents.on('swipeup', function(e) {
		// 	Crafty.trigger('SwipeUp', e);
		// });

		// touchEvents.on('swipedown', function(e) {
		// 	Crafty.trigger('SwipeDown', e);
		// });

		// touchEvents.on('tap', function(e) {
		// 	Crafty.trigger('Tap', e);
		// });



		// mouse events
		keydown('<left>').on('pressed', previousScene);
		keydown('<right>').on('pressed', nextScene);

	});
};