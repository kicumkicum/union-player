import S from 'stupid-player';
import {YMApi} from 'ym-api';
import config from './config';
import {createCLI} from './src/ui/cli/cli';
import {Track} from "ym-api/dist/types";
import store from './src/state/store';
import { setActiveTrack } from './src/state/playlist-slice';

const {login, password} = config;

const api = new YMApi();
const p = new S();

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

(async () => {
  const work = async (track: Track): Promise<void> => {
    const t = await api.getTrackDownloadInfo(track.id);
    const k = await api.getTrackDirectLink(t[0].downloadInfoUrl)

    await p.play(k)
    await p.setVolume(100)

    // console.log('play', track)
    console.log(`play: ${track.artists[0].name} - ${track.title} > ${track.albums[0].title}`)

    await new Promise((resolve) => {
      p.once(p.EVENT_STOP, resolve)
    });
  }

  createCLI(p);

  try {
    await api.init({username: login, password});
    const t = await api.getPlaylist(3);
    const tracks = shuffle(t.tracks.slice());

    for (const {track} of tracks) {
      await work(track);
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
})();
