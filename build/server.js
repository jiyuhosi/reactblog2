"use strict";

var _app = _interopRequireDefault(require("./app"));

var _index = _interopRequireDefault(require("./config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = _index["default"].PORT;

_app["default"].listen(PORT, function () {
  console.log("Server started on Port ".concat(PORT));
});