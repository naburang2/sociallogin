# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Google OAuth 로그인 React 웹사이트

이 프로젝트는 Vite와 React를 기반으로 하며, Google API를 통한 OAuth2 로그인 기능을 구현합니다.

## 시작하기

1. 의존성 설치
   ```bash
   npm install
   ```
2. 개발 서버 실행
   ```bash
   npm run dev
   ```

## Google OAuth 연동 방법
1. [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 클라이언트 ID를 생성합니다.
2. 클라이언트 ID를 `.env` 파일에 추가합니다.
3. 프론트엔드에서 Google 로그인 버튼을 구현합니다.

---
자세한 구현 방법은 소스코드와 주석을 참고하세요.
