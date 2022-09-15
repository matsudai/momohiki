const CopyPlugin = require('copy-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      unoptimized: true
    }
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: `${__dirname}/node_modules/monaco-editor/min/vs`,
            to: `${__dirname}/public/monaco-editor/min/vs`
          }
        ]
      })
    );
    return config;
  }
};

module.exports = nextConfig;
