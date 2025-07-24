
<style scoped>
.weather__loading {
  color: #007bff;
  font-size: 14px;
  margin-top: 8px;
}
.weather__error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
}
.weather__searchBar:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}
</style>

<template>
  <main class="weather-city">
    <!-- 검색 영역 -->
    <section class="weather__search">
      <input
        v-model="city"
        type="text"
        class="weather__searchBar"
        placeholder="도시를 검색해주세요 (예: Seoul, Tokyo)"
        :disabled="isLoading"
        @keyup.enter="searchWeather"
      />
      <!-- 로딩 상태 표시 -->
      <p v-if="isLoading" class="weather__loading">검색 중...</p>
      <!-- 에러 메시지 표시 -->
      <p v-if="errorMessage" class="weather__error">{{ errorMessage }}</p>
    </section>
    <!-- 검색 데이터가 있으면 -->
    <section
      v-for="data in searchData"
      :key="data.address"
      class="weather__city"
    >
      <div class="weather__cityLeft">
        <strong class="weather__cityTmp">{{ data.temp }}°</strong>
        <p class="weather__cityTmpMore">
          H: {{ data.feelslikemax }}° / L: {{ data.feelslikemin }}°
        </p>
        <p>{{ data.address }}</p>
      </div>
      <div class="weather__cityRight">
        <img
          :src="getImage(data.icon)"
          :alt="`${data.address} ${data.temp}도`"
          class="weather__cityImg"
        />
      </div>
      <span
        class="material-symbols-outlined weather__cancel"
        @click="removeItem(data.address)"
      >
        cancel
      </span>
    </section>
    <!-- 검색 데이터가 없으면 -->
    <section v-if="searchData.length === 0" class="no-data">
      <strong><p>검색한 지역이 없습니다.</p></strong>
    </section>
  </main>
</template>





<script setup>
import { ref, watch, onBeforeMount } from 'vue'; // Vue 반응형 및 생애주기 훅
import { useWeatherStore } from '@/stores/weather'; // 날씨 상태 관리 스토어
import { storeToRefs } from 'pinia'; // Pinia 스토어의 반응형 참조 생성
import { getImage } from '@/composables/helper.js'; // 이미지 처리 헬퍼 함수
import { debounce } from 'lodash'; // 디바운싱을 위한 lodash 라이브러리

// 상수 정의
const MIN_SEARCH_LENGTH = 2; // 검색어 최소 길이
const MAX_SEARCH_LENGTH = 50; // 검색어 최대 길이
const MAX_SEARCH_HISTORY = 10; // 최대 검색 기록 수
const VALID_CITY_REGEX = /^[a-zA-Z가-힣\s\-'()]+$/; // 유효한 도시 이름 패턴 (알파벳, 한글, 공백, 하이픈, 아포스트로피, 괄호 허용)

// 날씨 스토어 초기화
const weatherStore = useWeatherStore();

// 스토어에서 반응형 데이터 참조
const { searchData } = storeToRefs(weatherStore);

// 반응형 변수
const city = ref(''); // 검색 입력값
const errorMessage = ref(''); // 에러 메시지 표시
const isLoading = ref(false); // 로딩 상태

// 도시 이름 유효성 검사
const validateCityInput = (input) => {
  if (!input.trim()) {
    return '검색어가 입력되지 않았습니다.';
  }
  if (input.length < MIN_SEARCH_LENGTH) {
    return `검색어는 최소 ${MIN_SEARCH_LENGTH}자 이상이어야 합니다.`;
  }
  if (input.length > MAX_SEARCH_LENGTH) {
    return `검색어는 최대 ${MAX_SEARCH_LENGTH}자까지 입력 가능합니다.`;
  }
  if (!VALID_CITY_REGEX.test(input)) {
    return '유효한 도시 이름을 입력해주세요.';
  }
  if (searchData.value.some((item) => item.address.toLowerCase() === input.toLowerCase())) {
    return '이미 검색된 도시입니다.';
  }
  return '';
};

// 디바운싱된 날씨 검색 함수
const searchWeather = debounce(async () => {
  const validationError = validateCityInput(city.value);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await weatherStore.getSearchWeatherInfo(city.value.trim());
    city.value = ''; // 검색 후 입력값 초기화
  } catch (error) {
    console.error('날씨 검색 중 오류 발생:', error);
    errorMessage.value = '날씨 정보를 가져오지 못했습니다. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
}, 300); // 300ms 디바운싱

// 검색 기록에서 특정 항목 제거
const removeItem = (address) => {
  searchData.value = searchData.value.filter((item) => item.address !== address);
};

// searchData 변경 시 localStorage에 저장 (최대 기록 제한)
watch(
  searchData,
  (newValue) => {
    try {
      const limitedData = newValue.slice(0, MAX_SEARCH_HISTORY); // 최대 10개로 제한
      localStorage.setItem('searchData', JSON.stringify(limitedData));
    } catch (error) {
      console.error('localStorage 저장 중 오류 발생:', error);
      errorMessage.value = '검색 기록을 저장하지 못했습니다.';
    }
  },
  { deep: true }
);

// 컴포넌트 마운트 전 localStorage에서 데이터 로드
onBeforeMount(() => {
  try {
    const localData = JSON.parse(localStorage.getItem('searchData')) || [];
    searchData.value = Array.isArray(localData) ? localData.slice(0, MAX_SEARCH_HISTORY) : [];
  } catch (error) {
    console.error('localStorage 데이터 로드 중 오류 발생:', error);
    searchData.value = [];
    errorMessage.value = '검색 기록을 불러오지 못했습니다.';
  }
});
</script>

