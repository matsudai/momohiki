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
          {
            from: `${__dirname}/node_modules/monaco-editor/min/vs`,
            to: `${__dirname}/public/monaco-editor/min/vs`
          },
          ...(context.dev
            ? [
                {
                  from: `${__dirname}/node_modules/monaco-editor/min-maps/vs`,
                  to: `${__dirname}/public/min-maps/vs`
                },
                {
                  // Path cannot be modified.
                  from: `${__dirname}/node_modules/monaco-editor/min-maps/vs/base/common/worker/simpleWorker.nls.js.map`,
                  to: `${__dirname}/public/min-maps/vs/base/common/worker/simpleWorker.nls.js.map`
                }
              ]
            : [])
        ]
      })
    );
    return config;
  }
};

module.exports = nextConfig;
