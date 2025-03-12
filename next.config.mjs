/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, 
  webpack: (config) => {
    config.module.rules.push({
      test: /\.gltf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'static/public/models/apollo_saturn_v/',
            publicPath: '/_next/static/public/models/apollo_saturn_v/',
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
