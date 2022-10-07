import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider, connect} from 'react-redux';
import {createStore} from 'redux';
import {combineReducers} from 'redux';

// const SERVER = '192.168.88.250';
const SERVER = '192.168.1.27';

var exampleSocket = new WebSocket(`ws://${SERVER}:1338`, ["protocolTwo"]);

const App_ = connect((state) => (console.log(state) || {
    track: state.todo.playlist.activeTrack.track,
    state: state.todo.player.state,
}))(App);

exampleSocket.onmessage = function (event) {
    console.log(event.data);

    try {
        const foo = JSON.parse(event.data);

        if (foo.type === 'all') {
            store.dispatch(foo);
        }
    } catch (e) {
    }
};

const initialState = {
    playlist: {
        activeTrack: {
            track: {
                artists: [{name: 'name'}],
                albums: [{title: 'title'}],
                title: 'foo track',
                coverUri: ''
            }
        }
    },
    player: {
        state: 'pause'
    }
};
const reducers = combineReducers({
    todo: (state = initialState, {type, payload}) => {
        if (type === 'all') {
            return payload;
        }

        return state;
    }
});

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App_/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
