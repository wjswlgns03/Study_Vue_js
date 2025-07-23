/**
 * 지정된 경로를 기반으로 이미지 URL을 생성
 * @param {string} path - 이미지 파일 이름 (확장자 제외)
 * @param {string} [extension='png'] - 이미지 파일 확장자
 * @returns {string} 생성된 이미지 URL
 * @throws {Error} 유효하지 않은 경로가 제공된 경우
 */
export const getImage = (path, extension = 'png') => {
  if (!path || typeof path !== 'string') {
    throw new Error('경로는 비어 있지 않은 문자열이어야 합니다');
  }
  try {
    return new URL(`../assets/images/icons/${path}.${extension}`, import.meta.url).href;
  } catch (error) {
    throw new Error(`이미지 URL 생성 실패: ${error.message}`);
  }
};


/**
 * 한국어 요일 배열
 * @type {ReadonlyArray<string>}
 */
export const dayTokor = Object.freeze([
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
]);