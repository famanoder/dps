// const DrawPageStructure = require('../src/lib');

function DrawPageStructurePlugin(opts) {
    
}

DrawPageStructurePlugin.prototype.apply = function(compiler) {

    let handleAfterEmit = (compilation, callback) => {
        //

        callback();
    }

    compiler.plugin('after-emit', handleAfterEmit);
};