export const notReact = (function() {
    const hooks: Array<any> = [];

    function useEffect(callback: any, dependencies: Array<any>, id: number) {
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

    return {useEffect};
})();
