# SWM Eats - 소마 맛집 공유 서비스

소프트웨어 마에스트로(소마) 구성원들을 위한 맛집 공유 플랫폼입니다. 소마 센터 주변 및 소마 구성원들이 자주 방문하는 지역의 맛집 정보를 공유하고, 리뷰를 남기며, 함께 식사할 동료를 찾을 수 있는 서비스입니다.

## 프로젝트 기술 스택

- **프론트엔드:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **백엔드:** NestJS, TypeScript
- **데이터베이스:** PostgreSQL
- **지도 API:** Kakao Maps API
- **인증:** JWT, NextAuth.js
- **배포:** Vercel(프론트엔드), AWS/Vercel(백엔드)

## 설치 및 실행 방법

1. 저장소 클론:
   ```bash
   git clone https://github.com/your-username/swm-eats-frontend.git
   cd swm-eats-frontend
   ```

2. 의존성 설치:
   ```bash
   npm install
   # 또는
   yarn
   ```

3. 환경 변수 설정:
   `.env.local` 파일에 필요한 환경 변수를 설정하세요.
   ```
   NEXT_PUBLIC_KAKAO_MAP_API_KEY=여기에_카카오맵_JAVASCRIPT_API_키를_입력하세요
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 http://localhost:3000 접속

## 카카오맵 설정 방법

1. [Kakao Developers](https://developers.kakao.com/) 에서 계정 생성 및 로그인
2. 애플리케이션 추가 및 JavaScript API 키 발급
3. 웹 플랫폼 등록: 설정 > 플랫폼 > Web 플랫폼 등록
   - 사이트 도메인에 `http://localhost:3000` 추가
4. `.env.local` 파일에 발급받은 JavaScript API 키 입력
5. API 유형 중 '카카오맵' API가 활성화되어 있는지 확인

## 문제 해결

### 지도가 표시되지 않는 경우
- 브라우저 콘솔에서 오류 메시지 확인
- JavaScript API 키가 올바르게 설정되었는지 확인
- Kakao Developers에서 도메인이 등록되었는지 확인
- https 환경에서 실행 중인 경우, 카카오맵 SDK URL도 https로 변경 필요

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