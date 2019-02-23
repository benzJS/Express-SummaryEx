module.exports = function(req, res, next) => {
	if(!req.signedCookies.adminId) {
		return res.redirect('/');
	}
	next();
}