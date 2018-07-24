const express = require("express");
const app = express();
const http = require("http");
const compression = require("compression");
const authRoutes = require("./routes/auth-routes.js");
const authentication = require("./authentication.js");
const apiRoutes = require("./routes/api-routes.js");
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const keys = require("./keys.js")

const winston = require("winston");
const expressWinston = require("express-winston");

const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

// Initialize folders for persistent files
if(!fs.existsSync("recipeImages"))
	fs.mkdirSync("recipeImages");
if(!fs.existsSync("logs"))
	fs.mkdirSync("logs");

// Cloudflare
app.use(session({secret: uuidv4(), store: new MongoStore({mongooseConnection: mongoose.connection})}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text({limit: "10mb"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

// Log all requests to the server
app.use(expressWinston.logger({
	transports: [
		new winston.transports.File({
			filename: "logs/requests.log"
		}),
		new winston.transports.Console({
			colorize: true
		})
	],
	meta: false,
	msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}} {{req.connection.remoteAddress}} {{req.header(\"X-Forwarded-For\")}}"
}));

winston.handleExceptions(new winston.transports.File({filename: "logs/exceptions.log"}))

app.get("/", (req, res) => {
	if(!authentication.isLoggedIn(req))
		res.sendFile("/public/login.html", {root: "./"});
	else
		res.sendFile("/react/index.html", {root: "./"});
});


// Set up routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes)


app.use(express.static("public"));
app.use(express.static("react"));
app.use("/recipeImages", express.static("recipeImages"));

http.createServer(app).listen(process.env.PORT || 3001, () => {
	console.log("Listening on port " + (process.env.PORT || 3001) + "!");
});