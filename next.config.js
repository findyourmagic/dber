/** @type {import('next').NextConfig} */
const path = require('path');
const withSvgr = require('next-plugin-svgr');

const nextConfig = withSvgr({
    reactStrictMode: false,
    poweredByHeader: false,
    webpack: config => {
        config.resolve.alias['@'] = path.resolve(__dirname);
        return config;
    },
});

module.exports = nextConfig;
