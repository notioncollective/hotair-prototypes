//
// Balloon component
//
module.exports = function(Crafty) {
	Crafty.c('Balloon', {
		init: function() {
			// set requirements
			this.requires('2D, WebGL, Touch, Mouse, Color, Touch, Collision, Motion');

			this.selected = false;
			this.marked = false;

			// trigger the Offscreen event if balloon goes offscreen
			this.bind('Moved', this.onMove);

			this.bind('SwipeUp', this.onSwipeUp);
			this.bind('SwipeDown', this.onSwipeDown);
			this.bind('Tap', this.onTap);

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
		pop: function() {
			if (this.marked) {
				this.trigger('Hit', this);
				this.destroy();
			}
		},
		tap: function() {
			if(!this.selected) {
				this.select();
			} else {
				this.marked = true;
				this.trigger('Fire', this);
			}
		},
		select: function() {
			this.selected = true;
			if(this.text) {
				this.text.show();
			}
			this.trigger('SelectOn', this);
		},
		unSelect: function() {
			this.selected = false;
			if(this.text) {
				this.text.hide();
			}
			this.trigger('SelectOff', this);
		},
		_afterDestoy: function(e) {
			console.log('_afterDestoy');
			if(this.text) {
				this.text.destroy();
				// this.unbind('SwipeUp');
				// this.unbind('SwipeDown');
			}
		},
		onMove: function(e) {
			if(this.y <= -this.h) {
				console.log('Destroy me!');
				this.destroy();
			} else if(this.text) {
				this.text.y = this.y;
			}
		},
		onSwipeUp: function(e) {
			console.log('onSwipeUp');
			if (Crafty.math.distance(e.center.x - e.deltaX/2, e.center.y - e.deltaY/2, this.x + this.w/2, this.y + this.h/2) < 300) {
				if (this.selected) {
					// this.trigger('Fire', this);
					this.vy = -1000;
					this.ay = -1000;
				}
			}
		},
		onSwipeDown: function(e) {
			console.log('onSwipeDown');
			if (Crafty.math.distance(e.center.x - e.deltaX/2, e.center.y - e.deltaY/2, this.x + this.w/2, this.y + this.h/2) < 300) {
				this.tap();
			}
		},
		onTap: function(e) {
			var dist = Crafty.math.distance(e.center.x, e.center.y, this.x + this.w/2, this.y + this.h/2);
			console.log('onTap', e.center, dist, this.w/2);

			if (dist < this.w/2) {
				this.tap();
			}
		}
	})
};