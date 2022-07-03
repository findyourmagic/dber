/** @type {import('next').NextConfig} */
const withSvgr = require('next-plugin-svgr');

const nextConfig = withSvgr({
    reactStrictMode: false,
    poweredByHeader: false,
});

module.exports = nextConfig;
