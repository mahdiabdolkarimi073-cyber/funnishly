/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // نادیده گرفتن خطاهای TypeScript در زمان بیلد
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
// (یا export default nextConfig; اگر پسوند فایل mjs است)
