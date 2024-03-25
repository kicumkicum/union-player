import {togglePause, play, toggleMute, setVolume} from '../state/player-slice';
import {
    setActiveNext,
    setActivePrev,
    loadPopularTracksByArtist,
    loadAlbumByTrack,
    loadTracksByArtists,
    search,
    loadTrackUrl
} from '../state/playlist-slice';
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
    ADD_CHROMECAST_UI = 'add-chromecast-ui',
    VOLUME_INC = 'volume-inc',
    VOLUME_DEC = 'volume-dec',
    SEARCH = 'search',
    HELP = 'help',
    PLAY_URL = 'play-url',
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
    [Command.ADD_CHROMECAST_UI]: ['c'],
    [Command.VOLUME_DEC]: ['volume-down', 'down'],
    [Command.SEARCH]: ['search', 's'],
    [Command.HELP]: ['help', 'h'],
    [Command.PLAY_URL]: ['play-url', 'u'],
};

export const createCommands = (dispatch: any, store: Store) => {
    const commandCallback = {
        [Command.ADD_CHROMECAST_UI]: async () => createChromecast(store),
        [Command.NEXT_TRACK]: async () => dispatch(setActiveNext()),
        [Command.SEARCH]: async (query: string) => dispatch(search(query)),
        [Command.PREV_TRACK]: async () => dispatch(setActivePrev()),
        [Command.TOGGLE_PLAY]: async () => dispatch(togglePause()),
        [Command.PAUSE]: async () => dispatch(togglePause()),
        [Command.PLAY]: async (url: string) => dispatch(play(url)),
        [Command.TOGGLE_MUTE]: async () => dispatch(toggleMute()),
        [Command.VOLUME_INC]: async () => dispatch(setVolume(selectVolume() + 10)),
        [Command.VOLUME_DEC]: async () => dispatch(setVolume(selectVolume() - 10)),
        [Command.SELECT_PLAYLIST]: async (): Promise<null> => null,
        [Command.SHOW_PLAYLISTS]: async (): Promise<null> => null,
        // TODO: Move to action
        [Command.EXIT]: async () => {
            setTimeout(() => process.exit(0), 100)
        },
        [Command.PLAY_ALBUM_BY_SONG]: () => dispatch(loadAlbumByTrack(selectTrack())),
        [Command.PLAY_POPULAR]: () => dispatch(loadPopularTracksByArtist(selectArtist().id)),
        [Command.PLAY_ARTIST]: (...words: string[]) => dispatch(loadTracksByArtists([words.join(` `)])),
        [Command.HELP]: async () => {
            // TODO Move implementation to more suitable module. Use it redux-action may be
            console.log(
              Object.keys(CommandAlias).map((commandName) => {
                const bar = CommandAlias[commandName as Command];
                return `${commandName}: ${(bar).join(`, `)}`
              })
            );
        },
        [Command.PLAY_URL]: async (url: string) => {
            const id = url.split(`/`).reverse()[0];
            // @ts-ignore
            dispatch(loadTrackUrl({id}));
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

                    const result = config.layouts
                      .some((layout) => layout[keyPosition] === command);

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

