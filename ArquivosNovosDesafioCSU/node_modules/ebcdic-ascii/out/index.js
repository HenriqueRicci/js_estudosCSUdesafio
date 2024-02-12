"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tables_1 = require("./tables");
var iconv_lite_1 = __importDefault(require("iconv-lite"));
/**
 * Class for converting between EBCDIC and ASCII (ISO-8859-1)
 */
var EbcdicAscii = /** @class */ (function () {
    /**
     *
     * @param tableName string - May be "0273" for german, "0037" for english and "0278" for finnish/swedish
     */
    function EbcdicAscii(tableName) {
        this.asciiToEbcdicTable = {};
        this.ebcdicToAsciiTable = {};
        this.setTable(tableName);
    }
    EbcdicAscii.prototype.setTable = function (tableName) {
        var _this = this;
        var simpleTable = tables_1.convTables[tableName];
        simpleTable.forEach(function (tableItem) {
            var asciiCode = tableItem.hex;
            var ebcdicEntry = simpleTable.find(function (e) { return e.ebcdic === (tableItem === null || tableItem === void 0 ? void 0 : tableItem.ascii); });
            var ebcdicCode = ebcdicEntry ? ebcdicEntry.hex : "00";
            _this.asciiToEbcdicTable[asciiCode] = ebcdicCode;
            _this.ebcdicToAsciiTable[ebcdicCode] = asciiCode;
        });
        this.ebcdicToAsciiTable["00"] = "00";
    };
    /**
     * Convert an EBCDIC hex string to an ASCII string
     * @param ebcdic string - Hex representation of an EBCDIC string
     */
    EbcdicAscii.prototype.toASCII = function (ebcdic) {
        var _this = this;
        var ebcdicCodes = this.splitHex(ebcdic).map(function (a) { return a.toUpperCase(); });
        var isoHex = ebcdicCodes.map(function (code) { return _this.charToASCII(code); }).join("");
        return iconv_lite_1.default.decode(Buffer.from(isoHex, "hex"), "ISO-8859-1");
    };
    /**
     * Convert an EBCDIC hex string to an ISO-8859-1 Buffer
     * @param ebcdic string - Hex representation of an EBCDIC string
     */
    EbcdicAscii.prototype.toISO = function (ebcdic) {
        var _this = this;
        var ebcdicCodes = this.splitHex(ebcdic).map(function (a) { return a.toUpperCase(); });
        var isoHex = ebcdicCodes.map(function (code) { return _this.charToASCII(code); }).join("");
        return Buffer.from(isoHex, "hex");
    };
    /**
     * Convert an ASCII hex string to an EBCDIC hex string
     * @param asciiHex string - ASCII string
     */
    EbcdicAscii.prototype.toEBCDIC = function (asciiHex) {
        var _this = this;
        var asciiChars = this.splitHex(asciiHex).map(function (a) { return a.toUpperCase(); });
        return asciiChars.map(function (code) { return _this.charToEBCDIC(code); }).join("");
    };
    /**
     * `AA2E30EE` -> [`AA`, `2E`, `30`, `EE`]
     * @param ebcdicString string - Hex representation of an EBCDIC string
     */
    EbcdicAscii.prototype.splitHex = function (ebcdicString) {
        var res = ebcdicString.match(/(..?)/g);
        return res ? res : [];
    };
    /**
     * Convert an EBCDIC hex char to an ASCII hex char
     * @param ebcdicCode string - Hex code for an EBCDIC char
     */
    EbcdicAscii.prototype.charToASCII = function (ebcdicCode) {
        var asciiCode = this.ebcdicToAsciiTable[ebcdicCode];
        if (asciiCode === undefined) {
            throw new Error("Invalid char sequence ".concat(ebcdicCode));
        }
        return asciiCode;
    };
    /**
     * Convert an ASCII hex char to an EBCDIC hex char
     * @param asciiCode string - Hex code for an ASCII char
     */
    EbcdicAscii.prototype.charToEBCDIC = function (asciiCode) {
        var ebcdicCode = this.asciiToEbcdicTable[asciiCode];
        if (ebcdicCode === undefined) {
            throw new Error("Invalid char sequence ".concat(asciiCode));
        }
        return ebcdicCode;
    };
    return EbcdicAscii;
}());
exports.default = EbcdicAscii;
