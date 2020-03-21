"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// npx babel --config-file=./.babelrc  plugin-system/babel/class.js --out-file plugin-system/babel/class-compiled.js
var Item = /*#__PURE__*/function () {
  function Item() {
    (0, _classCallCheck2["default"])(this, Item);
  }

  (0, _createClass2["default"])(Item, [{
    key: "getId",
    value: function getId() {
      return "id." + String(Math.random()).replace(/\./, '#');
    }
  }]);
  return Item;
}();

var item = new Item();
console.log(item.getId());
