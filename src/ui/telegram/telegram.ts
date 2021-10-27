import {Telegraf} from 'telegraf'
import {State, Store} from '../../state/store';
import {useEffect} from '../../utils/not-react';
import config from '../../../config';
import {createCommands} from '../commands';

const render = (state: State, ctx: any) => {
  useEffect(() => {
    const {track} = state.playlist.activeTrack;

    ctx && ctx.reply(`Play: ${track.artists[0].name} - ${track.title} :: ${track.albums[0].title}`)
  }, [state.playlist.activeTrack], 'telegram.send_track_info');
};

const createTelegram = async (store: Store) => {
  const {dispatch} = store;
  // @ts-ignore
  let ctx_;

  const getExecCommand = createCommands(dispatch, store);

  try {
    const bot = new Telegraf(config.telegramToken);

    bot.on('text', async (ctx) => {
      const {text} = ctx.update.message;
      const command = text.toLowerCase();

      const [type, callback] = getExecCommand(command);

      ctx.reply(type);

      if (callback) {
        await callback();
      } else {
        switch (command) {
          case 's':
            ctx_ = ctx;
            break;
        }
      }
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
