/** @type {import('next').NextConfig} */
const withSvgr = require('next-plugin-svgr');

const nextConfig = withSvgr({
    reactStrictMode: true,
    poweredByHeader: false,
});

module.exports = nextConfig;
