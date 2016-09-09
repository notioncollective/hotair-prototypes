//
// Balloon component
//
module.exports = function(Crafty) {
	Crafty.c('Balloon', {
		init: function() {
			// set requirements
			this.requires('2D, WebGL, Touch, Mouse, Color, Touch');

			this.selected = false;

			// trigger the Offscreen event if balloon goes offscreen
			this.bind('Move', function(e) {
				if(e._y <= 0) {
					this.trigger('Offscreen');
				}
			});

			// move on every frame
			this.bind('EnterFrame', this._move);
			this.bind('Remove', this._afterDestoy);
		},
		attachText: function(text) {
			this.text = text;

			var margin = 20;

			if((this.x + (this.w / 2)) > (Crafty.viewport._width / 2)) {
				this.text.css({ 'text-align' : 'right'});
				this.text.x = this.x - this.text.w - margin;
			} else {
				this.text.x = this.x + this.w + margin;
			}
			this.text.y = this.y;
		},
		hit: function() {
			this.trigger('Hit');

			this.destroy();
		},
		tap: function() {
			console.log('tap!');
			if(!this.selected) {
				this.select();
			} else {
				this.hit();
			}
		},
		select: function() {
			this.selected = true;
			if(this.text) {
				this.text.show();
			}
		},
		unSelect: function() {
			this.selected = false;
			if(this.text) {
				this.text.hide();
			}
		},
		_afterDestoy: function(e) {

			if(this.text) {
				this.text.destroy();
			}
		},
		_move: function(e) {
			this.y = this.y-3;
			if(this.text) {
				this.text.y = this.y;
			}
		},
	})
};