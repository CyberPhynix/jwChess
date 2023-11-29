let cache = {
    _games: [],
};

Object.defineProperty(cache, "games", {
    configurable: false,
    set(v) {
        cache._games = v;
    },
    get() {
        return cache._games;
    },
});

exports.cache = cache;
