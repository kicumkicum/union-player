// @ts-ignore
import {DefaultMediaReceiver} from 'castv2-client';
import {selectTrack} from "../../state/playlist-selectors";

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

  this.media.load.apply(this.media, arguments);
};
