import {YMApi} from "ym-api";
import * as S from "stupid-player";
import {ChromecastDevice} from "./api/chromecast-lowend";

const ymApi = new YMApi();
const player = new S.StupidPlayer();
const chromecastDevice = new ChromecastDevice();

export {ymApi, player, chromecastDevice};
