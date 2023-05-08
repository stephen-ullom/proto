"use strict";
exports.__esModule = true;
exports.HtmlElement = void 0;
var HtmlElement = /** @class */ (function () {
    function HtmlElement(name) {
        this.styles = {};
        this.children = [];
        this.attributes = {};
        this.name = name;
    }
    HtmlElement.prototype.setStyle = function (name, value) {
        if (Number.isInteger(value)) {
            this.styles[name] = value + "px";
        }
        else {
            this.styles[name] = value;
        }
    };
    HtmlElement.prototype.setAttribute = function (name, value) {
        this.attributes[name] = value;
    };
    HtmlElement.prototype.render = function () {
        var styleString = "";
        for (var _i = 0, _a = Object.entries(this.styles); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            styleString += key + ": " + value + ";";
        }
        if (styleString) {
            this.attributes["style"] = styleString;
        }
        var attributes = "";
        for (var _c = 0, _d = Object.entries(this.attributes); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            attributes += " " + key + "=\"" + value + "\"";
        }
        var content = this.children.join("");
        return "<" + this.name + attributes + ">" + content + "</" + this.name + ">";
    };
    return HtmlElement;
}());
exports.HtmlElement = HtmlElement;
//# sourceMappingURL=xml-element.js.map