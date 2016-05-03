"use strict";
var IoC = (function () {
    function IoC() {
        this._singletonRegistrations = {};
        this._singletons = {};
    }
    IoC.prototype.registerSingleton = function (interfaceType, ctor) {
        if (!this._singletonRegistrations[interfaceType] && !this._singletons[interfaceType]) {
            this._singletonRegistrations[interfaceType] = ctor;
        }
        else {
            throw new Error("interface " + interfaceType + " already registered as singleton");
        }
    };
    IoC.prototype.resolve = function (interfaceType) {
        if (!this._singletons[interfaceType] && !this._singletonRegistrations[interfaceType]) {
            throw new Error("nothing registered for " + interfaceType);
        }
        else {
            if (!this._singletons[interfaceType]) {
                this._singletons[interfaceType] = this._singletonRegistrations[interfaceType]();
                delete this._singletonRegistrations[interfaceType];
            }
            return this._singletons[interfaceType];
        }
    };
    IoC.prototype.adapt = function (ioc) {
        for (var i in ioc._singletonRegistrations) {
            this.registerSingleton(i, ioc._singletonRegistrations[i]);
        }
        for (var i in ioc._singletons) {
            this.registerSingleton(i, ioc._singletons[i]);
        }
    };
    return IoC;
}());
exports.IoC = IoC;
var ioc = new IoC();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ioc;

//# sourceMappingURL=ioc.js.map
