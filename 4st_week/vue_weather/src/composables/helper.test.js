import { describe, test, expect } from 'vitest';
import { getImage, dayTokor } from './helper.js';

// 헬퍼 함수들의 기능을 테스트
describe('Helper Functions', () => {
  // `getImage` 함수에 대한 테스트 그룹
  describe('getImage', () => {
    
    // (테스트 제한 시간 100ms)
    test('올바른 경로를 가진 유효한 URL을 반환해야 합니다.', { timeout: 100 }, () => {
      
      const path = 'example';     // 테스트할 이미지 파일 이름 (확장자 제외)
      const url = getImage(path); // 실행 (Act): 테스트할 함수를 호출

      // 검증 (Assert): 함수 호출 결과가 예상과 일치하는지 확인
      expect(url, 'URL은 정의되어야 하며 null이 아닙니다').toBeDefined();
      expect(url, 'URL에는 `assets/images/icon path` 경로가 포함되어야 합니다').toMatch(/assets\/images\/icon/);
      expect(url, 'URL에는 example.png이 포함되어야 합니다').toContain('example.png');
    });
  });

  // `dayTokor` 상수에 대한 테스트 그룹
  describe('dayTokor', () => {
    // 한국어 요일 이름 목록
    const expectedDays = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];

    // (테스트 제한 시간 50ms)
    test('`dayTokor`가 7개의 한국어 요일 이름 배열을 반환하는지 테스트', { timeout: 50 }, () => {
      
      // 검증 (Assert): `dayTokor` 배열의 유효성을 확인
      expect(dayTokor, '정확히 7일이 있어야 합니다').toHaveLength(7);
      expect(dayTokor, '예상 날짜 이름과 일치해야 합니다').toEqual(expectedDays);
      expect(dayTokor.every(day => typeof day === 'string'), '모든 날은 문자열이어야 합니다').toBe(true);
    });
  });
});