exports.undef = v => v === null || v === undefined;
exports.notUndef = v => v !== null && v !== undefined;
exports.func = f => typeof f === "function";
exports.number = n => typeof n === "number";
exports.string = s => typeof s === "string";