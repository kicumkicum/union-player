import {StupidPlayer} from 'stupid-player';
import {Telegraf} from 'telegraf'
import {togglePause, toggleMute} from '../../state/player-slice';
import {setActiveNext, setActivePrev} from '../../state/playlist-slice';
import {State, Store} from '../../state/store';
import {useEffect} from '../../utils/not-react';
import config from '../../../config';

const render = (state: State, ctx: any) => {
  useEffect(() => {
    const {track} = state.playlist.activeTrack;

    ctx && ctx.reply(`Play: ${track.artists[0].name} - ${track.title} :: ${track.albums[0].title}`)
  }, [state.playlist.activeTrack], 'telegram.send_track_info');
};

const createTelegram = async (player: StupidPlayer, store: Store) => {
  const {dispatch} = store;
  // @ts-ignore
  let ctx_;

  try {
    const bot = new Telegraf(config.telegramToken);

    bot.on('text', async (ctx) => {
      const {text} = ctx.update.message;

      switch (text.toLowerCase()) {
        case 'p':
          // @ts-ignore
          dispatch(togglePause());
          break;
        case 'm':
          // @ts-ignore
          dispatch(toggleMute());
          break;
        case 'n':
          dispatch(setActiveNext());
          break;
        case 'r':
          dispatch(setActivePrev());
          break;
        case 's':
          ctx_ = ctx;
          break;
      }
      // @ts-ignore
      const result = {data: {RelatedTopics: []}};

      ctx.reply(JSON.stringify(result.data.RelatedTopics.map((it) => {
        return {
          url: it.FirstURL,
          text: it.Text
        };
      })));
    });

    await bot.launch();

    store.subscribe(() => {
      //@ts-ignore
      render(store.getState(), ctx_);
    });
  } catch (e) {
    console.error(e)
  }
};

export {
  createTelegram,
};
