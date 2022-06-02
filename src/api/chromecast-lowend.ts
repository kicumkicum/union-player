// @ts-nocheck
import {State} from "stupid-player";
import ChromecastAPI from 'chromecast-api';

const promisify = (func) => (...args) => {
  return new Promise((resolve, reject) => {
    func(...args, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

const wrapChromecastDevice = (device: any) => {
  return {
    play: promisify(device.play.bind(device)),
    pause: promisify(device.pause.bind(device)),
    resume: promisify(device.resume.bind(device)),
    stop: promisify(device.stop.bind(device)),
    setVolume: promisify(device.setVolume.bind(device)),
  };
};

const ChromecastDevice = class {
  private wrappedDevice = null;
  private state = State.STOP;

  constructor() {
    const client = new ChromecastAPI();

    client.on('device', this.onConnect.bind(this));
  }

  withCheckDevice(callback) {
    return () => {
      if (!this.wrappedDevice) {
        return;
      }

      callback();
    }
  }

  play(obj) {
    if (!this.wrappedDevice) {
      return;
    }

    this.state = State.PLAY;
    return this.wrappedDevice.play(obj);
  }

  // @withCheckDevice
  play2 = withCheckDevice((obj) => {
    this.state = State.PLAY;
    return this.wrappedDevice.play(obj);
  })

  pause() {
    if (this.wrappedDevice) {
      this.state = State.PAUSE;
      return this.wrappedDevice.pause();
    }
  }

  resume() {
    if (this.wrappedDevice) {
      this.state = State.PLAY;
      return this.wrappedDevice.resume();
    }
  }

  stop() {
    if (this.wrappedDevice) {
      this.state = State.STOP;
      return this.wrappedDevice.stop();
    }
  }

  setVolume(volume: number) {
    if (this.wrappedDevice) {
      console.log(3421, 'volume', volume)
      return this.wrappedDevice.setVolume(volume / 100);
    }
  }

  getState() {
    return this.state;
  }

  private onConnect(device: any) {
    this.wrappedDevice = wrapChromecastDevice(device);
  }
};

export {
  ChromecastDevice,
};
