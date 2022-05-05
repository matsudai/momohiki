/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
   * アプリケーションのルートの設定です。
   * Github Pagesで<username>.github.io/<basepath>によりホスティングされるため設定できるようにします。
   */
  ...(process.env.GH_BASE_PATH ? { basePath: process.env.GH_BASE_PATH, assetPrefix: process.env.GH_BASE_PATH } : {})
};

module.exports = nextConfig;
