"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PostSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  contents: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    "default": -2
  },
  fileUrl: {
    type: String,
    "default": "https://source.unsplash.com/random/301x201"
  },
  date: {
    type: String,
    "default": (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
  },
  category: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "category"
  },
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "comment"
  }],
  creator: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "user"
  }
});

var Post = _mongoose["default"].model("post", PostSchema);

var _default = Post;
exports["default"] = _default;