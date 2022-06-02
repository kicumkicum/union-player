interface IPlayer {
  play: (uri: string, thunkApi: any) => Promise<{ state: State; uri: string }>;
  pause: () => Promise<State>;
  resume: (thunkApi: any) => Promise<State>;
  toggleMute: (value: number, thunkApi: any) => Promise<boolean>;
  togglePause: (thunkApi: any) => Promise<State>;
  stop: () => Promise<State>;
  setVolume: (value: number) => Promise<number>;
}

enum State {
  STOP = 'stop',
  PLAY = 'play',
  PAUSE = 'pause',
}

export {
  IPlayer,
  State,
}
