import {shuffle} from "../utils/array";
import {Track} from "ym-api/dist/types";
import config from "../../config";
import {ymApi} from "../singletone";

const loadPlaylist = async () => {
    const feed = await ymApi.getFeed();
    const playlistLite = feed.generatedPlaylists[0];

    const playlist = await ymApi.getPlaylist(playlistLite.data.kind, playlistLite.data.owner.uid);

    return shuffle(playlist.tracks.map(it => ({track: it.track})))
};

const loadPopularTracksByArtist = async (artistId: string) => {
    // @ts-ignore
    const artist = await ymApi.getArtist(artistId);

    //@ts-ignore
    return shuffle(artist.popularTracks.map(it => ({track: it})));
};

const loadTrackUrl = async (track: Track) => {
    const t = await ymApi.getTrackDownloadInfo(track.id);

    return await ymApi.getTrackDirectLink(t[1].downloadInfoUrl);
};

const auth = async () => {
    const {login, password, token} = config;

    return await ymApi.init({username: login, password, access_token: token});
};

export {
  loadPlaylist,
  loadPopularTracksByArtist,
  loadTrackUrl,
  auth,
}
