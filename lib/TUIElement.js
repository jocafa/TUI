require('lodash');
var Super = require('events').EventEmitter;

function TUIElement(options) {
  Super.call(this);
}

TUIElement.prototype = Object.create(EventEmitter.prototype);
TUIElement.prototype.constructor = TUIElement;

_.extend(TUIElement.prototype, {
  id: undefined,
  elementName: undefined,
  classList: undefined,
  attributes: undefined,

  parentElement: undefined,
  childElements: undefined,
  nextSibling: undefined,
  previousSibling: undefined,

  appendChild: function (child) {
  },
  insertBefore: function (otherElement) {
  },
  removeChild: function (child) {
  },
  replaceChild: function (newChild, oldChild) {
  }
});
