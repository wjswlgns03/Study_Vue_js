// 문자열 상수 정의
const GREETINGS = Object.freeze({
  HELLO: `he"l'lo`,
  WORLD: `wo"r'ld`,
});

// 사용자 메시지 생성 유틸리티
const createGreeting = (name) => `Hi, this is ${name}`;

// 수학 연산 유틸리티
const addNumbers = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  return a + b;
};

// 간단한 인사말 생성 함수
const greetUser = (name) => {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Name must be a non-empty string');
  }
  return `Hello, ${name}!`;
};

// 배열 및 객체 구조 분해 유틸리티
const processData = (data) => {
  const [first, second, ...rest] = data.array;
  const { name, age } = data.object;
  return { first, second, rest, name, age };
};

// 배열 및 객체 확장 유틸리티
const extendData = (originalArr, originalObj, newItems, newProps) => ({
  array: [...originalArr, ...newItems],
  object: { ...originalObj, ...newProps },
});

// 비동기 작업 처리
const executeAsyncTask = async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      const success = true; // 비동기 작업 시뮬레이션
      success ? resolve('Success!') : reject(new Error('Failure!'));
    });
    return result;
  } catch (error) {
    console.error('Async task failed:', error.message);
    throw error;
  }
};

// Proxy를 사용한 객체 속성 접근 로깅
const createLoggedObject = (target) => {
  const handler = {
    get(target, prop, receiver) {
      console.log(`Getting property '${prop}'`);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      console.log(`Setting property '${prop}' to '${value}'`);
      return Reflect.set(target, prop, value, receiver);
    },
  };
  return new Proxy(target, handler);
};

// 메인 실행 함수
const main = async () => {
  try {
    // 문자열 출력
    console.log(GREETINGS.HELLO);
    console.log(GREETINGS.WORLD);

    // 사용자 메시지
    console.log(createGreeting('max'));

    // 수학 연산
    console.log(addNumbers(2, 3));

    // 인사말
    console.log(greetUser('Alice'));

    // 구조 분해
    const data = { array: [1, 2, 3, 4, 5], object: { name: 'Charlie', age: 25 } };
    const { first, second, rest, name, age } = processData(data);
    console.log(first, second, rest);
    console.log(name, age);

    // 배열 및 객체 확장
    const arr1 = [1, 2, 3];
    const obj1 = { a: 1, b: 2 };
    const extended = extendData(arr1, obj1, [4, 5], { c: 3 });
    console.log(extended.array);
    console.log(extended.object);

    // 비동기 작업
    console.log(await executeAsyncTask());

    // Proxy 객체
    const target = {
      message: 'Hello',
      greet() {
        return `${this.message}, world!`;
      },
    };
    const proxy = createLoggedObject(target);
    console.log(proxy.message);
    proxy.message = 'Hola';
    console.log(proxy.greet());
  } catch (error) {
    console.error('Error in main:', error.message);
  }
};

// 프로그램 실행
main();