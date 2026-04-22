function isLoggedIn(req, res, next){
    if(req.user){
        return next();
    }
    res.redirect("/vendor/login");
}

module.exports = isLoggedIn;