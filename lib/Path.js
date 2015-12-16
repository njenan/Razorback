(function () {

    var Path = function (_seperator, _steps, nextStep) {
        this.steps = _steps ? _steps.slice() : [];

        if (nextStep) {
            this.steps.push(nextStep);
        }

        this.seperator = _seperator;

    };

    Path.prototype.append = function (step) {
        return new Path(this.seperator, this.steps, step);
    };

    Path.prototype.matchesJPath = function (jpath) {
        var self = this;
        var split = jpath.split('.').reduce(function (a, b) {
            return a + self.seperator + b;
        });
        return split === this.toFlatPath();
    };

    Path.prototype.toFlatPath = function () {
        var self = this;
        var flatPath;
        if (this.steps.length === 0) {
            flatPath = '';
        } else if (this.steps.length === 1) {
            flatPath = this.steps[0];
        } else {
            flatPath = this.steps.reduce(function (a, b) {
                return a + self.seperator + b;
            });
        }
        return flatPath;
    };

    module.exports = Path;
})();