//
// Balloon component
//
module.exports = function(Crafty) {
	Crafty.c('Balloon', {
		init: function() {
			// set requirements
			this.requires('2D, WebGL, Touch, Mouse, Color, DoubleTap');

			// trigger the Offscreen event if balloon goes offscreen
			this.bind('Move', function(e) {
				if(e._y <= 0) {
					this.trigger('Offscreen');
				}
			});

			// move on every frame
			this.bind('EnterFrame', this._move);
			this.bind('Remove', this._destroy);
		},
		attachText: function(text) {
			this.text = text;
			this.text.x = this.x + this.w + 10;
			this.text.y = this.y;
		},
		hit: function() {
			this.trigger('Hit');

			if(this.text) {
				console.log('destroy text!', this);
				this.text.destroy();
			}

			this.destroy();
		},
		_destroy: function(e) {
			console.log('destroy', e, this)

			if(this.text) {
				this.text.destroy();
			}
		},
		_move: function(e) {
			this.y = this.y-1;
			if(this.text) {
				this.text.y = this.y;
			}
		},
	})
};