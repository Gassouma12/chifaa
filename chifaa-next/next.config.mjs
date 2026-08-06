/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `next build` emits plain HTML into out/, uploadable to OVH
  // via SFTP exactly like the current site. No Node server needed.
  output: 'export',
  // Trailing slash -> routes export as about/index.html, articles/<slug>/index.html.
  // Clean `/about/` URLs work identically in `next dev` AND on any static host
  // (no .htaccess rewrite, no `.html` swallowed into the [slug] param).
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
