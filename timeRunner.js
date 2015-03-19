function TimeRunner(maxRun, delay) {
    if (!(this instanceof TimeRunner)) {
        return new TimeRunner(maxRun, delay);
    }

    this.maxRun = maxRun;
    this.delay = delay;
    this.count = 0;
    this.queue = [];
    this.waiting = false;

    var self = this;
}

TimeRunner.prototype.run = function (runnable) {
    this.queue.push(runnable);
    this._run();
}

TimeRunner.prototype._run = function () {
    if (this.queue.length === 0 || this.waiting) return;
    var self = this;
    if (this.count === this.maxRun) {
        console.log('Pause for ', this.delay / 1000, 'seconds @', new Date());
        this.waiting = true;
        setTimeout(function () {
            console.log('resume work');
            self.waiting = false;
            self._run();
        }, this.delay);
        this.count = 0;
    } else {
        this.count++;
        var runnable = this.queue.shift();
        runnable();
        this._run();
    }
}

module.exports = TimeRunner;