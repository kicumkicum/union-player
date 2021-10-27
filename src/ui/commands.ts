import {StupidPlayer} from 'stupid-player';
import {togglePause, play, toggleMute, setVolume} from '../state/player-slice';
import {setActiveNext, setActivePrev, loadPopularTracksByArtist, loadAlbumByTrack, loadTracksByArtists, search} from '../state/playlist-slice';
import {selectVolume} from '../state/player-selectors';
import config from '../../config';
import {selectArtist, selectTrack} from "../state/playlist-selectors";
import {createChromecast} from "./chromecast/chromecast";
import {Store} from "../state/store";

export enum Command {
    PLAY = 'play',
    PAUSE = 'pause',
    TOGGLE_PLAY = 'toggle-play',
    TOGGLE_MUTE = 'toggle-mute',
    NEXT_TRACK = 'next-track',
    PREV_TRACK = 'prev-track',
    SELECT_PLAYLIST = 'select-playlist',
    SHOW_PLAYLISTS = 'show-playlists',
    PLAY_ALBUM_BY_SONG = 'play-album-by-song',
    EXIT = 'exit',
    PLAY_POPULAR = 'play-popular-by-artist',
    PLAY_ARTIST = 'play-artist',
    VOLUME_INC = 'volume-inc',
    VOLUME_DEC = 'volume-dec',
    SEARCH = 'search',
}

const CommandAlias: Record<Command, string[]> = {
    [Command.NEXT_TRACK]: ['n', 'return', 'next'],
    [Command.TOGGLE_PLAY]: ['p', 'toggle-play', 'toggle-pause', 'space'],
    [Command.PAUSE]: ['pause'],
    [Command.PLAY]: ['play'],
    [Command.PREV_TRACK]: ['r', 'prev'],
    [Command.TOGGLE_MUTE]: ['m', 'mute', 'unmute', 'toggle-mute'],
    [Command.SHOW_PLAYLISTS]: [],
    [Command.PLAY_ALBUM_BY_SONG]: ['a'],
    [Command.SELECT_PLAYLIST]: [],
    [Command.EXIT]: ['q', 'exit', 'quit'],
    [Command.PLAY_POPULAR]: ['o'],
    [Command.PLAY_ARTIST]: ['play-artist', 'pa'],
    [Command.VOLUME_INC]: ['volume-up', 'up'],
    [Command.VOLUME_DEC]: ['volume-down', 'down'],
    [Command.SEARCH]: ['search', 's'],
};

export const createCommands = (player: StupidPlayer, dispatch: any) => {
    const commandCallback = {
        [Command.NEXT_TRACK]: async () => dispatch(setActiveNext()),
        [Command.SEARCH]: async (query: string) => dispatch(search(query)),
        [Command.PREV_TRACK]: async () => dispatch(setActivePrev()),
        [Command.TOGGLE_PLAY]: async () => dispatch(togglePause()),
        [Command.PAUSE]: async () => dispatch(togglePause()),
            // @ts-ignore
        [Command.PLAY]: async (url: string) => dispatch(play(url)),
        [Command.TOGGLE_MUTE]: async () => dispatch(toggleMute()),
        [Command.VOLUME_INC]: async () => {
            const volume = selectVolume();
            dispatch(setVolume(volume + 10));
        },
        [Command.VOLUME_DEC]: async () => {
            const volume = selectVolume();
            dispatch(setVolume(volume - 10));
        },
        [Command.SELECT_PLAYLIST]: async (): Promise<null> => null,
        [Command.SHOW_PLAYLISTS]: async (): Promise<null> => null,
        [Command.EXIT]: async () => process.exit(0),
        [Command.PLAY_ALBUM_BY_SONG]: () => dispatch(loadAlbumByTrack(selectTrack())),
        [Command.PLAY_POPULAR]: () => dispatch(loadPopularTracksByArtist(selectArtist().id)),
        [Command.PLAY_ARTIST]: (...artists: string[]) => {
            return dispatch(loadTracksByArtists(artists));
        },
    };

    const getExecCommand = (command: string): [Command, (...args: any[]) => Promise<void>] => {
        const command_ = Object.keys(CommandAlias).find((key) => {
            return CommandAlias[key as Command].some((alias) => {
                if (alias === command) {
                    return true;
                }

                if (alias.length === 1) {
                    const baseLayout = config.mainEnLayout;
                    const keyPosition = baseLayout.indexOf(alias);

                    const result = Object.keys(layouts).some((key) => {
                        // @ts-ignore
                        return layouts[key][keyPosition] === command;
                    });

                    if (result) {
                        return true;
                    }
                }

                return false;
            });
        }) as Command;

        return [command_, commandCallback[command_]];
    };

    return getExecCommand;
};
