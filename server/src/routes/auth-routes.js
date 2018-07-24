const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
	res.render();
});

// Log in with google
router.get("/google", passport.authenticate("google", {
	scope: ["profile"]
}));

// Log out
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

// Google OAuth callback
router.get("/google/redirect", passport.authenticate("google"),  (req, res) => {
	res.redirect("../../");
});

module.exports = router;