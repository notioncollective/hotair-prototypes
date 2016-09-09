module.exports = function(Crafty) {
	Crafty.c('Player', {
		init: function() {
			this.requires('2D, WebGL, Color');
			this.color('yellow');
		}
	});

}