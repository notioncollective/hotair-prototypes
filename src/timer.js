module.exports = function(Crafty) {
	Crafty.c('Timer', {
		init: function() {
			this.requires('2D, DOM, Text, Color');
      this.duration = 60;
      this.secondsRemaining = this.duration;
      this.timerStarted = false;

			this.attr({
        x: (Crafty.viewport._width - 360),
        y: Crafty.viewport._height - 100,
        w: 300,
        h: 200
      })
        .textFont({size: '50px', weight: 'bold'})
        .css({ color: 'black', 'text-align': 'right'});


		},

    setDuration: function(duration) {
      this.duration = duration;
      return this;
    },

    restartTimer: function() {
      this.timerStarted = false;
      this.startTimer();
      return this;
    },

    startTimer: function() {
      console.log('startTimer');
      if (!this.timerStarted) {
        this.secondsRemaining = this.duration;
        this.timerStarted = true;
      }
      this.text(this.secondsRemaining);
      this.timer = setInterval(this._decrementTimer.bind(this), 1000);
      Crafty.trigger('TimerStart');
      return this;
    },

    pauseTimer: function() {
      clearInterval(this.timer);
      Crafty.trigger('TimerPause');
      return this;
    },

    _decrementTimer() {
      console.log('_decrementTimer');
      this.secondsRemaining -= 1;
      this.text(this.secondsRemaining);
      if (this.secondsRemaining === 0) {
        clearInterval(this.timer);
        Crafty.trigger('TimerDone');
      }
    }
	});

}