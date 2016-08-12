module.exports = function(Crafty) {
	Crafty.c("TweetText", {
		init: function() {
			this.requires('2D, DOM, Text');
		}
	});
}