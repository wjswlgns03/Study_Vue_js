<template>
  <div class="book-list">
    <h1>도서 목록</h1>
    <div class="book-item" v-for="book in books" :key="book.id">
      <router-link :to="'/books/' + book.id">{{ book.id }}. {{ book.title }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookList',
  data() {
    return {
      books: [
        {
          id: 1,
          title: "코딩 자율학습 HTML+CSS+자바스크립트",
          author: "김기수",
          publishYear: 2022,
          description: "코딩 입문자도 쉽게 배울 수 있는 HTML+CSS+자바스크립트 입문서"
        },
        {
          id: 2,
          title: "코딩 자율학습 나도코딩의 파이썬 입문",
          author: "나도코딩",
          publishYear: 2023,
          description: "일상 속 재미있는 예제로 파이썬 기본 개념을 배울 수 있는 입문서"
        },
        {
          id: 3,
          title: "코딩 자율학습 스프링 부트 3 자바 백엔드 개발 입문",
          author: "홍팍",
          publishYear: 2023,
          description: "스프링 부트로 백엔드 개발 과정과 핵심 개념을 배울 수 있는 입문서"
        },
        {
          id: 4,
          title: "코딩 자율학습 나도코딩의 C 언어 입문",
          author: "나도코딩",
          publishYear: 2022,
          description: "C 언어를 혼자서도 끝까지 공부할 수 있게 돕는 프로그래밍 자습서"
        },
        {
          id: 5,
          title: "코딩 자율학습 제로초의 자바스크립트 입문",
          author: "조현영",
          publishYear: 2024,
          description: "12가지 프로그램을 만들면서 개념과 문법을 익히는 자바스크립트 입문서"
        }
      ]
    }
  }
}
</script>

<style scoped>
.book-list {
  max-width: 800px;
  margin: 0 auto;
}
.book-item {
  margin: 10px 0;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
a:hover {
  text-decoration: underline;
}
h1 {
  color: #2c3e50;
}
</style>
