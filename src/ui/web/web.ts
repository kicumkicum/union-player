import server from './server';
import {Store} from "../../state/store";

export const createWeb = (store: Store) => {
    server.startServer(store)
};
