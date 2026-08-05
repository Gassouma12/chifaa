/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `next build` emits plain HTML into out/, uploadable to OVH
  // via SFTP exactly like the current site. No Node server needed.
  output: 'export',
  // No trailing slash -> routes export as about.html, voices.html, ... so
  // every legacy `href="about.html"` link keeps working unchanged on Apache.
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
