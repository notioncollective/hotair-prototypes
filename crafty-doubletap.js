module.exports = function(Crafty) {
	Crafty.c("DoubleTap", {
		required: 'Touch',

		_thresh: 300,
		_timeout: null,

		init: function() {
			if(!this.thresh) {
				this.thresh = this._thresh;
			}
			this.bind("TouchStart", this._tap);
		},

		doubleTapThreshold: function(millis) {
			this.thresh = millis;
		},

		_tap: function() {
			var args = Array.prototype.slice.call(arguments);

			if(this._timeout) {

				// clone args and set event type
				args.unshift("DoubleTap");

				// trigger event
				this.trigger.apply(this, args);

				// clear the timeout
				window.clearTimeout(this._timeout);
			} else {

				// set timeout
				this._timeout = window.setTimeout(function(){
					this._timeout = null;
				}.bind(this), this._thresh);
			}
		}
	});	
}
