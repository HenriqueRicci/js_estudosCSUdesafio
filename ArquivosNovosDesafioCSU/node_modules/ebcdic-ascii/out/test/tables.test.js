"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tables_1 = require("../tables");
function combine(array) {
    return array.flatMap(function (v, i) { return array.slice(i + 1).map(function (w) { return [v, w]; }); });
}
function combineWithName(map) {
    var array = Object.entries(map).map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ k: k, v: v });
    });
    return combine(array).map(function (_a) {
        var a = _a[0], b = _a[1];
        return [a.k, b.k, a.v, b.v];
    });
}
describe("tables", function () {
    var combination = combineWithName(tables_1.convTables);
    test.each(combination)("%s codeset should have the same length as %s codeset", function (_, __, a, b) {
        var aLength = a.length;
        var bLength = b.length;
        expect(aLength).toBe(bLength);
    });
    test.each(combination)("%s codeset should have the same ascii characters as %s codeset", function (_, __, a, b) {
        var aChars = a.map(function (c) { return c.ascii; });
        var bChars = b.map(function (c) { return c.ascii; });
        expect(aChars).toStrictEqual(bChars);
    });
});
