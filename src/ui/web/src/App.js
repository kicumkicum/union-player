import {useRef, useEffect} from "react";
import {Track} from "ym-api/dist/types";
import {Player} from "./components/player/player";

import './App.css';
// const SERVER = '192.168.88.250';
const SERVER = '192.168.1.27';

const noop = () => {};

export const Action = {
  player: {
    togglePause: {},
  },
  playlist: {
    setActiveNext: noop,
  }
};

const send = (input) => {
  const {owner, action} = input;
};

send(Action.player.togglePause)

const togglePause = async () => {
  await fetch(`http://${SERVER}:1338/action/player/togglePause`);
};

const nextActiveTrack = async () => {
  await fetch(`http://${SERVER}:1338/action/playlist/setActiveNext`);
};

const prevActiveTrack = async () => {
  await fetch(`http://${SERVER}:1338/action/playlist/setActivePrev`);
};

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', function() {
    togglePause();
    audio.pause();
  });
  navigator.mediaSession.setActionHandler('pause', function() {
    togglePause();
    audio.play();
  });
  // navigator.mediaSession.setActionHandler('seekbackward', function() {});
  // navigator.mediaSession.setActionHandler('seekforward', function() {});
  navigator.mediaSession.setActionHandler('previoustrack', function() {
    prevActiveTrack();
  });
  navigator.mediaSession.setActionHandler('nexttrack', function() {
    nextActiveTrack();
  });
}

let audio = null;
const foo = (ref) => {

}

const getTrackSrc = (track, size) => {
  if (!track.coverUri) {
    return ``;
  }

  return `http://${track.coverUri.replace('%%', `${size}x${size}`)}`
};


/**
 * @param {{
 *  track: Track,
 *  state: string,
 * }} props
 * @returns {JSX.Element}
 * @constructor
 */
function App(props) {
  const {track, state} = props;

  const ref = useRef(null);
  console.log(track.artists.map(it => it.name).join(' & '))
  console.log(track.artists)

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title,
        artist: track.artists.map(it => it.name).join(' & '),
        album: track.albums[0].title,
        artwork: [
          { src: getTrackSrc(track, 100), sizes: '96x96',   type: 'image/png' },
          { src: getTrackSrc(track, 200), sizes: '128x128', type: 'image/png' },
          // { src: getTrackSrc(track, 200), sizes: '192x192', type: 'image/png' },
          // { src: getTrackSrc(track, 300), sizes: '256x256', type: 'image/png' },
          // { src: getTrackSrc(track, 400), sizes: '384x384', type: 'image/png' },
          // { src: getTrackSrc(track, 400), sizes: '512x512', type: 'image/png' },
        ]
      });
    }
  }, [track.title, track.artists, track.albums]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      const stateToMediaSessionState = {
        'play': 'playing',
        'pause': 'paused',
        'stop': 'paused'
      };

      // navigator.mediaSession.playbackState = stateToMediaSessionState[state] || 'none';
    }
  }, [state]);

  return (
    <div>
      <audio
        loop
        ref={ref}
        src={'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'}/>
      <button
        onClick={() => {
          audio = ref.current;
          audio.play();
          audio.volume = 0;
        }}
      >toggle pause</button>
      <button
        onClick={() => ref.current.pause()}
      >nextActiveTrack</button>

      <div>{`Play: ${track.artists[0].name} - ${track.title} > ${track.albums[0].title}`}</div>
      <div>
        <img
          src={`http://${track.coverUri.replace('%%', '300x300')}`}
        />
      </div>
      <Player />
    </div>
  );
}

export default App;
