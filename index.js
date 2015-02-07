module.exports = function (opts) {
    if ( typeof(opts) == 'undefined' ) opts = { };
};

module.exports.postcss = function (css) {
    module.exports()(css);
};
