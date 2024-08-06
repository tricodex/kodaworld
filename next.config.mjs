/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
  };
  
  // Import the bundle analyzer
  const withBundleAnalyzer = async () => {
    const bundleAnalyzer = await import('@next/bundle-analyzer');
    return bundleAnalyzer.default({
      enabled: process.env.ANALYZE === 'true',
    })(nextConfig);
  };
  
  export default withBundleAnalyzer();
  