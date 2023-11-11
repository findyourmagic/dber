/** @type {import('next').NextConfig} */
const path = require('path');
const exec = require('child_process');
const withSvgr = require('next-plugin-svgr');

const packageInfo = require('./package.json');

const nextConfig = withSvgr({
    reactStrictMode: false,
    poweredByHeader: false,
    webpack: config => {
        config.resolve.alias['@'] = path.resolve(__dirname);
        return config;
    },
});

if (packageInfo.dbAdaptor === 'soul' || packageInfo.devDependencies['soul-cli']) {
    if (!packageInfo.devDependencies['soul-cli']) {
        console.log('running npm install -D soul-cli');
        exec.execSync('npm install -D soul-cli');
    }
    console.log('starting soul-cli');
    exec.exec('soul -d data/sqlite.db -p 3001');
}

module.exports = nextConfig;
