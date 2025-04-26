import React from 'react';
import {Button, ButtonGroup, Image, render, Root, Text} from "@urban-bot/core";
import {UrbanBotTelegram} from "@urban-bot/telegram";
import config from "../../../config";
import {togglePause, stop, toggleMute} from "../../state/player-slice";
import {State} from "stupid-player";
import {setActivePrev, setActiveNext} from "../../state/playlist-slice";
// @ts-ignore
import { Provider, useSelector } from 'react-redux/lib/alternate-renderers';
import {Artist} from "ym-api/dist/types";

const urbanBotTelegram = new UrbanBotTelegram({
  token: config.telegramToken,
  isPolling: true,
});

// @ts-ignore
const Playlist = ({tracks, currentTrack}) => {
  // @ts-ignore
  const index = tracks.findIndex(({track}) => {
    return track.id === currentTrack?.id;
  }) || 0;

  const playlistLength = 7;
  const first = Math.floor(index < playlistLength / 2 ? 0 : index - playlistLength / 2);

  // @ts-ignore
  const text = tracks.slice(first, first + playlistLength).map(({track}, i) => {
    const position = Number(first) + i + 1;
    const isCurrentTrack = (track && currentTrack && track.id === currentTrack.id) ? ` >>` : ``;
    const artistName = track.artists.map((artist: Artist) => artist.name).join(', ');
    const trackTitle = track.title;
    const albumTitle = track.albums[0].title;
    return `${position}. ${isCurrentTrack} ${artistName} - ${trackTitle} :: ${albumTitle}`;
  }).join(`\n`);

  if (!text) {
    return null;
  }

  return (
    <Text>{text}</Text>
  );
};

// @ts-ignore
const createControls = ({dispatch, store}) => {
  return (
    <ButtonGroup title="Buttons">
      <Button onClick={() => {
        dispatch(setActivePrev())
      }}>{`⏮`}</Button>
      <Button onClick={() => {
        dispatch(stop())
      }}>{`⏹`}</Button>
      <Button onClick={() => {
        dispatch(togglePause())
      }}>{store.getState().player.state === State.PLAY ? `▶` : `⏸`}</Button>
      <Button onClick={() => {
        dispatch(setActiveNext())
      }}>{`⏭`}</Button>
      <Button onClick={() => {
        dispatch(toggleMute())
      }}>{`🔇`}</Button>
      <Button onClick={() => {
        // dispatch(toggleMute())
      }}>{`🤍`}</Button>
    </ButtonGroup>
  );
};

// @ts-ignore
const Controls = ({dispatch, store, setVal}) => {
  return (
    <>
      <Button onClick={() => {
        dispatch(setActivePrev())
      }}>{`⏮`}</Button>
      <Button onClick={() => {
        dispatch(stop())
      }}>{`⏹`}</Button>
      <Button onClick={() => {
        console.log(`Controls::togglePause`, 1)
        dispatch(togglePause())
        setVal(Math.random())
        console.log(`Controls::togglePause`, 2)
        console.log(`Controls::togglePause`, 3, store.getState().player)
      }}>{store.getState().player.state === State.PLAY ? `⏸` : `▶️`}</Button>
      <Button onClick={() => {
        dispatch(setActiveNext())
      }}>{`⏭`}</Button>
      <Button onClick={() => {
        dispatch(toggleMute())
      }}>{`🔇`}</Button>
      <Button onClick={() => {
        // dispatch(toggleMute())
      }}>{`🤍`}</Button>
    </>
  );
};


const anim = [`.`, `..`, `...`];
let i = 0;
// @ts-ignore
const App = ({store}) => {
  // @ts-ignore
  const track = useSelector((state) => state.playlist.activeTrack?.track);
  // @ts-ignore
  const tracks = useSelector((state) => state.playlist.tracks);
  const img = track?.coverUri.replace('%%', '300x300');
  const text = track ?`${track.artists[0].name} - ${track.title} :: ${track.albums[0].title}` : ``;

  const buttons = createControls({store, dispatch: store.dispatch});
  // const buttons = (
  //   <ButtonGroup title="Buttons">
  //     <Controls store={store} dispatch={store.dispatch} />
  //   </ButtonGroup>
  // );

  return (
    <>
      <Playlist tracks={tracks} currentTrack={track} />
      {img ? <Image file={`https://` + img} title={text} buttons={buttons}/> : null}
    </>
  );
};

// @ts-ignore
const createTeleJsx = (store) => {
  render(
    <Root bot={urbanBotTelegram} port={3001} isNewMessageEveryRender={false} initialChats={[{
      id: `555209582`,
      type: `private`,
      title: undefined,
      username: `kicumkicum`,
      firstName: `Oleg`,
      lastName: `Akinin`,
      description: undefined,
      inviteLink: undefined
    }]}>
      <Provider store={store}>
        <App
          store={store}
        />
      </Provider>

    </Root>,
    () => {},
  );
};

export {
  createTeleJsx,
};

