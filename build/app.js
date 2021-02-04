"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("./config"));

var _hpp = _interopRequireDefault(require("hpp"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _post = _interopRequireDefault(require("./routes/api/post"));

var _user = _interopRequireDefault(require("./routes/api/user"));

var _auth = _interopRequireDefault(require("./routes/api/auth"));

var _search = _interopRequireDefault(require("./routes/api/search"));

var _morgan = _interopRequireDefault(require("morgan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Routes
var app = (0, _express["default"])();
var MONGO_URI = _config["default"].MONGO_URI;
var prod = process.env.NODE_ENV === "production";
app.use((0, _hpp["default"])());
app.use((0, _helmet["default"])({
  contentSecurityPolicy: false
}));
app.use((0, _cors["default"])({
  origin: true,
  credentials: true
}));
app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].json());

_mongoose["default"].connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(function () {
  return console.log("MongoDB connecting Success!!");
})["catch"](function (e) {
  return console.log(e);
}); // Use routes


app.use("/api/post", _post["default"]);
app.use("/api/user", _user["default"]);
app.use("/api/auth", _auth["default"]);
app.use("/api/search", _search["default"]);

if (prod) {
  app.use(_express["default"]["static"](_path["default"].join(__dirname, "../client/build")));
  app.get("*", function (req, res) {
    res.sendFile(_path["default"].resolve(__dirname, "../client/build", "index.html"));
  });
}

var _default = app;
exports["default"] = _default;