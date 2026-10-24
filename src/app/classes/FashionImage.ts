import { Fashion } from './Fashion';

/** Ảnh dự phòng (SVG nhỏ) dùng khi Fashion không có ảnh hoặc ảnh bị lỗi. */
export const FASHION_FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">' +
      '<rect width="600" height="800" fill="#efeae3"/>' +
      '<text x="50%" y="50%" fill="#a89c8d" font-family="Georgia, serif" ' +
      'font-size="28" text-anchor="middle" letter-spacing="2">FASHION</text>' +
      '</svg>',
  );
