//
// Balloon component
//
module.exports = function(Crafty) {
	Crafty.c('Balloon', {
		init: function() {
			// set requirements
			this.requires('2D, WebGL, Touch, Mouse, Color, Touch, Collision, Motion, Swipe')
				.color('grey')

			this.selected = false;
			this.marked = false;
			this.isHit = false;

			// Swipe setup
			this.minTapDistance = 100;

			// trigger the Offscreen event if balloon goes offscreen
			this.bind('Moved', this.onMove);

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
		setData: function(d) {
			this.data = d;
			return this;
		},
		getParty: function() {
			return this.data.value.party;
		},
		pop: function() {
			if (this.marked) {
				this.showPartyColor();
				this.isHit = true;
				this.trigger('Hit', this);
				this.vy = 0;
				this.ay = 1000;
			}
			return this;
		},
		tap: function() {
			this.select();
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
			if(this.text) {
				this.text.destroy();
				// this.unbind('SwipeUp');
				// this.unbind('SwipeDown');
			}
		},
		showPartyColor: function() {
			var party = this.getParty();
			if (party === 'd') {
				this.color('blue');
			} else {
				this.color('red');
			}
		},
		onMove: function(e) {
			// top of screen
			if (this.y <= -this.h) {
				this.onLeaveScreenTop();

			// bottom of screen
			} else if (this.ht && (this.y >= Crafty.viewport._height)) {
				this.onLeaveScreenBottom();
			}

			// text follows balloon
			if (this.text) {
				this.text.y = this.y;
			}
		},
		onLeaveScreenTop: function() {
			this.trigger('LeaveScreenTop', this);
			this.destroy();
		},
		onLeaveScreenBottom: function() {
			this.destroy();
		},
		onSwipeUp: function(e) {
			if (this.selected) {
				this.vy = -1000;
				this.ay = -1000;
				this.showPartyColor();
				this.selected = false;
			}
		},
		onSwipeDown: function(e) {
			console.log('onSwipeDown');
			if (this.selected) {
				this.marked = true;
				this.trigger('Fire', this);
				this.selected = false;
			}
		},
		onTap: function(e) {
			this.tap();
		}
	})
};