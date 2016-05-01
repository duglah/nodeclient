import ioc from "./ioc";
import {INodeClient} from "./interfaces/INodeClient";
import NodeClient from "./NodeClient";

ioc.registerSingleton<INodeClient>("INodeClient", () => new NodeClient());

export default ioc;