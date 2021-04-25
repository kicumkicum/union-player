import {StupidPlayer} from 'stupid-player';
import {togglePause, play, toggleMute} from '../../state/player-slice.api';
import {setActiveNext} from '../../state/playlist-slice';

enum Command {
    PLAY = 'play',
    PAUSE = 'pause',
    TOGGLE_PLAY = 'toggle-play',
    TOGGLE_MUTE = 'toggle-mute',
    NEXT_TRACK = 'next-track',
    PREV_TRACK = 'prev-track',
    SELECT_PLAYLIST = 'select-playlist',
    SHOW_PLAYLISTS = 'show-playlists',
    EXIT = 'exit',
}

const CommandAlias: Record<Command, string[]> = {
    [Command.NEXT_TRACK]: ['next', 'n'],
    [Command.TOGGLE_PLAY]: ['p'],
    [Command.PAUSE]: ['pause'],
    [Command.PLAY]: ['play'],
    [Command.PREV_TRACK]: [],
    [Command.TOGGLE_MUTE]: ['m'],
    [Command.SHOW_PLAYLISTS]: [],
    [Command.SELECT_PLAYLIST]: [],
    [Command.EXIT]: ['q'],
};

// const commander = () => {};
//
// commander()
//     .command('play')
//         .option('--url')
//         .option('--service')
//         .key('-p')
//     .command('pause')
//         .hotKey('p')
//     .command('resume')
//         .hotKey('p')
//     .command('volume')
//         .value(true, 'DESCRIPTION')
//         .option('--value')
//         .key('-v');
//
// const commands = {
//     ['play']: {
//         options: [{
//             '--url': null,
//             '--service': null,
//             '--volume': null,
//         }],
//         shortKey: '-p',
//         callback: (value, options) => {
//             const {url, service, volume} = options;
//
//
//         }
//     },
//     'pause': {
//         hotKey: 'p',
//     },
//     'resume': {
//         hotKey: 'p'
//     },
//     'volume': {
//         value: '--value',
//         options: [{
//             name: '--value',
//             shortName: '-v',
//             description: 'DESCRIPTION',
//         }],
//         key: '-v'
//     }
// }

export const createCommands = (player: StupidPlayer, dispatch: any) => {
    const commandCallback = {
        [Command.NEXT_TRACK]: async () => dispatch(setActiveNext()),
        [Command.TOGGLE_PLAY]: async () => togglePause(),
        [Command.PAUSE]: async () => await player.pause(),
            // @ts-ignore
        [Command.PLAY]: async (url: string) => play(url),
        [Command.PREV_TRACK]: async (): Promise<null> => null,
        [Command.TOGGLE_MUTE]: async () => toggleMute(),
        [Command.SELECT_PLAYLIST]: async (): Promise<null> => null,
        [Command.SHOW_PLAYLISTS]: async (): Promise<null> => null,
        [Command.EXIT]: async () => process.exit(0),
    };
    
    const getExecCommand = (command: string): (...args: any[]) => Promise<void> => {
        const command_ = Object.keys(CommandAlias).find((key) => {
            return CommandAlias[key as Command].some((alias) => alias === command);
        }) as Command;

        return commandCallback[command_];
    };
    
    return getExecCommand;
};

