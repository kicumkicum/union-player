import * as readline from 'readline';
import {StupidPlayer} from 'stupid-player';
import {State, Store} from '../../state/store';
import {Interface} from 'readline';
import {Command, createCommands} from '../commands';
import {useEffect} from '../../utils/not-react';

const createCLI = (player: StupidPlayer, store: Store): void => {
    new CLI(player, store);
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
    private player: StupidPlayer;
    private rl: Interface;

    constructor(player: StupidPlayer, store: Store) {
        this.player = player;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onReadLine = this.onReadLine.bind(this);

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

        this.getExecCommand = createCommands(player, store.dispatch);

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
        const [command, value] = line.substr(1).split(' ');
        console.log('line:', line)
        console.log('command:', command)
        console.log('value:', value)

        const [type, callback] = this.getExecCommand(command);

        if (callback) {
            process.stdout.clearLine(-1);
            process.stdout.moveCursor(-1, 0);

            console.log('Command:', type);

            await callback(value);
        }

        this.unHandleLine();
        this.handleKey();
    }

    // @ts-ignore
    private async onKeyDown(str, key) {
        const command = key.name || key.sequence;

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

        switch (command) {
            // case 'm': {
            //     const volume = p.getVolume()
            //     await p.setVolume(volume > 0 ? 0 : 100);
            //     break;
            // }
            // case 'v': {
            //     const volume = parseInt(value, 10);
            //     await p.setVolume(volume);
            //     break;
            // }
            // case 'up':
            //     await p.pause();
            //     await wait(3000);
            //
            //     //@ts-ignore
            //     const readClone1 = p.readStream;
            //     //@ts-ignore
            //     p.readStream = readClone1.pipe(rangeStream(500000));
            //     await p.resume();
            //     break;
            // case 'l':
            //     //@ts-ignore
            //     console.log(p.readStream);
            //     break;
        }
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
