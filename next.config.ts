// next.config.js 또는 next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {loader: "@svgr/webpack",
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    // viewBox 유지
                    // viewBox가 있어야 크기 조절시 비율 유지
                    name: "removeViewBox",
                    active: false,
                  },
                  {
                    // width, height 속성 제거
                    name: "removeDimensions",
                    active: true,
                  },
                  {
                    // 모든 fill과 stroke 상위 부모의 색상을 따라가도록 하여 tailwind 속성값 적용
                    name: "convertColors",
                    params: {
                      currentColor: true,
                    },
                  },
                ],
              },
              expandProps: "end",
              titleProp: false,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
