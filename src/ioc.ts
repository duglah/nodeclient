class IoC {
    private _singletonRegistrations: { [typeName: string]: () => any; } = {};
    private _singletons: { [typeName: string]: any; } = {};

    public registerSingleton<InterfaceType>(interfaceType: string, ctor: () => InterfaceType): void {
        if (!this._singletonRegistrations[interfaceType] && !this._singletons[interfaceType]) {
            this._singletonRegistrations[interfaceType] = ctor;
        }
        else {
            throw new Error("interface " + interfaceType + " already registered as singleton");
        }
    }

    public resolve<T>(interfaceType: string): T {
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
    }

    public adapt(ioc:IoC): void {
        for(let i in ioc._singletonRegistrations){
            this.registerSingleton(i, ioc._singletonRegistrations[i])
        }
        for(let i in ioc._singletons){
            this.registerSingleton(i, ioc._singletons[i])
        }
    }
}

var ioc = new IoC();

export default ioc;