"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure = exports.validate = exports.invoke = void 0;
function invoke(method, data) {
    const result = validate(method, data);
    if (!result || (typeof result !== "boolean" && ('blame' in result))) {
        console.log(result.toString());
        return result;
    }
    const expected = ((f) => f.toString().replace(/[\r\n\s]+/g, ' ').
        match(/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/).
        slice(1, 3).
        join('').
        split(/\s*,\s*/))(method.callback);
    const args = [];
    for (let index = 0, len = expected.length; index < len; index++) {
        args[index] = data[expected[index]];
    }
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        resolve(yield method.callback(...args));
    }));
}
exports.invoke = invoke;
function validate(method, data) {
    if (!method.arguments)
        return true;
    if (Object.keys(method.arguments).length < method.callback.length) { }
    for (const key in method.arguments) {
        const result = ensure(method.arguments[key], data[key], key);
        if (!result || (typeof result !== "boolean" && ('blame' in result)))
            return result;
    }
    return true;
}
exports.validate = validate;
function ensure(argument, against, key) {
    var _a;
    if (argument.ensure)
        return argument.ensure(against);
    const types = (_a = argument.type) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, '').split("|");
    if (!argument.type || typeof types === "undefined" || types.includes("any") || types.includes("undefined") || types.includes(typeof against))
        return true;
    return { blame: { culprit: against, type: typeof against, expected: types.length > 1 ? types : types[0], key: key },
        toString: () => `${against} is typeof ${typeof against} expected type of ${Array.isArray(types) ? types.join(" OR ") : types}${key ? " for " + key : ""}` };
}
exports.ensure = ensure;
