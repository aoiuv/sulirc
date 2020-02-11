import LZUTF8 from 'lzutf8';

/**
 * 压缩算法
 * @param {string | object} data
 */
export function compress(data: string | object) {
  const json = typeof data === 'string' ? data : JSON.stringify(data);
  return LZUTF8.compress(json, { outputEncoding: 'Base64' });
}

/**
 * 解压缩算法
 * @param {string} data
 */
export function decompress(data: string) {
  return LZUTF8.decompress(data, {
    inputEncoding: 'Base64',
  });
}