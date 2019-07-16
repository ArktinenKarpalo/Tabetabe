const passport = require("passport");
const keys = require("./keys.js");
const GoogleStrategy = require("passport-google-oauth20");
const database = require("./database.js");

passport.use(
	new GoogleStrategy( {
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: keys.google.callbackURL
	}, (accessToken, refreshToken, profile, done) => {
		console.log("User logged in!");
		database.findUserByGoogleID(profile.id).then((user) => {
			if(!user) {
				database.registerUserGoogleID(profile.displayName, profile.id).then((user) => done(null, user));
			} else {
				// User already exists in the database
				done(null, user);
			}
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	database.findUserByID(id).then((user) => done(null, user));
});

module.exports.isLoggedIn = ((req) => {
	if(req.hasOwnProperty("user"))
		return true;
	else
		return false;
});