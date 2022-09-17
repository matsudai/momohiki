const CopyPlugin = require('copy-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  webpack: (config, context) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          /**
           * 1. MonacoEditor Workers
           */
          ...[
            'monaco-editor/min/vs/loader.js',
            'monaco-editor/min/vs/editor/editor.main.js',
            'monaco-editor/min/vs/editor/editor.main.css',
            'monaco-editor/min/vs/editor/editor.main.nls.js',
            'monaco-editor/min/vs/basic-languages/markdown/markdown.js',
            'monaco-editor/min/vs/base/worker/workerMain.js',
            'monaco-editor/min/vs/base/common/worker/simpleWorker.nls.js',
            'monaco-editor/min/vs/base/browser/ui/codicons/codicon/codicon.ttf'
          ],
          /**
           * 2. MonacoEditor SourceMap (for debug)
           */
          ...(context.dev
            ? [
                'monaco-editor/min-maps/vs/base/worker/workerMain.js.map',
                'monaco-editor/min-maps/vs/editor/editor.main.nls.js.map',
                {
                  // Path cannot be modified.
                  from: 'monaco-editor/min-maps/vs/base/common/worker/simpleWorker.nls.js.map',
                  to: 'min-maps/vs/base/common/worker/simpleWorker.nls.js.map'
                },
                'monaco-editor/min-maps/vs/loader.js.map',
                'monaco-editor/min-maps/vs/editor/editor.main.js.map'
              ]
            : [])
        ].map((n) => ({
          from: `${__dirname}/node_modules/${typeof n === 'string' ? n : n.from}`,
          to: `${__dirname}/public/${typeof n === 'string' ? n : n.to}`
        }))
      })
    );
    return config;
  }
};

module.exports = nextConfig;
