import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_CALLBACK_URL = import.meta.env.VITE_NAVER_CALLBACK_URL;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;

// 로그인 상태 저장/불러오기 함수
const saveLoginState = (provider, userData) => {
  localStorage.setItem('loginProvider', provider);
  localStorage.setItem('userData', JSON.stringify(userData));
};

const loadLoginState = () => {
  const provider = localStorage.getItem('loginProvider');
  const userData = JSON.parse(localStorage.getItem('userData'));
  return { provider, userData };
};

function handleCredentialResponse(response) {
  // JWT 토큰을 받아서 처리하고 로그인 상태 저장
  console.log('Google JWT:', response.credential);
  const userData = { 
    token: response.credential,
    // JWT에서 이메일 등 추가 정보를 추출할 수 있습니다
  };
  saveLoginState('google', userData);
  alert('구글 로그인 성공!');
}

// 네이버 로그인 성공 시 호출되는 콜백 함수
function handleNaverLogin() {
  const naverLogin = new window.naver.LoginWithNaverId({
    clientId: NAVER_CLIENT_ID,
    callbackUrl: NAVER_CALLBACK_URL,
    isPopup: false,
    loginButton: { color: 'green', type: 3, height: 60 }
  });
  naverLogin.init();

  naverLogin.getLoginStatus((status) => {
    if (status) {
      const { id, email, name } = naverLogin.user;
      console.log('Naver User:', { id, email, name });
      saveLoginState('naver', { id, email, name });
      alert('네이버 로그인 성공! ' + email);
    }
  });
}

function handleKakaoLogin() {
  if (window.Kakao) {
    window.Kakao.Auth.login({
      success: function (authObj) {
        console.log(authObj);
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res) {
            console.log('Kakao User:', res);
            const { id, kakao_account } = res;
            const userData = {
              id,
              email: kakao_account.email,
              nickname: kakao_account.profile.nickname,
            };
            saveLoginState('kakao', userData);
            alert('카카오 로그인 성공! ' + userData.email);
            window.location.reload();
          },
          fail: function (error) {
            console.error(error);
            alert('카카오 사용자 정보 요청 실패');
          },
        });
      },
      fail: function (err) {
        console.error(err);
        alert('카카오 로그인 실패');
      },
    });
  }
}


function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const { provider, userData } = loadLoginState();
    if (provider && userData) {
      setIsLoggedIn(true);
      setUserInfo({ provider, ...userData });
    }
  }, []);

  useEffect(() => {
    // Google API 스크립트 동적 로드
    const googleScript = document.createElement('script');
    googleScript.src = 'https://accounts.google.com/gsi/client';
    googleScript.async = true;
    googleScript.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-login-btn'),
          { theme: 'outline', size: 'large' }
        );
      }
    };

    // 네이버 로그인 스크립트 동적 로드
    const naverScript = document.createElement('script');
    naverScript.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
    naverScript.async = true;
    naverScript.onload = handleNaverLogin;

    document.body.appendChild(googleScript);
    document.body.appendChild(naverScript);

    // 카카오 로그인 스크립트 동적 로드
    const kakaoScript = document.createElement('script');
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    kakaoScript.async = true;
    kakaoScript.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_CLIENT_ID);
      }
    };
    document.body.appendChild(kakaoScript);

    return () => {
      document.body.removeChild(googleScript);
      document.body.removeChild(naverScript);
      document.body.removeChild(kakaoScript);
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>소셜 로그인 테스트</h1>
      {isLoggedIn ? (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <h3>로그인 되었습니다!</h3>
          <p>Provider: {userInfo?.provider}</p>
          {userInfo?.email && <p>Email: {userInfo.email}</p>}
          <button
            onClick={() => {
              localStorage.clear();
              setIsLoggedIn(false);
              setUserInfo(null);
              window.location.reload(); // 로그아웃 후 페이지 새로고침
            }}
            style={{ padding: '10px 20px', marginTop: '10px' }}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0' }}>
          <div id="google-login-btn"></div>
          <div id="naverIdLogin"></div>
          <img
            src="https://th.bing.com/th/id/R.64ee737be0e6a38c1e397111fe727a65?rik=kJ21Mzu2pCmW3w&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fkakao-logo-png-file-kakao-ci-yellow-svg-1280.png&ehk=7qRmwhZbDk9Snp2kkV35uWbaYx%2bDv1a8HqTfDaCOfn4%3d&risl=&pid=ImgRaw&r=0"
            width="222"
            alt="카카오 로그인"
            onClick={handleKakaoLogin}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
