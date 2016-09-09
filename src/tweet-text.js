module.exports = function(Crafty) {
	Crafty.c("TweetText", {
		init: function() {
			this.requires('2D, DOM, Text');
		},
		hide: function() {
			this.visible = false;
		},
		show: function() {
			this.visible = true;
		}
	});
}