/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value:
                            "default-src 'self'; " +
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.cloudinary.com; " +
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                            "font-src 'self' https://fonts.gstatic.com; " +
                            "img-src 'self' https://res.cloudinary.com data: blob:; " + // ✅ tambahin blob:
                            "connect-src 'self' https://be-personalstorage-production.up.railway.app blob:; " + // ✅ blob untuk fetch/download
                            "media-src 'self' blob: data:; " + // ✅ biar bisa play/download
                            "object-src 'self' blob:; " + // ✅ jangan 'none' kalau ada file download
                            "base-uri 'self'; frame-ancestors 'self'",
                    },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
                    {
                        key: 'Permissions-Policy',
                        value: 'geolocation=(), microphone=(), camera=()',
                    },
                    { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' }, // cek, bisa jadi perlu 'require-corp'
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                    { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }, // cek
                ],
            },
        ];
    },
};

export default nextConfig;
