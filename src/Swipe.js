//
// Balloon component
//
module.exports = function(Crafty) {
  Crafty.c("Swipe", {
      init: function() {

        var self = this;

        var Hammer = require('hammerjs');

        this.touchEvents = new Hammer(Crafty.stage.elem, {
          recognizers: [
            [Hammer.Tap],
            [Hammer.Swipe,{ direction: Hammer.DIRECTION_ALL }],
          ]
        });

        // Translate hammer events to Crafty events
        this.touchEvents.on('swipeup', function(e) {
          self.trigger('SwipeUp', e);
        });

        this.touchEvents.on('swipedown', function(e) {
          self.trigger('SwipeDown', e);
        });

        this.touchEvents.on('swipeleft', function(e) {
          self.trigger('SwipeLeft', e);
        });

        this.touchEvents.on('swiperight', function(e) {
          self.trigger('SwipeRight', e);
        });

        this.touchEvents.on('tap', function(e) {
          self.trigger('Tap', e);
        });

        this.bind('SwipeUp', this._onSwipeUp);
        this.bind('SwipeDown', this._onSwipeDown);
        this.bind('SwipeLeft', this._onSwipeLeft);
        this.bind('SwipeRight', this._onSwipeRight);
        this.bind('Tap', this._onTap);

        // set dist threshold
        this.minSwipeDistance = null;
        this.minTapDistance = null;
      },

      _tapDistFromCenter(e) {
        return Crafty.math.distance(e.center.x, e.center.y, this.x + this.w/2, this.y + this.h/2);
      },

      _swipeDistFromCenter(e) {
        return Crafty.math.distance(e.center.x - e.deltaX/2, e.center.y - e.deltaY/2, this.x + this.w/2, this.y + this.h/2);
      },

      _checkMinDist(e, isTap) {
        var dist = isTap ? this._tapDistFromCenter(e) : this._swipeDistFromCenter(e);
        var minDistance = isTap ? this.minTapDistance : this.minSwipeDistance;
        return !minDistance || this._swipeDistFromCenter(e) < minDistance;
      },

      _onSwipeUp: function(e) {
        console.log('_onSwipeUp', e);
        if (this._checkMinDist(e) && this.onSwipeUp) {
          this.onSwipeUp(e);
        }
      },

      _onSwipeDown: function(e) {
        console.log('_onSwipeDown', e);
        if (this._checkMinDist(e) && this.onSwipeDown) {
          this.onSwipeDown(e);
        }
      },

      _onSwipeLeft: function(e) {
        console.log('_onSwipeLeft', e);
        if (this._checkMinDist(e) && this.onSwipeLeft) {
          this.onSwipeLeft(e);
        }
      },

      _onSwipeRight: function(e) {
        console.log('_onSwipeRight', e);
        if (this._checkMinDist(e) && this.onSwipeRight) {
          this.onSwipeRight(e);
        }
      },

      _onTap: function(e) {
        console.log('_onTap', e);
        if (this._checkMinDist(e, true) && this.onTap) {
          this.onTap(e);
        }
      }
    });
}