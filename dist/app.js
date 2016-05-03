"use strict";
var ioc_1 = require("./ioc");
var NodeClient_1 = require("./NodeClient");
ioc_1.default.registerSingleton("INodeClient", function () { return new NodeClient_1.default(); });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ioc_1.default;

//# sourceMappingURL=app.js.map
