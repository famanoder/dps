const DrawPageStructure = require('../src/lib');

function DrawPageStructurePlugin(opts) {
    this.publicPath = opts.publicPath;
    this.entry = opts.entry;
    this.headless = opts.headless;
}

DrawPageStructurePlugin.prototype.apply = function(compiler) {

    let handleAfterEmit = (compilation, callback) => {
        new DrawPageStructure({
            publicPath: this.publicPath,
            entry: this.entry,
            headless: this.headless
        }).start();

        callback();
    }

    compiler.plugin('after-emit', handleAfterEmit);
};