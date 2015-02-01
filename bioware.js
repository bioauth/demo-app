var request = require('request');

function Bioware (config) {
    this.config = config;
}

Bioware.prototype.url = function (str) {
    return this.config.bioauthUrl + str;
};

Bioware.prototype.attempt = function (email, callback) {
    var redirect = this.config.redirect;

    request.post(this.url('external/attempt'), { form: {
        email: email,
        id: this.config.client
    }}, (function (err, response) {
        if (err) {
            callback(err);
        } else {
            var body = JSON.parse(response.body);
            callback(err, this.url(
                'external/land?token=' + body.token +
                '&redirectUri=' + redirect
            ));
        }
    }).bind(this));
};

Bioware.prototype.ensure = function (req, res, next) {
    request.get(this.url('external/' + req.query.token), (function (err, response) {
        if (err) {
            callback(err);
        } else {
            var body = JSON.parse(response.body);
            if (body.status !== 'accepted') {
                res.status(403).json('Access denied');
            } else {
                next();
            }
        }
    }).bind(this));
};

module.exports = function (config) {
    return new Bioware(config);
};
