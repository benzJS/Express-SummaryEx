module.exports = function(req, res, next) {
    if(req.signedCookie.userId) {
        next();
    }
}