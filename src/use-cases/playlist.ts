import {shuffle} from "../utils/array";
import {Album, Track} from "ym-api/dist/types";
import config from "../../config";
import {ymApi} from "../singletone";

enum PlaylistType {
  playlistOfTheDay = 'playlistOfTheDay',
  missedLikes = 'missedLikes',
  recentTracks = 'recentTracks',
  neverHeard = 'neverHeard',
  kinopoisk = 'kinopoisk',
  summerTop2021 = 'summerTop2021',
  origin = 'origin',
}

const loadPlaylist = async (playlistType: PlaylistType) => {
    const feed = await ymApi.getFeed();
    const playlistLite = feed.generatedPlaylists.find((it) => it.type === playlistType);

    if (!playlistLite) {
      throw new Error('Not find playlist')
    }

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

const loadTracksByAlbum = async (album: Album) => {
  const a = await ymApi.getAlbumWithTracks(album.id);
  return a.volumes[0];
};

const loadTracksByArtist = async (artist: string): Promise<{track: Track}[]> => {
  const response = await ymApi.searchArtists(encodeURIComponent(artist));
  const artist_ = response?.artists.results.find((it) => it.name.toLocaleLowerCase() === artist.toLowerCase());

  if (!artist_) {
    return [];
  }

  const {albums} = await ymApi.getArtist(artist_.id);

  const tracks = await Promise.all(albums.map(loadTracksByAlbum));

  return [].concat(...tracks).map(it => ({track: it}));
};

const loadTracksByArtists = async (artists: string[]) => {
  const tracks = await Promise.all(artists.map(loadTracksByArtist));

  return shuffle([].concat(...tracks));
};

const playlistApi = {
  loadPlaylist,
  loadPopularTracksByArtist,
  loadTracksByArtist,
  loadTracksByArtists,
  loadTrackUrl,
  auth,
};

export {
  playlistApi,
}
