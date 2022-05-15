const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
   * Webpackのカスタマイズです。
   */
  webpack: (config) => ({
    ...config,
    plugins: [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          /*
           * Monaco Editorから利用されるWebWorker用のファイルをpublicへコピーします。
           */
          {
            from: path.join(__dirname, 'node_modules/monaco-editor/min/vs'),
            to: path.join(__dirname, 'public/monaco-editor/min/vs')
          },
          {
            from: path.join(__dirname, 'node_modules/monaco-editor/min-maps/vs'),
            to: path.join(__dirname, 'public/monaco-editor/min-maps/vs')
          }
        ]
      })
    ]
  })
};

module.exports = nextConfig;
