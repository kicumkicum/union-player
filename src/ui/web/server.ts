import ReadableStreamClone from 'readable-stream-clone'
//@ts-ignore
import rangeStream from "range-stream";
import {togglePause} from "../../state/player-slice";
import {playlistActions} from "../../state/playlist-slice";
import {Store} from "../../state/store";
const express = require('express');
import * as WebSocket from 'ws';
import * as http from 'http';

const app = express();

const Action = {
    player: {
        togglePause,
    },
    playlist: playlistActions
};

const port = 1338;
let readClone1: any = null;

export default {
    startServer(store: Store) {
        const server = http.createServer(app);

        const initWs = () => {
            const wss = new WebSocket.Server({ server });
            let ws_: WebSocket = null;

            store.subscribe(() => {
                if (!ws_) {
                    return;
                }

                // if (!ws_)

                const state = store.getState();
                ws_.send(JSON.stringify({
                    type: 'all',
                    payload: state
                }));
            });

            wss.on('connection', (ws: WebSocket) => {
                ws_ = ws;
                //connection is up, let's add a simple simple event
                ws.on('message', (message: string) => {

                    //log the received message and send it back to the client
                    console.log('received: %s', message);
                    ws.send(`Hello, you sent -> ${message}`);
                });

                ws.on('close', () => ws_ = null);

                //send immediatly a feedback to the incoming connection
                const state = store.getState();

                ws.send(JSON.stringify({
                    type: 'all',
                    payload: state
                }));
            });

            wss.on('close', initWs)
        };

        initWs();

        app.use('/hh', express.static(__dirname + 'build'));

        //@ts-ignore
        app.get('/action/:owner/:action', (req, res) => {
            const {owner, action} = req.params;
            //@ts-ignore
            // const c = A[owner].find(it => it.name === action);
            // store.dispatch(c());

            store.dispatch(Action[owner][action]());
            res.sendStatus(200);
        });

        server.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        });
    }
};
