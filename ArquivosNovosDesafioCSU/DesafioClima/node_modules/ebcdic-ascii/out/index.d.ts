/// <reference types="node" />
import { ConvTableName } from "./tables";
type QuickLookupTable = {
    [name: string]: string;
};
/**
 * Class for converting between EBCDIC and ASCII (ISO-8859-1)
 */
export default class EbcdicAscii {
    asciiToEbcdicTable: QuickLookupTable;
    ebcdicToAsciiTable: QuickLookupTable;
    /**
     *
     * @param tableName string - May be "0273" for german, "0037" for english and "0278" for finnish/swedish
     */
    constructor(tableName: ConvTableName);
    setTable(tableName: ConvTableName): void;
    /**
     * Convert an EBCDIC hex string to an ASCII string
     * @param ebcdic string - Hex representation of an EBCDIC string
     */
    toASCII(ebcdic: string): string;
    /**
     * Convert an EBCDIC hex string to an ISO-8859-1 Buffer
     * @param ebcdic string - Hex representation of an EBCDIC string
     */
    toISO(ebcdic: string): Buffer;
    /**
     * Convert an ASCII hex string to an EBCDIC hex string
     * @param asciiHex string - ASCII string
     */
    toEBCDIC(asciiHex: string): string;
    /**
     * `AA2E30EE` -> [`AA`, `2E`, `30`, `EE`]
     * @param ebcdicString string - Hex representation of an EBCDIC string
     */
    splitHex(ebcdicString: string): string[];
    /**
     * Convert an EBCDIC hex char to an ASCII hex char
     * @param ebcdicCode string - Hex code for an EBCDIC char
     */
    charToASCII(ebcdicCode: string): string;
    /**
     * Convert an ASCII hex char to an EBCDIC hex char
     * @param asciiCode string - Hex code for an ASCII char
     */
    charToEBCDIC(asciiCode: string): string;
}
export {};
