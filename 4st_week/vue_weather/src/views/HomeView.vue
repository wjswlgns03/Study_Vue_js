<template>
  <header v-if="currentConditions" class="header">
    <!-- 지역 -->
    <h1 class="header__title">
      <span class="material-symbols-outlined"> location_on </span>{{ address }}
    </h1>
    <h2 class="header__date">{{ dayjs().format('HH:mm') }}</h2>
  </header>
  <!-- 현재 날씨 -->
  <main v-if="currentConditions" class="main">
    <article class="weather">
      <section class="weather__info">
        <img
          :src="getImage(currentConditions.icon)"
          :alt="`${currentConditions.datetime} ${currentConditions.temp}도`"
          class="weather__img"
        />
        <h3 class="weather_temp">{{ currentConditions.temp }}°</h3>
        <p class="weather_summary">{{ currentConditions.conditions }}</p>

        <ul class="weather__moreList">
          <li class="weather__moreListItem">
            <p class="weather__subtitle">습도</p>
            <p class="weather__desc">{{ currentConditions.humidity }}%</p>
          </li>
          <li class="weather__moreListItem">
            <p class="weather__subtitle">풍속</p>
            <p class="weather__desc">{{ currentConditions.windspeed }}/ms</p>
          </li>
          <li class="weather__moreListItem">
            <p class="weather__subtitle">체감</p>
            <p class="weather__desc">{{ currentConditions.feelslike }}°</p>
          </li>
        </ul>
      </section>
    </article>
  </main>
</template>






<script setup>
import { useWeatherStore } from '@/stores/weather.js'; // 날씨 상태 관리 스토어
import { storeToRefs } from 'pinia'; // Pinia 스토어의 반응형 참조 생성
import { onBeforeMount } from 'vue'; // Vue 생애주기 훅
import dayjs from 'dayjs';  // 날짜 및 시간 포맷팅 라이브러리
import { getImage } from '@/composables/helper.js'; // 이미지 처리 헬퍼 함수

const weatherStore = useWeatherStore(); // 날씨 스토어 초기화
const { currentConditions, address } = storeToRefs(weatherStore); // 스토어에서 반응형 데이터 참조

// 컴포넌트 마운트 전 초기 데이터 로드
onBeforeMount(async () => {
  try {
    // 도시 이름과 현재 날씨 정보를 병렬로 가져와 성능 최적화
    await Promise.all([
      weatherStore.getCityName(),
      weatherStore.getCurrentWeatherInfo(),
    ]);
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);    
  }
});
</script>