# 📚 GlobalNomad

**GlobalNomad는
하나의 계정으로 판매자와 체험자 역할을 모두 수행할 수 있는
체험 기반 예약 플랫폼입니다.**

## ✨ 소개
사용자가 체험 상품을 직접 등록해 판매자가 될 수 있으며,
동시에 다른 사용자의 체험을 예약하는 체험자로도 활동할 수 있습니다.

### 주요 기능

 회원가입 & 로그인
 체험 등록 및 관리 (판매자)
 체험 탐색 & 예약 (체험자)
 예약 상태 관리
 마이페이지
 리뷰 & 알림

## 🛠️ 기술 스택

### 프레임워크 & 라이브러리

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- **Next.js 16.0.3** - React 기반 풀스택 프레임워크 (App Router, Server Actions)
- **React 19.2.0** - 사용자 인터페이스 구축 (React Compiler 적용)
- **TypeScript 5** - 정적 타입 검사

### 스타일링

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **Tailwind CSS 4** - 유틸리티 퍼스트 CSS 프레임워크
- **tailwind-variants** - 타입 안전한 variant 관리
- **clsx & tailwind-merge** - 조건부 클래스 병합
- **Pretendard Font** - 한국어 최적화 폰트

### 개발 도구

![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)

- **ESLint 9** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Husky** - Git hooks 자동화

### 배포 환경

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

- **Vercel** - 자동 배포 환경
- **배포 URL**: https://global-nomad-alpha.vercel.app/
- **프리뷰 배포** - PR 생성 시 미리보기 환경 자동 생성

## 👥 Team

| 이름       | 담당 업무                                          |
| ---------- | -------------------------------------------------- |
| **권현성** | 체험상세, 계정설정, 버튼, 내 정보 페이지 전체 레이아웃 |
| **조동현** | 로그인/회원가입, 전역상태, 헤더/푸터, 모달, 예약 내역, 예약 현황    |
| **김준열** | 인풋, 사이드메뉴, 드롭다운, 캘린더셀, 뱃지              |
| **전성현** | 체험 카드, 예약 카드, 내 체험 관리 카드, 검색 기능, 메인 페이지             |

## 📂 디렉토리 구조

```
GLOBALNOMAD/                
├── src/
│   ├── app/               
│   │   ├── (auth)/       
│   │   │   ├── activities/
│   │   │   │   ├── [activityId]/
│   │   │   │   │   └─ edit/
│   │   │   │   │   
│   │   │   │   └─ create
│   │   │   │   
│   │   │   ├── mypage/
│   │   │   │   ├── activities/
│   │   │   │   ├── my-profile/
│   │   │   │   ├── reservation-status/
│   │   │   │   ├── reservations/
│   │   │   │   ├── layout
│   │   │   │   └─  MypageLayout
│   │   │   │
│   │   │   └─ layout
│   │   ├── public/
│   │   │   ├── login/    
│   │   │   ├── oauth/
│   │   │   │   └── signup/
│   │   │   │   │   └── kakao/   
│   │   │   ├── signup/    
│   │   │   └── layout 
│   │   ├── activities/           
│   │   │   ├── [activityId]/     
│   │   │   └── layout
│   │   ├── api/
│   │   │   ├── activities/
│   │   │   │   ├── [activityId]/
│   │   │   │   │   └── reservations/
│   │   │   │   └── image/  
│   │   │   ├── login/   
│   │   │   ├── logout/  
│   │   │   ├── my-activities/
│   │   │   │   └──[activityId]/
│   │   │   ├── my-notifications/
│   │   │   │   └──[notificationId]/
│   │   │   ├── my-reservations/
│   │   │   │   └── [reservationId]/
│   │   │   ├── refresh/
│   │   │   ├── signup/ 
│   │   │   ├── token/  
│   │   │   └── users/
│   │   │   │   └── me/
│   │   │   │   │   └── image/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout
│   │   ├── aseets/
│   ├── components/  
│   │   ├── Button/  
│   │   ├── Calendar/
│   │   ├── Card/   
│   │   ├── Dropdown/
│   │   │   └── base/
│   │   ├── Header/       
│   │   ├── Footer/       
│   │   ├── Modal/        
│   │   ├── Notification/  
│   │   ├── Pagination/   
│   │   ├── Input/       
│   │   ├── Popover/    
│   │   ├── Reservation/
│   │   ├── Search/
│   │   └── SideMenu/
│   ├── features/    
│   │   ├── ActivityCreate     
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types.ts
│   │   │   └── utils/
│   │   ├── mainpage/
│   │   │   ├── activities.ts
│   │   │   └── components/
│   │   ├── myActivities/
│   │   │   ├── api/
│   │   │   ├── mock/
│   │   │   └── type.ts
│   │   ├── mypage
│   │   │   ├── reservation-status/
│   │   │   │   └── hooks/
│   │   │   ├── reservations/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── mocks/
│   │   │   │   └── utils/
│   │   │   └── services/
│   │   └── notification/
│   │   │   └── hooks/
│   ├── lib/             
│   │   ├── api/
│   │   ├── hooks/
│   │   └── server/
│   ├── types/             
│   └── styles/            
├── eslint.config.mjs      
├── .prettierrc            
└── package.json
```

## 🚩 Starting (프로젝트 시작 방법)

### 필수 조건

- **Node.js** 18.0.0 이상
- **pnpm**

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone
   cd GlobalNomad
   ```

2. **의존성 설치**

   ```bash
   pnpm install
   ```

3. **환경 변수 설정**

   프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

   ```bash
  
  NEXT_PUBLIC_API_URL=https://sp-globalnomad-api.vercel.app/19-7
  NEXT_PUBLIC_BASE_URL=http://localhost:3000/

  NEXT_PUBLIC_KAKAO_MAP_API_KEY=53bbfc0c7bdd02c4fee2f9d5ddfd301a
   ```

4. **개발 서버 실행**

   ```bash
   pnpm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 사용 가능한 스크립트

```bash
pnpm run dev          # 개발 서버 실행
pnpm run build        # 프로덕션 빌드
pnpm run start        # 프로덕션 서버 실행
pnpm run lint         # ESLint 검사
pnpm run lint:fix     # ESLint 자동 수정
pnpm run format       # Prettier 포맷팅
pnpm run format:check # Prettier 검사만 실행
pnpm run type-check   # TypeScript 타입 검사
```

## 🔌 API Routes

프로젝트는 Next.js App Router의 Route Handlers를 사용하여 백엔드 API를 구현합니다.
