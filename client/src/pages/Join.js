import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Join() {
  //카카오톡 로그인을 위한 키 변수 설정
  const KAKAO_API_KEY = "98c3a78c484879e5166cd2cdb417472b"; //rest api키
  const KAKAO_CLIENT_ID = "5be66241f725b198c523fb70a432a8b6"; //javascript키
  const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao"; //KAKAO DEDVELOPER에서 설정한 REDIRECT URI 그대로 가지고 온다

  const 카카오소셜로그인링크 = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`; //이 경로로 보내주어야 한다, 카카오 공식 문서에서 이렇게 보내라고 정해 놓았다

  const navigation = useNavigate();

  const [user, setUser] = React.useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  return (
    <div className="box-2">
      <div>
        SNS 계정으로 간편하게 회원 가입
        <div
          className="moveToSnsLogin"
          onClick={() => {
            window.location.href = 카카오소셜로그인링크;
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/kakaoLog.png`}
            alt="kakaoLog"
            style={{ width: "20px", height: "20px", marginTop: "10px" }}
          />
        </div>
      </div>
      <img
        className="logo"
        src={`${process.env.PUBLIC_URL}/24209-house-ou-apartment.gif`}
        alt="로고GIF"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 12,
          width: "100%",
        }}
      >
        <input
          className="inputs"
          type="text"
          placeholder="이름"
          onChange={(event) => {
            const cloneUser = { ...user };
            cloneUser.name = event.target.value;
            setUser(cloneUser);
          }}
        />
        <input
          className="inputs"
          type="email "
          placeholder="이메일"
          onChange={(event) => {
            const cloneUser = { ...user };
            cloneUser.email = event.target.value;
            setUser(cloneUser);
          }}
        />
        <input
          className="inputs"
          type="password"
          placeholder="비밀번호"
          onChange={(event) => {
            const cloneUser = { ...user };
            cloneUser.password1 = event.target.value;
            setUser(cloneUser);
          }}
        />
        <input
          className="inputs"
          type="password"
          placeholder="비밀번호 확인"
          onChange={(event) => {
            const cloneUser = { ...user };
            cloneUser.password2 = event.target.value;
            setUser(cloneUser);
          }}
        />
      </div>
      <button
        className="button"
        onClick={() => {
          //버튼 클릭하면 서버로 보내기
          console.log("Join에서 소버로 보낼 user 정보 입니다");
          console.log(user);

          const joinServer = async () => {
            await axios({
              url: "http://localhost:5000/join",
              params: {
                user: user,
              },
            }).then(({ data }) => {
              console.log(data);
              if (data.code === "fail") {
                alert(data.message);
              }
              if (data.code === "success") {
                alert("회원가입이 완료 되었습니다.");
                // navigation("/");
                window.location.href = "/";
              }
            });
          };
          joinServer();
        }}
      >
        회원가입 하기
      </button>
      <div style={{ marginTop: "10px" }}>
        이미 아이디가 있으신 가요?
        <span
          className="moveToLogin"
          onClick={() => {
            navigation("/login");
          }}
        >
          로그인
        </span>
      </div>
      <div>
        홈 화면 이동
        <span
          className="homeLogo"
          onClick={() => {
            navigation("/");
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/42174-home.gif`}
            alt="kakaoLog"
            style={{ width: "20px", height: "20px", marginTop: "10px" }}
          />
        </span>
      </div>
    </div>
  );
}

export default Join;
