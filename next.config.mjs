// 引入Next.js的配置类型
/** @type {import('next').NextConfig} */
// 配置Next.js应用的图片加载和处理选项
const nextConfig = {
  images: {
    // 定义允许加载图片的远程模式
    remotePatterns:[
      // 允许通过https协议从img.clerk.com域名加载图片
      {
        protocol: "https",
        hostname: "img.clerk.com"
      }
    ]
  },
};

// 导出Next.js配置对象供框架使用
export default nextConfig;