const {YMApi} = require("ym-api");
const S = require('stupid-player')
const readline = require('readline');
const {login, password} = require('config');

const api = new YMApi();
const p = new S();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', async (line) => {
  console.log('line:', line)
  switch (line) {
    case 'p':
      p.togglePause();
      break;
    case 's':
    case 'n':
      p.stop();
      break;
    case 'm':
      const volume = p.getVolume()
      await p.setVolume(volume > 0 ? 0 : 100);
      break;
  }
});

function shuffle(array) {
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
  const work = async (track) => {
    const t = await api.getTrackDownloadInfo(track.id);
    const k = await api.getTrackDirectLink(t[0].downloadInfoUrl)

    await p.play(k)
    await p.setVolume(100)

    console.log('play', track)
    console.log(`play: ${track.artists[0].name} - ${track.title} > ${track.albums[0].title}`)

    await new Promise((resolve) => {
      p.on(p.EVENT_STOP, resolve)
    });
  }

  try {
    await api.init({username: login, password});
    const t = await api.getPlaylist('3')
    const tracks = shuffle(t.tracks.slice());

    for (const {track} of tracks) {
      await work(track);
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
})();
