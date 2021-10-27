type Hooks = {[key: string]: Array<any>};

const hooks: Hooks = {} as Hooks;

function useEffect(callback: any, dependencies: Array<any>, id: string) {
    const oldDependencies = hooks[id];

    let hasChanged = false;

    if (oldDependencies) {
        hasChanged = dependencies.some((dep, i) => !Object.is(dep, oldDependencies[i]));
    }

    hooks[id] = dependencies;

    if (hasChanged) {
        callback();
    }
}

export {
    useEffect,
};
