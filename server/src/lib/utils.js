"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genId = genId;
const nanoid_1 = require("nanoid");
/**
 * Generates a unique ID with the provided prefix.
 * @param pfx - The prefix to use for the generated ID.
 * @returns A unique ID in the format `{pfx}_{randomId}`.
 */
function genId(pfx) {
    const nanoid = (0, nanoid_1.customAlphabet)("0123456789abcdefghijklmnopqrstuvwxyz", 10);
    return [pfx, nanoid()].join("_");
}
