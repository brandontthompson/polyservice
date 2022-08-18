"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfController = void 0;
function instanceOfController(object) {
    return 'middleware' in object;
}
exports.instanceOfController = instanceOfController;
