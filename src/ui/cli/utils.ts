import {Track} from "ym-api/dist/types";

export const formatTrack = (track: Track): string => {
  return `${track.artists.map((it) => it.name).join(`, `)} - ${track.title} :: ${track.albums[0].title}`
};
