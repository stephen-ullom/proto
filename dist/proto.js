"use strict";
exports.__esModule = true;
exports.render = exports.include = exports.image = exports.repeat = exports.text = exports.frame = void 0;
var fs_1 = require("fs");
var xml_element_1 = require("./xml-element");
function frame() {
    var parameters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parameters[_i] = arguments[_i];
    }
    var element = new xml_element_1.HtmlElement("div");
    var firstChild = parameters[0];
    element.setStyle("display", "flex");
    if (typeof firstChild === "object") {
        var properties = parameters.shift();
        for (var _a = 0, _b = Object.entries(properties); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], value = _c[1];
            element.setStyle(key, value);
        }
    }
    for (var _d = 0, _e = Object.values(parameters); _d < _e.length; _d++) {
        var value = _e[_d];
        var html = value;
        element.children.push(html);
    }
    return element.render();
}
exports.frame = frame;
function text() {
    var parameters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parameters[_i] = arguments[_i];
    }
    var element = new xml_element_1.HtmlElement("p");
    var firstChild = parameters[0];
    if (typeof firstChild === "object") {
        var properties = parameters.shift();
        for (var _a = 0, _b = Object.entries(properties); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], value = _c[1];
            element.setStyle(key, value);
        }
    }
    for (var _d = 0, _e = Object.values(parameters); _d < _e.length; _d++) {
        var value = _e[_d];
        var html = value;
        element.children.push(html);
    }
    return element.render();
}
exports.text = text;
function repeat(array, callback) {
    return array.map(callback).join("");
}
exports.repeat = repeat;
function image() {
    var parameters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parameters[_i] = arguments[_i];
    }
    var element = new xml_element_1.HtmlElement("img");
    var firstChild = parameters[0];
    if (typeof firstChild === "object") {
        var properties = parameters.shift();
        for (var _a = 0, _b = Object.entries(properties); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], value = _c[1];
            element.setStyle(key, value);
        }
    }
    for (var _d = 0, _e = Object.values(parameters); _d < _e.length; _d++) {
        var value = _e[_d];
        var source = value;
        element.setAttribute("src", source);
    }
    return element.render();
}
exports.image = image;
function include() {
    var parameters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parameters[_i] = arguments[_i];
    }
    var element = new xml_element_1.HtmlElement("div");
    var firstChild = parameters[0];
    if (typeof firstChild === "object") {
        var properties = parameters.shift();
        for (var _a = 0, _b = Object.entries(properties); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], value = _c[1];
            element.setStyle(key, value);
        }
    }
    var path = parameters[0];
    var file = fs_1.readFileSync(path, { encoding: "utf-8" });
    element.children.push(file);
    return element.render();
}
exports.include = include;
function render() {
    var content = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        content[_i] = arguments[_i];
    }
    fs_1.readFile("template.html", { encoding: "utf-8" }, function (error, template) {
        var html = template.replace("{content}", content.join(""));
        fs_1.writeFile("index.html", html, function (error) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(html);
            }
        });
    });
}
exports.render = render;
//# sourceMappingURL=proto.js.map