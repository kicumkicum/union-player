import * as S from 'stupid-player';
import {YMApi} from 'ym-api';
import config from './config';
import {createCLI} from './src/ui/cli/cli';
import {Track} from "ym-api/dist/types";
import store from './src/state/store';
import { setActiveTrack } from './src/state/playlist-slice';

const {login, password, token} = config;

const api = new YMApi();
// @ts-ignore
const p = new S.StupidPlayer();
store.subscribe(() => {
  console.log(store.getState());
});
let val = 1

const _setActiveTrack = (v: number) => {
  store.dispatch(setActiveTrack(v))
}
setInterval(() => {
  // _setActiveTrack(val++);
}, 3000);

function shuffle<T>(array: T[]): T[] {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

interface AbstractMusicService {
  auth: any;
  getPlaylists: any;
  getPlaylist: any;
  getTracks: any;
  getTrack: any;
}

interface ITrack {
  title: string;
  album: any;
  extend: any;
  getDirectLink: any;
}

(async () => {
  const work = async (track_: Track): Promise<void> => {
    const t = await api.getTrackDownloadInfo(track_.id);
    const k = await api.getTrackDirectLink(t[1].downloadInfoUrl)

    await p.play(await S.StupidPlayer.getReadStream(k))
    await p.setVolume(100)

    let track = track_;
    if (!track.artists) {
      track = await api.getSingleTrack(track_.id)
    }

    // console.log('play', k)
    console.log(`play: ${track.artists[0].name} - ${track.title} > ${track.albums[0].title}`)

    await new Promise((resolve) => {
      // @ts-ignore
      p.once(p.EVENT_STOP, resolve)
    });
  }

  createCLI(p, store);

  try {
    const {access_token} = await api.init({username: login, password, access_token: token});
    console.log('!!!token', access_token);
    const feed = await api.getFeed();
    console.log(feed.generatedPlaylists)
    feed.generatedPlaylists.forEach(it => console.log(it.data.title));
    // const t = await api.getPlaylist(58460364);
    // const tracks = shuffle(t.tracks.slice());
    // console.log(feed.generatedPlaylists[0].data.tracks)
    //@ts-ignore
    const tracks = shuffle(feed.generatedPlaylists[0].data.tracks.map(it => ({track: it})));
    //@ts-ignore
    for (const {track} of tracks) {
      // @ts-ignore
      await work(track);
    }
  } catch (e) {
    console.log(`api error ${e.message}`, e.stack);
  }
})();
