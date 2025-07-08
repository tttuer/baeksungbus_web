// 브라우저 콘솔에서 직접 실행할 수 있는 스크립트

// 테스트 데이터 생성 함수
const createTestData = async () => {
  const testData = [
    {
      writer: "김민수",
      email: "minsu@example.com",
      password: "1234",
      title: "검은색 가죽 지갑 분실",
      content: "오늘 오후 3시경 142번 버스에서 검은색 가죽 지갑을 분실했습니다. 신분증과 카드가 들어있습니다. 찾으면 연락 부탁드립니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "이지영",
      email: "jiyoung@example.com", 
      password: "1234",
      title: "아이폰 14 핑크색 분실",
      content: "오늘 아침 8시경 234번 버스에서 핑크색 아이폰 14를 잃어버렸습니다. 핑크색 케이스를 끼우고 있었습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "박철수",
      email: "chulsoo@example.com",
      password: "1234", 
      title: "노란색 우산 분실",
      content: "비 오는 날 456번 버스에서 내릴 때 노란색 우산을 깜빡했습니다. 손잡이에 P.C라고 이니셜이 적혀있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "최유진",
      email: "yujin@example.com",
      password: "1234",
      title: "회색 배낭 분실",
      content: "오늘 오후 2시경 789번 버스에서 회색 배낭을 분실했습니다. 노트북과 교재가 들어있어서 꼭 찾아야 합니다.",
      qa_type: "CUSTOMER", 
      hidden: true
    },
    {
      writer: "정민호",
      email: "minho@example.com",
      password: "1234",
      title: "검은색 안경 분실",
      content: "101번 버스에서 검은색 뿔테 안경을 분실했습니다. 렌즈가 두꺼워서 특징이 있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "강수정",
      email: "sujeong@example.com",
      password: "1234",
      title: "빨간색 가방 분실",
      content: "오늘 저녁 6시경 333번 버스에서 빨간색 숄더백을 분실했습니다. 화장품과 열쇠가 들어있습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "임현우",
      email: "hyunwoo@example.com",
      password: "1234",
      title: "파란색 목도리 분실",
      content: "추운 날씨에 555번 버스에서 파란색 울 목도리를 잃어버렸습니다. 할머니가 떠주신 것이라 의미가 있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "송미영",
      email: "miyoung@example.com",
      password: "1234",
      title: "검은색 장갑 분실",
      content: "777번 버스에서 검은색 가죽 장갑을 분실했습니다. 한 짝만 있어서 찾고 있습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "홍길동",
      email: "gildong@example.com",
      password: "1234",
      title: "갈색 서류가방 분실",
      content: "오늘 오전 9시경 888번 버스에서 갈색 서류가방을 분실했습니다. 중요한 서류가 들어있어서 꼭 찾아야 합니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "김영희",
      email: "younghee@example.com",
      password: "1234",
      title: "흰색 스카프 분실",
      content: "999번 버스에서 흰색 실크 스카프를 분실했습니다. 선물받은 것이라 소중합니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "이준석",
      email: "junseok@example.com",
      password: "1234",
      title: "회색 모자 분실",
      content: "111번 버스에서 회색 야구모자를 분실했습니다. 앞면에 로고가 있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "박소영",
      email: "soyoung@example.com",
      password: "1234",
      title: "검은색 핸드백 분실",
      content: "오늘 오후 4시경 222번 버스에서 검은색 핸드백을 분실했습니다. 지갑과 핸드폰이 들어있습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "최민준",
      email: "minjun@example.com",
      password: "1234",
      title: "파란색 계산기 분실",
      content: "444번 버스에서 파란색 공학용 계산기를 분실했습니다. 시험 때 필요해서 꼭 찾아야 합니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "정수민",
      email: "sumin@example.com",
      password: "1234",
      title: "빨간색 펜케이스 분실",
      content: "666번 버스에서 빨간색 펜케이스를 분실했습니다. 여러 색깔의 펜이 들어있습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "강태현",
      email: "taehyun@example.com",
      password: "1234",
      title: "검은색 이어폰 분실",
      content: "오늘 아침 7시경 123번 버스에서 검은색 무선 이어폰을 분실했습니다. 케이스째로 없어졌습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "임서연",
      email: "seoyeon@example.com",
      password: "1234",
      title: "핑크색 텀블러 분실",
      content: "345번 버스에서 핑크색 스테인리스 텀블러를 분실했습니다. 이름이 새겨져 있습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "송준영",
      email: "junyoung@example.com",
      password: "1234",
      title: "회색 운동화 분실",
      content: "오늘 오후 5시경 567번 버스에서 회색 운동화를 분실했습니다. 한 짝만 있어서 곤란합니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "홍민정",
      email: "minjung@example.com",
      password: "1234",
      title: "검은색 충전기 분실",
      content: "789번 버스에서 검은색 핸드폰 충전기를 분실했습니다. C타입 충전기입니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "김도현",
      email: "dohyun@example.com",
      password: "1234",
      title: "파란색 책가방 분실",
      content: "오늘 오전 10시경 987번 버스에서 파란색 책가방을 분실했습니다. 교과서와 필기구가 들어있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "이하늘",
      email: "haneul@example.com",
      password: "1234",
      title: "흰색 마스크 분실",
      content: "654번 버스에서 흰색 KF94 마스크를 분실했습니다. 새 제품이었습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "박지우",
      email: "jiwoo@example.com",
      password: "1234",
      title: "검은색 시계 분실",
      content: "오늘 오후 1시경 321번 버스에서 검은색 디지털 시계를 분실했습니다. 방수 기능이 있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "최예진",
      email: "yejin@example.com",
      password: "1234",
      title: "빨간색 립스틱 분실",
      content: "159번 버스에서 빨간색 립스틱을 분실했습니다. 고급 브랜드 제품입니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "정우진",
      email: "woojin@example.com",
      password: "1234",
      title: "회색 카디건 분실",
      content: "오늘 오후 3시경 753번 버스에서 회색 카디건을 분실했습니다. 양모 소재입니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "강미래",
      email: "mirae@example.com",
      password: "1234",
      title: "검은색 선글라스 분실",
      content: "951번 버스에서 검은색 선글라스를 분실했습니다. 케이스도 함께 없어졌습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "임동혁",
      email: "donghyuk@example.com",
      password: "1234",
      title: "파란색 펜 분실",
      content: "오늘 오전 11시경 852번 버스에서 파란색 볼펜을 분실했습니다. 특별한 의미가 있는 펜입니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "송하진",
      email: "hajin@example.com",
      password: "1234",
      title: "흰색 휴지 분실",
      content: "741번 버스에서 흰색 휴지를 분실했습니다. 새 제품이었습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "홍수빈",
      email: "subin@example.com",
      password: "1234",
      title: "검은색 키링 분실",
      content: "오늘 오후 2시경 963번 버스에서 검은색 키링을 분실했습니다. 집 열쇠와 함께 있었습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "김태윤",
      email: "taeyoon@example.com",
      password: "1234",
      title: "빨간색 물병 분실",
      content: "147번 버스에서 빨간색 물병을 분실했습니다. 스티커가 여러 개 붙어있습니다.",
      qa_type: "CUSTOMER",
      hidden: true
    },
    {
      writer: "이채원",
      email: "chaewon@example.com",
      password: "1234",
      title: "회색 양말 분실",
      content: "오늘 오후 4시경 258번 버스에서 회색 양말을 분실했습니다. 한 짝만 있어서 찾고 있습니다.",
      qa_type: "CUSTOMER",
      hidden: false
    },
    {
      writer: "박현서",
      email: "hyunseo@example.com",
      password: "1234",
      title: "검은색 머리끈 분실",
      content: "369번 버스에서 검은색 머리끈을 분실했습니다. 탄성이 좋은 제품입니다.",
      qa_type: "CUSTOMER",
      hidden: true
    }
  ];

  try {
    // 각 데이터를 순차적으로 등록
    for (let i = 0; i < testData.length; i++) {
      const item = testData[i];
      console.log(`데이터 ${i + 1}/${testData.length} 등록 중...`);
      
      const formData = new FormData();
      formData.append("writer", item.writer);
      formData.append("email", item.email);
      formData.append("password", item.password);
      formData.append("title", item.title);
      formData.append("content", item.content);
      formData.append("qa_type", item.qa_type);
      formData.append("hidden", item.hidden);
      
      // API 직접 호출
      const response = await fetch('/api/qas', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`✓ 데이터 ${i + 1} 등록 완료: ${item.title}`);
      
      // 너무 빠르게 요청하지 않도록 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🎉 모든 테스트 데이터 등록 완료!');
    console.log('페이지를 새로고침하여 확인해보세요.');
    
  } catch (error) {
    console.error('❌ 데이터 등록 중 오류 발생:', error);
  }
};

// 함수 실행
console.log('테스트 데이터 생성을 시작합니다...');
createTestData();