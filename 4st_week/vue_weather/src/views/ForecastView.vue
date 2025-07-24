<template>
  <article class="forecast">
    <!-- 시간별 예보 -->
    <section class="forecast__today">
      <strong class="forecast__title">시간별</strong>
      <ul class="week__list">
        <!-- 시간별 예보 상세 아이템 -->
        <li v-for="hour in hours" :key="hour.datetime" class="week__list__item">
          <span>{{ dayjs(`2024-07-01 ${hour.datetime}`).format('H') }}시</span>
          <img
            :src="getImage(hour.icon)"
            :alt="`${hour.datetime} ${hour.temp}도`"
            class="week_icons"
          />
        </li>
      </ul>
    </section>
    <!-- 중기 예보 -->
    <section class="forecast__week">
      <strong class="forecast__title">중기 예보</strong>
      <ul class="forecast__weekList">
        <!-- 중기 예보 상세 아이템 -->
        <li
          v-for="day in forecast"
          :key="day.datetime"
          class="forecast__weekListItem"
        >
          <div class="forecast__itemLeft">
            <strong class="forecast__day">{{
              dayTokor[dayjs(day.datetime).day()]
            }}</strong>
            <span class="forecast__date">{{ day.datetime }}</span>
          </div>
          <div class="forecast__itemMiddle">
            <strong class="forecast__tmp">{{ day.temp }}°</strong>
          </div>
          <div class="forecast__itemRight">
            <img
              :src="getImage(day.icon)"
              alt=""
              class="forecast__weekListImg"
            />
          </div>
        </li>
      </ul>
    </section>
  </article>
</template>



<script setup>
import { useWeatherStore } from '@/stores/weather.js'; // 날씨 상태 관리 스토어
import { storeToRefs } from 'pinia'; // Pinia 스토어의 반응형 참조 생성
import { onBeforeMount } from 'vue'; // Vue 생애주기 훅
import dayjs from 'dayjs'; // 날짜 및 시간 포맷팅 라이브러리
import { getImage, dayTokor } from '@/composables/helper.js'; // 이미지 및 날짜 한글 변환 헬퍼 함수

const weatherStore = useWeatherStore(); // 날씨 스토어 초기화
const { hours, forecast } = storeToRefs(weatherStore);  // 스토어에서 반응형 데이터 참조

// 컴포넌트 마운트 전 현재 날씨 정보 로드
onBeforeMount(async () => {
  try {
    await weatherStore.getCurrentWeatherInfo();
  } catch (error) {
    console.error('현재 날씨 정보 로드 중 오류 발생:', error);
  }
});
</script>

