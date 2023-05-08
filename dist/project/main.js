"use strict";
exports.__esModule = true;
var properties_model_1 = require("../models/properties.model");
var proto_1 = require("../proto");
var books = ["Mathew", "Mark", "Luke", "John"];
function header() {
    return proto_1.frame({
        background: "black",
        color: "white"
    }, proto_1.text({ flex: "1", "text-align": "center" }, "Header"));
}
function tabView() {
    return proto_1.frame({
        "flex-direction": properties_model_1.Direction.Horizontal,
        "justify-content": "space-around",
        "align-items": "center",
        height: 64,
        background: "black",
        padding: 16,
        "padding-top": 0
    }, icon("book"), icon("bookmark"), icon("highlight"), icon("profile"));
}
function icon(name) {
    var imageSize = 32;
    return proto_1.include({
        width: imageSize,
        height: imageSize,
        fill: "white"
    }, "src/project/icons/" + name + ".svg");
}
proto_1.render(proto_1.frame({
    width: 360,
    height: 800,
    background: "lightgray",
    "flex-direction": properties_model_1.Direction.Vertical,
    "border-radius": 48,
    overflow: "hidden"
}, header(), proto_1.frame({
    "flex-direction": properties_model_1.Direction.Vertical,
    flex: "1"
}, proto_1.repeat(books, function (book) { return proto_1.text(book); })), tabView()), proto_1.frame({
    width: 360,
    height: 640,
    background: "lightgray",
    "flex-direction": properties_model_1.Direction.Vertical,
    "border-radius": 16,
    overflow: "hidden"
}, header(), proto_1.frame({
    "flex-direction": properties_model_1.Direction.Vertical,
    flex: "1"
}, proto_1.repeat(books, function (book) { return proto_1.text(book); })), tabView()));
//# sourceMappingURL=main.js.map