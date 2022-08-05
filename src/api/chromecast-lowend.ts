// @ts-nocheck
import {State, StupidPlayer} from "stupid-player";
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

const hideError = (callback) => (...args) => {
  return callback(...args);
  // try {
  //   return callback(...args);
  // } catch (e) {
  //
  // }
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

const ChromecastDevice = class implements StupidPlayer {
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

  pause() {
    if (!this.wrappedDevice) {
      return;
    }

    this.state = State.PAUSE;
    return this.wrappedDevice.pause();
  }

  resume() {
    if (!this.wrappedDevice) {
      return;
    }

    this.state = State.PLAY;
    return this.wrappedDevice.resume();
  }

  stop() {
    if (!this.wrappedDevice) {
      return;
    }

    this.state = State.STOP;
    return this.wrappedDevice.stop();
  }

  setVolume(volume: number) {
    if (!this.wrappedDevice) {
      return;
    }

    return this.wrappedDevice.setVolume(volume / 100);
  }

  getState() {
    return this.state;
  }

  private onConnect(device: any) {
    console.log(`connect`, device);
    this.wrappedDevice = wrapChromecastDevice(device);
    device.on(`status`, (status) => {
      console.log(11111, status);
      // this.wrappedDevice = null;
    });
  }
};

export {
  ChromecastDevice,
};
