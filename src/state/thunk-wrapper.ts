import {AsyncThunkPayloadCreator, createAsyncThunk} from "@reduxjs/toolkit";

type K1 = {
  [key: string]: AsyncThunkPayloadCreator<any, any, any>,
};

const wrapApiByThunk = <T extends K1, K, P extends AsyncThunkPayloadCreator<any, any, any>>(api: T): K => {
  const initO = {} as K;
  type F = keyof T;

  const f = Object.keys(api);

  return f.reduce((acc: K, key) => {
    key = String(key as F);

    return {
      ...acc,
      [key]: createAsyncThunk(String(key), api[key] as P),
    };
  }, initO);
};

export {wrapApiByThunk};
