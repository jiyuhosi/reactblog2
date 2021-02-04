"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _post = _interopRequireDefault(require("../../models/post"));

var _user = _interopRequireDefault(require("../../models/user"));

var _category = _interopRequireDefault(require("../../models/category"));

var _comment = _interopRequireDefault(require("../../models/comment"));

require("@babel/polyfill");

var _auth = _interopRequireDefault(require("../../middleware/auth"));

var _moment = _interopRequireDefault(require("moment"));

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _path = _interopRequireDefault(require("path"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

_dotenv["default"].config();

var s3 = new _awsSdk["default"].S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
});
var uploadS3 = (0, _multer["default"])({
  storage: (0, _multerS["default"])({
    s3: s3,
    bucket: "hosikunreactblog/upload",
    region: "ap-northeast-1",
    key: function key(req, file, cb) {
      var ext = _path["default"].extname(file.originalname);

      var basename = _path["default"].basename(file.originalname, ext);

      cb(null, basename + new Date().valueOf() + ext);
    }
  }),
  limits: {
    fileSize: 100 * 1024 * 1024
  }
}); // @route     POST api/post/image
// @desc      Create a Post
// @access    Private

router.post("/image", uploadS3.array("upload", 5), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              console.log(req.files.map(function (v) {
                return v.location;
              }));
              res.json({
                uploaded: true,
                url: req.files.map(function (v) {
                  return v.location;
                })
              });
            } catch (e) {
              console.error(e);
              res.json({
                uploaded: false,
                url: null
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); //  @route    GET api/post
//  @desc     More Loading Posts
//  @access   public

router.get("/skip/:skip", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var postCount, postFindResult, categoryFindResult, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _post["default"].countDocuments();

          case 3:
            postCount = _context2.sent;
            _context2.next = 6;
            return _post["default"].find().skip(Number(req.params.skip)).limit(6).sort({
              date: -1
            });

          case 6:
            postFindResult = _context2.sent;
            _context2.next = 9;
            return _category["default"].find();

          case 9:
            categoryFindResult = _context2.sent;
            result = {
              postFindResult: postFindResult,
              categoryFindResult: categoryFindResult,
              postCount: postCount
            };
            res.json(result);
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.json({
              msg: "더 이상 포스트가 없습니다"
            });

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()); // @route    POST api/post
// @desc     Create a Post
// @access   Private

router.post("/", _auth["default"], uploadS3.none(), /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var _req$body, title, contents, fileUrl, creator, category, newPost, findResult, newCategory;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            console.log(req, "req");
            _req$body = req.body, title = _req$body.title, contents = _req$body.contents, fileUrl = _req$body.fileUrl, creator = _req$body.creator, category = _req$body.category;
            _context3.next = 5;
            return _post["default"].create({
              title: title,
              contents: contents,
              fileUrl: fileUrl,
              creator: req.user.id,
              date: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
            });

          case 5:
            newPost = _context3.sent;
            _context3.next = 8;
            return _category["default"].findOne({
              categoryName: category
            });

          case 8:
            findResult = _context3.sent;
            console.log(findResult, "Find Result!!!!");

            if (!(0, _util.isNullOrUndefined)(findResult)) {
              _context3.next = 22;
              break;
            }

            _context3.next = 13;
            return _category["default"].create({
              categoryName: category
            });

          case 13:
            newCategory = _context3.sent;
            _context3.next = 16;
            return _post["default"].findByIdAndUpdate(newPost._id, {
              $push: {
                category: newCategory._id
              }
            });

          case 16:
            _context3.next = 18;
            return _category["default"].findByIdAndUpdate(newCategory._id, {
              $push: {
                posts: newPost._id
              }
            });

          case 18:
            _context3.next = 20;
            return _user["default"].findByIdAndUpdate(req.user.id, {
              $push: {
                posts: newPost._id
              }
            });

          case 20:
            _context3.next = 28;
            break;

          case 22:
            _context3.next = 24;
            return _category["default"].findByIdAndUpdate(findResult._id, {
              $push: {
                posts: newPost._id
              }
            });

          case 24:
            _context3.next = 26;
            return _post["default"].findByIdAndUpdate(newPost._id, {
              category: findResult._id
            });

          case 26:
            _context3.next = 28;
            return _user["default"].findByIdAndUpdate(req.user.id, {
              $push: {
                posts: newPost._id
              }
            });

          case 28:
            return _context3.abrupt("return", res.redirect("/api/post/".concat(newPost._id)));

          case 31:
            _context3.prev = 31;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

          case 34:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 31]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}()); // @route    POST api/post/:id
// @desc     Detail Post
// @access   Public

router.get("/:id", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var post;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _post["default"].findById(req.params.id).populate("creator", "name").populate({
              path: "category",
              select: "categoryName"
            });

          case 3:
            post = _context4.sent;
            post.views += 1;
            post.save();
            console.log(post);
            res.json(post);
            _context4.next = 14;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.error(_context4.t0);
            next(_context4.t0);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}()); // [Comments Route]
// @route Get api/post/:id/comments
// @desc  Get All Comments
// @access public

router.get("/:id/comments", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var comment, result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _post["default"].findById(req.params.id).populate({
              path: "comments"
            });

          case 3:
            comment = _context5.sent;
            result = comment.comments;
            console.log(result, "comment load");
            res.json(result);
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 9]]);
  }));

  return function (_x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}());
router.post("/:id/comments", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var newComment;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log(req, "comments");
            _context6.next = 3;
            return _comment["default"].create({
              contents: req.body.contents,
              creator: req.body.userId,
              creatorName: req.body.userName,
              post: req.body.id,
              date: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
            });

          case 3:
            newComment = _context6.sent;
            console.log(newComment, "newComment");
            _context6.prev = 5;
            _context6.next = 8;
            return _post["default"].findByIdAndUpdate(req.body.id, {
              $push: {
                comments: newComment._id
              }
            });

          case 8:
            _context6.next = 10;
            return _user["default"].findByIdAndUpdate(req.body.userId, {
              $push: {
                comments: {
                  post_id: req.body.id,
                  comment_id: newComment._id
                }
              }
            });

          case 10:
            res.json(newComment);
            _context6.next = 17;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](5);
            console.log(_context6.t0);
            next(_context6.t0);

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[5, 13]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}()); // @route    Delete api/post/:id
// @desc     Delete a Post
// @access   Private

router["delete"]("/:id", _auth["default"], /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var CategoryUpdateResult;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _post["default"].deleteMany({
              _id: req.params.id
            });

          case 2:
            _context7.next = 4;
            return _comment["default"].deleteMany({
              post: req.params.id
            });

          case 4:
            _context7.next = 6;
            return _user["default"].findByIdAndUpdate(req.user.id, {
              $pull: {
                posts: req.params.id,
                comments: {
                  post_id: req.params.id
                }
              }
            });

          case 6:
            _context7.next = 8;
            return _category["default"].findOneAndUpdate({
              posts: req.params.id
            }, {
              $pull: {
                posts: req.params.id
              }
            }, {
              "new": true
            });

          case 8:
            CategoryUpdateResult = _context7.sent;

            if (!(CategoryUpdateResult.posts.length === 0)) {
              _context7.next = 12;
              break;
            }

            _context7.next = 12;
            return _category["default"].deleteMany({
              _id: CategoryUpdateResult
            });

          case 12:
            return _context7.abrupt("return", res.json({
              success: true
            }));

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x17, _x18) {
    return _ref7.apply(this, arguments);
  };
}()); // @route    GET api/post/:id/edit
// @desc     Edit Post
// @access   Private

router.get("/:id/edit", _auth["default"], /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    var post;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _post["default"].findById(req.params.id).populate("creator", "name");

          case 3:
            post = _context8.sent;
            res.json(post);
            _context8.next = 10;
            break;

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8["catch"](0);
            console.error(_context8.t0);

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 7]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref8.apply(this, arguments);
  };
}());
router.post("/:id/edit", _auth["default"], /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
    var _req$body2, title, contents, fileUrl, id, modified_post;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log(req, "api/post/:id/edit");
            _req$body2 = req.body, title = _req$body2.title, contents = _req$body2.contents, fileUrl = _req$body2.fileUrl, id = _req$body2.id;
            _context9.prev = 2;
            _context9.next = 5;
            return _post["default"].findByIdAndUpdate(id, {
              title: title,
              contents: contents,
              fileUrl: fileUrl,
              date: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss")
            }, {
              "new": true
            });

          case 5:
            modified_post = _context9.sent;
            console.log(modified_post, "edit modified");
            res.redirect("/api/post/".concat(modified_post.id));
            _context9.next = 14;
            break;

          case 10:
            _context9.prev = 10;
            _context9.t0 = _context9["catch"](2);
            console.log(_context9.t0);
            next(_context9.t0);

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[2, 10]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/category/:categoryName", /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
    var result;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return _category["default"].findOne({
              categoryName: {
                $regex: req.params.categoryName,
                $options: "i"
              }
            }, "posts").populate({
              path: "posts"
            });

          case 3:
            result = _context10.sent;
            console.log(result, "Category Find result");
            res.send(result);
            _context10.next = 12;
            break;

          case 8:
            _context10.prev = 8;
            _context10.t0 = _context10["catch"](0);
            console.log(_context10.t0);
            next(_context10.t0);

          case 12:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 8]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref10.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;