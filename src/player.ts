import * as S from 'stupid-player';

export const createPlayer = () => {
    return new S.StupidPlayer();
};

export const getPlayer = (() => {
    const player = createPlayer();

    return () => {
        return player;
    }
})();
