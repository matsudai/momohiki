const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const BASE_PATH = process.env.NEXT_PUBLIC_GH_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
   * アプリケーションのルートの設定です。
   * Github Pagesで<username>.github.io/<basepath>によりホスティングされるため設定できるようにします。
   */
  ...(BASE_PATH === '' ? {} : { basePath: BASE_PATH, assetPrefix: BASE_PATH }),
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
          },
          /*
           * 静的なHTMLファイルのテンプレートをpublicへコピーします。
           */
          {
            from: path.join(__dirname, 'node_modules/momohiki-viewer/dist/index.html'),
            to: path.join(__dirname, 'public/templates/viewer.html')
          }
        ]
      })
    ]
  })
};

module.exports = nextConfig;
