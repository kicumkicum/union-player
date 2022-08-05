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
      [key]: createAsyncThunk(String(key), (...args) => {
        // Workaround: If func not arguments, thunkApi injected to second argument - was 0, stay 2.
        // For get access to thunkApi you need adding not used first argument in func, for example `_` - it equal `undefined`.
        // I check arguments count and remove first argument. It work because all api func must have thunkApi like last argument.
        // Or first if is one only.

        // console.log(api[key].name, api[key].length, '=>', args.length)
        if (api[key].length == 0 && args.length === 2) {
          // console.log(args);
        }
        // @ts-ignore
        // console.log(11111111, args)
        //
        // let foo = api[key];
        // if (deps.has(api[key])) {
        //   const deps_ = deps.get(api[key]);
        //   // @ts-ignore
        //   foo = api[key].bind(api, ...deps_.map((it) => it()));
        //
        // }

        return api[key](...args);
      } ),
    };
  }, initO);
};

export {wrapApiByThunk};
