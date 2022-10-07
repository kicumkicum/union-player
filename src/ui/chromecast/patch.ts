// @ts-ignore
import {DefaultMediaReceiver} from 'castv2-client';
import {Track} from "ym-api/dist/types";
import {selectTrack} from "../../state/playlist-selectors";

const getTrackSrc = (track: Track, size: number) => {
  if (!track.coverUri) {
    return ``;
  }

  // TODO: May be url is not correct
  return `https://${track.coverUri.replace('%%', `${size}x${size}`)}`
};

// Workaround for change app_id
DefaultMediaReceiver.APP_ID = '86E542A2';

// Workaround for extend metadata. API not supported with props
// @ts-ignore
DefaultMediaReceiver.prototype.load = function(media, options, callback) {
  const track = selectTrack();

  media.contentType = 'audio/mp3';
  media.metadata.metadataType = 3;

  media.metadata.artist = track.artists.map((it) => it.name).join(', ');
  media.metadata.albumName = track.albums[0].title;
  media.metadata.title = track.title;
  media.metadata.images = [{
    url: getTrackSrc(track, 400),
  }];

  this.media.load.apply(this.media, arguments);
};
