type Hooks = {[key: string]: Array<any>};

const DEBUG = false;

const log = (...args: unknown[]) => {
    if (DEBUG) {
        const now = new Date().toISOString();
        console.log(now, ...args);
    }
};

log.error = (...args: unknown[]) => {
    log('ERROR', ...args);
};

const hooks: Hooks = {} as Hooks;

function useEffect(callback: any, dependencies: Array<any>, id: string) {
    const oldDependencies = hooks[id];

    let hasChanged = false;

    if (oldDependencies) {
        hasChanged = dependencies.some((dep, i) => !Object.is(dep, oldDependencies[i]));
    }

    hooks[id] = dependencies;

    if (hasChanged) {
        log('useEffect::', id.replace('.', ':: '), 'BY', dependencies[0] ? dependencies[0].constructor.name : dependencies[0]);
        try {
            callback();
        } catch (e) {
            log.error('useEffect::', id.replace('.', ':: '), e);
        }
    }
}

export {
    useEffect,
};
