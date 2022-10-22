import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main, Join, Login } from "./pages";
import qs from "qs";
import axios from "axios";
import { StoreContext } from "./App";
import { useNavigate } from "react-router-dom";

//카카오톡 로그인을 위한 키 변수 설정
const KAKAO_API_KEY = "98c3a78c484879e5166cd2cdb417472b"; //rest api키
const KAKAO_CLIENT_ID = "5be66241f725b198c523fb70a432a8b6"; //javascript키
const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao"; //KAKAO DEDVELOPER에서 설정한 REDIRECT URI 그대로 가지고 온다

function 카카오데이터() {
  const navigation = useNavigate();

  //로그인한 아이디를 전역변수로 사용하기 위한 코드
  const { loginUser, setLoginUser } = React.useContext(StoreContext);
  console.log("Appindex 에서 user변수");
  console.log(loginUser);
  

  //정보를 받는 곳인데 해당 url에서 코드를 가지고 올때 사용하는 코드 암기
  const code = new URL(window.location.href).searchParams.get("code");

  //qs라는 라이브러리 설치 npm install qs
  //qs사용 이유 : KAKAO_API_KEY, REDIRECT_URI같이 특수문자를 받을때 서버에 방해가 될수 있기 때문에 특수 문자를 서버에 맞게 변환(인코딩)을 자동으로 해주는 것이다.
  //==> 쿼리스트링을 날릴때 더 안전하게 사용하기 위해서 사용한다.
  const getKAKAO = async () => {
    const data = qs.stringify({
      //카카오 에서 이렇게 달라고 양식을 정해 놓았다 -  공식 문서
      grant_type: "authorization_code",
      client_id: KAKAO_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
      client_secret: KAKAO_CLIENT_ID,
    });

    const result = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      withCredentials : false,
      data: data,
    });
    console.log(result);
    //카카오 에서 이렇게 하라고 정해 두었기 때문에 정해진 방법으로 보낸다고 생각하면 된다
    //이때 받아온 data에서 access_token이 로그인 할 수있는 것을 암호화한 토큰인데 이것을 정보를 불러오면 된다

    //kakao JavaScript SDK 초기화
    //index.html에서 카카오 스크립트를 추가 했다.(window객체에 KaKao를 넣어서 카카오가 만들어 두었다)
    window.Kakao.init(KAKAO_API_KEY);

    window.Kakao.Auth.setAccessToken(result.data.access_token);

    //카카오 정보를 받았다 -> 로그인 정보를 전역변수로 설정 해주어 사용한다
    const kakaoData = await window.Kakao.API.request({
      url: "/v2/user/me",
    });

    //1. 여기에 node.js서버를 호출하여 kakaoData를 보내주어 DB에 저장한다.---------------------------------------------------------------------
    //2.  locaStorage사용(영구적으로 로그인, 새로고침 해도 로그인 유지)
    //3. 전역변수 설정
    console.log("kakaoData 입니다.");
    console.log(kakaoData);
    // navigation("/"); ///로그인 성공시 메인 화면 으로

    //console.log(kakaoData.kakao_account.profile.nickname); //추후 서버에 보낼 이름을 뽑아내는 방법
    // userInformation = kakaoData;

    const nickname = kakaoData.kakao_account.profile.nickname;
    const backgroundUrl = kakaoData.kakao_account.profile.profile_image_url;
    const user = {
      nickname: nickname,
      backgroundUrl: backgroundUrl,
    };
    // console.log("user입니다");
    // console.log(user);

    await axios({
      url: "http://localhost:5000/kakaoLogin",
      withCredentials : true,
      params: {
        user: user,
      },
    }).then(({ data }) => {
      setLoginUser(data.user);
      // console.log("Data입니다");
      // console.log(data.user);
      // console.log(loginUser);
      //웹에서 로그인 정보를 기억 하는 방법은  (localStorage -> (영구적이다.) , Cookie -> (만료 날짜가 있다)가 있다)
      localStorage.setItem("loginUser", JSON.stringify(data.user)); //setItem("loginUser", data.user) == loginUser라는 객체에 data.user을 넣는다는 의미
      //오로지 문자열만 넣을수 있기다 -> data.user객체를 문자열로 변환해서 넣어 준다.

      navigation("/"); ///로그인 성공시 메인 화면 으로
    });
 
    //-----------------------------------------------------------------------------------------------------------------------------------------------
  };

  React.useEffect(() => {
    getKAKAO();
  }, []);

  return <div>카카오 데이터 받는 곳</div>;
}

//페이지 경로 설정을 해주는 페이지
function AppIndex() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="join" element={<Join />} />
      {/* <Route exaxt path="/login" element={<Login />} />  초기 로그인 코드*/}
      <Route exaxt path="/oauth/callback/kakao" element={<카카오데이터 />} />
    </Routes>
  );
}

export default AppIndex;
