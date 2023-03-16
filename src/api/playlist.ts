import {shuffle} from "../utils/array";
import {Album, Artist, Track} from "ym-api/dist/types";
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

const loadPlaylist = async (playlistType: PlaylistType = PlaylistType.playlistOfTheDay) => {
    const feed = await ymApi.getFeed();
    const playlistLite = feed.generatedPlaylists.find((it) => it.type === playlistType);

    if (!playlistLite) {
      throw new Error('Not find playlist')
    }

    const playlist = await ymApi.getPlaylist(playlistLite.data.kind, playlistLite.data.owner.uid);

    return shuffle(playlist.tracks.map(it => ({track: it.track})))
};

const loadPopularTracksByArtist = async (artistId: Artist['id']) => {
    // @ts-ignore
    const artist = await ymApi.getArtist(artistId);

    //@ts-ignore
    return shuffle(artist.popularTracks.map(it => ({track: it})));
};

const loadAlbumByTrack = async (track: Track): Promise<{track: Track}[]> => {
  const artist = await ymApi.getArtist(track.artists[0].id);

  // @ts-ignore
  const album = track.albums.find((album) => {
    return album.artists.some((it) => it.name === artist.artist.name)
  });

  const tracks = (await ymApi.getAlbumWithTracks(album.id)).volumes[0];

  return shuffle(tracks.map(it => ({track: it})));
};

const loadTrackUrl = async (track: Track) => {
    const t = await ymApi.getTrackDownloadInfo(track.id);

    return await ymApi.getTrackDirectLink(t[1].downloadInfoUrl);
};

const search = async (query: string) => {
  console.log('search', {query})
  query = `Новостройки BY ploho FROM Новостройки`;
  const [track, artist] = query.split('BY').map((it) => it.trim());

  const tracks = await ymApi.searchTracks(encodeURIComponent(track.toLocaleLowerCase()), {});
  // console.log(tracks.tracks.results[1].artists)
  const results = tracks.tracks?.results?.filter((it) => {
    return it.artists.some((artist_) => artist.toLocaleLowerCase() === artist_.name.toLocaleLowerCase());
  });

  return results.map(it => ({track: it}));
};

const auth = async () => {
    const {token} = config;

    return await ymApi.init({uid: 11111111, access_token: token});
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
  search,
  loadAlbumByTrack,
  auth,
};

export {
  playlistApi,
}
