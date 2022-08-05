import * as readline from 'readline';
import {State, Store} from '../../state/store';
import {Interface} from 'readline';
import {Command, createCommands} from '../commands';
import {useEffect} from '../../utils/not-react';

const createCLI = (store: Store): void => {
    new CLI(store);
};

const render = (state: State) => {
    // useEffect(() => {
    //     console.log('Last command: ', state.player.lastCommand)
    // }, [state.player.lastCommand], 4);

    useEffect(() => {
        const {track} = state.playlist.activeTrack;

        console.log(`Play: ${track.artists[0].name} - ${track.title} :: ${track.albums[0].title}`)
    }, [state.playlist.activeTrack], 'cli.show_playing_track');
};

const CLI = class {
    private rl: Interface;

    constructor(store: Store) {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onReadLine = this.onReadLine.bind(this);

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

        this.getExecCommand = createCommands(store.dispatch, store);

        // readline.emitKeypressEvents(process.stdin);
        // process.stdin.setRawMode(true);

        this.handleKey();

        store.subscribe(() => {
            //@ts-ignore
            render(store.getState());
        });
    }

    private getExecCommand(command: string): [Command, (...args: any[]) => Promise<void>] {
        return [Command.PLAY_POPULAR, () => Promise.resolve()];
    }

    private async onReadLine(line: string): Promise<void> {
        const [command, ...value] = line
          .replace(/.*:/, ':')
          .substr(1)
          .split(' ');

        // TODO: Move to render and to debug
        console.log('line:', line)
        console.log('command:', command)
        console.log('value:', value)

        const [type, callback] = this.getExecCommand(command);

        if (callback) {
            process.stdout.clearLine(-1);
            process.stdout.moveCursor(-1, 0);

            // TODO: Move to render
            console.log('Command:', type, callback());

            await callback(...value);
        }

        this.unHandleLine();
        this.handleKey();
    }

    // @ts-ignore
    private async onKeyDown(str, key) {
        const command = key.name || key.sequence;

        const {ctrl, meta, shift} = key;

        if (ctrl && command === `c`) {
            // TODO: Remove double code
            const [type, callback] = this.getExecCommand(`q`);
            if (callback) {
                // TODO: Move to render
                console.log('Command:', type);

                await callback();

                return;
            }
        }

        if (ctrl || meta || shift) {
            return;
        }

        if (['backspace', 'delete', 'insert'].some((it) => it === command)) {
            return;
        }

        if (command === ':') {
            process.stdout.moveCursor(1, 0);
            // process.stdout.clearLine(1)
            this.unHandleKey();
            this.handleLine();

            return;
        }

        process.stdout.clearLine(-1);
        process.stdout.moveCursor(-1, 1);

        const [type, callback] = this.getExecCommand(command);

        if (callback) {
            // TODO: Move to render
            console.log('Command:', type);

            await callback();

            return;
        }

        // TODO: Move to render
        console.log('Unhandle key:', command);
    }

    private handleLine() {
        this.rl.on('line', this.onReadLine);
    }
    private unHandleLine() {
        this.rl.removeListener('line', this.onReadLine);
    }
    private handleKey() {
        process.stdin.on('keypress', this.onKeyDown);
    }
    private unHandleKey() {
        process.stdin.removeListener('keypress', this.onKeyDown);
    }
};

export {
  createCLI,
};

// import rangeStream from 'range-stream';
// import ReadableStreamClone from 'readable-stream-clone';
