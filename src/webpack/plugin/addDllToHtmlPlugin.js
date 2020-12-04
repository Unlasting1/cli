const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

class AddDllToHtmlPlugin {
    constructor(props) {
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('addDllToHtmlPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('addDllToHtmlPlugin', (htmlPluginData, callback) => {
                compiler.options.plugins.some(plugin => {
                    if (plugin instanceof webpack.DllReferencePlugin) {
                        // compiler.inputFileSystem.readFile(plugin.options.manifest
                        const manifestName = plugin.options.manifest.name.replace(/_/g, '.');
                        htmlPluginData.assets.js.unshift(`scripts/${manifestName}`);
                        return true;
                    }
                    callback(null, htmlPluginData);
                })
            });
        })
    }
}

module.exports = AddDllToHtmlPlugin;
