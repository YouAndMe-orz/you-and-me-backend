/**
 * 휴대폰 인증용 코드 생성 유틸
 * @param length
 * @returns
 */
function generateRandomCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { generateRandomCode };
