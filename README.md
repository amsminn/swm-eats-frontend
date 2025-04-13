# SWM Eats - 소마 맛집 공유 서비스

소프트웨어 마에스트로(소마) 구성원들을 위한 맛집 공유 플랫폼입니다. 소마 센터 주변 및 소마 구성원들이 자주 방문하는 지역의 맛집 정보를 공유하고, 리뷰를 남기며, 함께 식사할 동료를 찾을 수 있는 서비스입니다.

## 프로젝트 기술 스택

- **프론트엔드:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **백엔드:** NestJS, TypeScript
- **데이터베이스:** PostgreSQL
- **지도 API:** Kakao Maps API
- **인증:** JWT, NextAuth.js
- **배포:** Vercel(프론트엔드), AWS/Vercel(백엔드)

## 시작하기

1. 저장소 클론:
   ```bash
   git clone https://github.com/your-username/swm-eats-frontend.git
   cd swm-eats-frontend
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

4. 브라우저에서 http://localhost:3000 접속

## 주요 기능

- 지도 기반 맛집 탐색
- 카테고리, 가격대, 거리별 필터링
- 사용자 리뷰 및 평점 시스템
- 식사 모임 생성 및 참여
- 맛집 즐겨찾기 및 개인화 추천

## 프로젝트 구조

```
src/
  app/             # Next.js 앱 라우터
  components/      # 재사용 가능한 컴포넌트
  hooks/           # 커스텀 React 훅
  lib/             # 유틸리티 함수 및 설정
  styles/          # 전역 스타일 및 테마
  types/           # TypeScript 타입 정의
  utils/           # 헬퍼 함수
public/            # 정적 파일
```

## 기여하기

프로젝트에 기여하고 싶으시다면 다음 단계를 따라주세요:

1. 이 저장소를 포크합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다. 