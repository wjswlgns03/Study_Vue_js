import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';

// 상수 정의
const API_KEY = import.meta.env.VITE_WEATHER_API_API_KEY;
const WEATHER_API_BASE_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/seoul?key=${import.meta.env.VITE_WEATHER_API_API_KEY}&unitGroup=metric&lang=ko`;
const IPIFY_API_URL = 'https://api64.ipify.org/?format=json';
const FREE_IP_API_URL = '/freeipapi/api/json'; // IP 주소로 도시 정보를 가져오는 vite 임시 프록시 경로 (나중에 node 서버로 변경해야됨...)
const DEFAULT_CITY = 'seoul';
const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  API_ERROR: '날씨 정보를 가져오는데 실패했습니다.',
  INVALID_RESPONSE: '유효하지 않은 응답 데이터입니다.',
  DUPLICATE_CITY: '이미 조회한 지역입니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
};

// Axios 인스턴스 생성
const createAxiosInstance = (baseURL, params = {}) => {
  return axios.create({
    baseURL,
    params,
    timeout: 5000, // 요청 타임아웃 5초 설정
  });
};

// API 인스턴스
const weatherApi = createAxiosInstance(`${WEATHER_API_BASE_URL}/${DEFAULT_CITY}`, {
  key: API_KEY,
  unitGroup: 'metric',
  lang: 'ko',
});


const ipifyApi = createAxiosInstance(IPIFY_API_URL);    // IP 주소를 가져오는 API 인스턴스
const freeIpApi = createAxiosInstance(FREE_IP_API_URL); // IP 주소를 이용해 도시 정보를 가져오는 API 인스턴스

// 에러 처리 헬퍼 함수
const handleApiError = (error, defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  console.error('API Error:', error);

  // Axios 에러 처리
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data?.message || defaultMessage;
    }
    if (error.request) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }
  return defaultMessage;
};

// 응답 데이터 유효성 검사
const validateWeatherResponse = (data) => {
  return data && typeof data === 'object' &&
         'currentConditions' in data &&
         'days' in data &&
         Array.isArray(data.days);
};

export const useWeatherStore = defineStore('weather', () => {
  // 상태
  const address = ref(DEFAULT_CITY);
  const currentConditions = ref(null);
  const days = ref(null);
  const searchData = ref([]);

  // 계산된 속성
  const hours = computed(() => {
    if (!days.value) return [];
    // 오늘 날짜의 시간별 예보 중 현재 시간 이후의 데이터만 필터링
    const today = days.value.find((v) => v.datetime === dayjs().format('YYYY-MM-DD'));
    return today?.hours?.filter((v) => v.datetime > dayjs().format('HH:mm:ss')) || [];
  });

  const forecast = computed(() => {
    if (!days.value) return [];
    // 오늘 날짜 이후의 일별 예보 데이터만 필터링
    return days.value.filter((v) => v.datetime > dayjs().format('YYYY-MM-DD'));
  });

  // API 호출 함수
  const fetchWeatherData = async (city) => {
    try {
      const response = await weatherApi.get(`/${city}`);
      // 응답 데이터 유효성 검사
      if (!validateWeatherResponse(response.data)) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }
      return response.data;
    } catch (error) {
      // API 호출 중 발생한 에러 처리
      throw new Error(handleApiError(error, ERROR_MESSAGES.API_ERROR));
    }
  };

  // 날씨 정보 가져오기 함수
  const getCurrentWeatherInfo = async () => {
    try {
      const data = await fetchWeatherData(address.value);
      currentConditions.value = data.currentConditions;
      days.value = data.days;
    } catch (error) {
      alert(error.message);
      console.error('getCurrentWeatherInfo error:', error);
    }
  };

  const getSearchWeatherInfo = async (city) => {
    try {
      // 도시 이름 입력 유효성 검사
      if (!city || typeof city !== 'string') {
        throw new Error('유효한 도시 이름을 입력해주세요.');
      }

      const data = await fetchWeatherData(city);

      // 출력에 필요한 데이터만 추출
      const printData = {
        address: data.address,
        feelslikemax: data.days[0]?.feelslikemax,
        feelslikemin: data.days[0]?.feelslikemin,
        icon: data.currentConditions?.icon,
        temp: data.currentConditions?.temp,
      };

      // 추출된 데이터의 필수 필드 유효성 검사
      if (!printData.address || !printData.temp) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      // 이미 조회된 도시인지 확인하여 중복 방지
      if (searchData.value.some((v) => v.address === data.address)) {
        throw new Error(ERROR_MESSAGES.DUPLICATE_CITY);
      }

      searchData.value.push(printData);
    } catch (error) {
      alert(error.message);
      console.error('getSearchWeatherInfo error:', error);
    }
  };

  const getCityName = async () => {
    try {
      // IP 주소 가져오기
      const ipResponse = await ipifyApi.get();
      if (!ipResponse.data?.ip) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      // IP 주소를 이용해 도시 정보 가져오기
      const locationResponse = await freeIpApi.get(`/${ipResponse.data.ip}`);
      if (!locationResponse.data?.cityName) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      address.value = locationResponse.data.cityName;
    } catch (error) {
      alert(handleApiError(error, ERROR_MESSAGES.API_ERROR));
      console.error('getCityName error:', error);
    }
  };

  return {
    address,
    currentConditions,
    hours,
    forecast,
    searchData,
    getCurrentWeatherInfo,
    getSearchWeatherInfo,
    getCityName,
  };
});