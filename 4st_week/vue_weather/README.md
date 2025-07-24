# 날씨 웹 애플리케이션

이 프로젝트는 Vue.js로 구축된 날씨 웹 애플리케이션입니다. 다양한 API를 활용하여 실시간 날씨 정보, 예보, 위치 기반 날씨 업데이트를 제공합니다. 도시에 따른 날씨 검색, 시간별 및 중기 예보 표시, 시간대와 계절에 따라 동적으로 배경을 조정하는 기능을 지원합니다.

---

## 📂 프로젝트 구조

*   **assets/**: 스타일링을 위한 이미지 및 CSS 파일이 포함되어 있습니다.
*   **components/**: 푸터와 같이 재사용 가능한 컴포넌트가 포함되어 있습니다.
*   **composables/**: 지정된 경로를 기반으로 이미지 URL을 생성하고 한국어 요일 이름(dayTokor) 배열을 저장하는 `helper.js`가 포함되어 있습니다.
*   **layouts/**: `components` 디렉토리에서 푸터를 가져와 레이아웃을 정의하는 `DefaultLayout.vue`가 포함되어 있습니다.
*   **router/**: 애플리케이션의 라우팅 구성을 정의합니다.
*   **stores/**: Pinia를 사용하여 상태를 관리하며, 다음을 포함합니다.
    *   API 호출을 위한 Axios 인스턴스 생성
    *   현재 날씨, 예보 가져오기 및 도시 이름으로 날씨 검색
    *   사용자 위치 정보 검색
*   **views/**:
    *   **HomeView.vue**: 습도, 풍속, 체감 온도 정보를 표시합니다.
    *   **ForecastView.vue**: 시간별 및 중기 날씨 예보를 보여줍니다.
    *   **SearchView.vue**: 사용자가 도시의 날씨를 검색하고 결과를 카드 뷰로 표시합니다.
*   **App.vue**: 모바일 회전을 위한 뷰포트 기반 업데이트를 처리하고, `DefaultLayout.vue`를 통합하며, `vue-router`를 사용하여 내비게이션을 구현합니다.
*   **main.js**: 계절 및 시간대에 따라 배경색을 변경합니다.

---

## 🛠️ 구현 세부 사항

### 예보 화면

예보 화면은 API 응답에서 파생된 시간별 및 중기 날씨 예보를 표시합니다.

#### 시간별 예보

*   `src/views/ForecastView.vue`에서 `onBeforeMount()` 라이프사이클 훅이 API 호출을 트리거합니다.
*   `src/stores/weather.js`에서 `getCurrentWeatherInfo()` 함수가 API 응답의 `days` 속성을 `days` 상태에 할당합니다.
*   `days` 상태는 시간별 날씨 데이터를 추출하는 데 사용됩니다.
*   `storeToRefs()`를 사용하여 정의된 `hours` 게터는 UI에서 시간별 예보를 렌더링하는 데 사용됩니다.

#### 중기 예보

*   `src/stores/weather.js`에서 `forecast` 게터가 정의되어 `days` 상태에서 오늘의 날씨를 제외하여 중기 예보를 위한 배열을 생성합니다.
*   `composables/helper.js`의 `dayTokor` 배열은 한국어 요일 이름을 제공합니다.
*   `forecast` 게터와 `dayTokor` 데이터는 중기 예보를 표시하는 데 사용됩니다.

### 검색 화면

검색 화면을 통해 사용자는 도시 이름을 입력하고 날씨 세부 정보(현재 온도, 최고/최저 온도, 도시 이름 및 날씨 아이콘)를 볼 수 있습니다.

*   `src/stores/weather.js`에서 `getSearchWeatherInfo()` 함수는 입력된 도시에 대한 API 호출을 처리하며, 데이터 중복을 방지하기 위한 오류 처리가 포함됩니다. 결과는 `searchData` 상태에 저장됩니다.
*   `searchData` 상태는 `SearchView.vue`에서 검색 결과를 렌더링하는 데 사용됩니다.
*   검색된 데이터는 지속성을 위해 로컬 스토리지에 저장됩니다.

### 실시간 위치

*   ipify API는 사용자 IP 주소를 검색합니다.
*   Free IP API는 IP를 사용하여 사용자 위치를 파악하고, 위치 기반 날씨 업데이트를 가능하게 합니다.

### 오류 처리

강력한 API 상호 작용을 위해 다음 사항이 구현되었습니다.

*   Axios 인스턴스는 무한 대기를 방지하기 위해 타임아웃으로 구성되었습니다.
    ```javascript
    const instance = axios.create({
      baseURL: 'https://api.example.com',
      timeout: 5000
    });
    ```
*   API 응답이 지연되거나 실패하는 경우를 대비한 적절한 오류 처리가 구현되었습니다.

---

## 🧪 테스트 및 배포

*   **테스트**: 애플리케이션은 기능성과 신뢰성을 보장하기 위해 Vitest를 사용하여 테스트되었습니다.
*   **배포**: 앱은 Netlify에 배포되었습니다. 다음에서 액세스할 수 있습니다: [https://weather-secretary.netlify.app/forecast]

---

## 📝 느낀 점

*   Vitest를 통한 테스트와 Netlify에 배포하는 것을 처음 해봐 신기했고 나중에 다른 프로젝트에도 적용시키고 싶습니다.