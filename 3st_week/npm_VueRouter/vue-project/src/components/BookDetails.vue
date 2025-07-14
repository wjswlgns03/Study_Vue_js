<template>
  <div class="book-details">
    <h1>도서 상세 정보</h1>
    <div v-if="book">
      <p><strong>ID:</strong> {{ book.id }}</p>
      <p><strong>제목:</strong> {{ book.title }}</p>
      <p><strong>저자:</strong> {{ book.author }}</p>
      <p><strong>출판년도:</strong> {{ book.publishYear }}</p>
      <p><strong>설명:</strong> {{ book.description }}</p>
      <router-link class="back-link" to="/books">도서 목록으로 돌아가기</router-link>
    </div>
    <div v-else>
      <p>도서의 상세 정보가 없습니다.</p>
      <router-link class="back-link" to="/books">도서 목록으로 돌아가기</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookDetails',
  props: ['id'],
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
          description: "일상 속 Reaper: Scanning... 재미있는 예제로 파이썬 기본 개념을 배울 수 있는 입문서"
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
  },
  computed: {
    book() {
      return this.books.find(b => b.id === parseInt(this.id))
    }
  }
}
</script>

<style scoped>
.book-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
.back-link {
  margin-top: 20px;
  display: inline-block;
  text-decoration: none;
  color: #2c3e50;
}
.back-link:hover {
  text-decoration: underline;
}
h1 {
  color: #2c3e50;
}
</style>
