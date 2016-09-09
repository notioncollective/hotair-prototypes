module.exports = function(Crafty) {
	Crafty.c('Dart', {
		init: function() {
			this.requires('2D, WebGL, Color, Motion, Collision');
			this.color('grey');
		}
	});

}