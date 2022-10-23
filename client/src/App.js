import "./App.css";
import React from "react";
import AppIndex from "./AppIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
//로그인이라는 기능을 사용하기 위해서는 무조건 전역변수가 필요하다.(여러 페이지 에서 로그인 정보를 가지고 와야 하기때문이다.)
//useContext : 리액트 에서의 전역 변수 사용 방법(리액트 내에 있어서 다운 X)
//Redux, Recoil도 전역 변수를 설정해주는 라이브러리 (다운 받아야 사용 가능)

//export를 해주어야 다른 페이지에서 사용이 가능
export const StoreContext = React.createContext({}); // storeContext는 전역 변수가 된다.

function App() {
  //새로고침 하면 state값은 사라진다 -> 웹에서 기억하도록 해야 한다.
  //웹에서 로그인 정보를 기억 하는 방법은  (localStorage -> (영구적이다.) , Cookie -> (만료 날짜가 있다)가 있다)
  const [loginUser, setLoginUser] = React.useState({
    nickname: "",
    backgroundUrl: "",
    //받을 정보를 원하는 만큼 넣어준다. -> 이 유저 정보를 AppIndex로 보내주어야 한다
    //==> 전역변수 사용
  });

  //const location = useLocation ==> 현제 페이지를 불러오는 코드
  const { pathname } = useLocation();
  const navigation = useNavigate();

  const 주소유효성검증 = () => {
    const 로그인했을때비접근주소 = ["join", "login"];
    const 주소 = pathname.slice(1); //맨앞에 있는 문자열 지우는 코드 맨앞"/"를 지운다(==1번 위치 부터 나오라는 의미)

    //주소가 배열에 포함되어 있는 것이라면 + 로그인이 되어 있다면
    //login, join으로 접근하면 ==>  /페이지로 자동으로 보낸다.
    if (로그인했을때비접근주소.includes(주소) && loginUser.nickname !== "") {
      // navigation("/");
    }
  };

  //새로고침 할때 마다 서버 세션에 접근하여 세션 값을 가지고 오는 코드
  const 자동로그인 = async () => {
    //user에 key값을 가지고온다(문자열) -> 사용할 수 있도록 객체로 바꾸어 준다.
    await axios({
      url: "http://localhost:5000/autoLogin",
      withCredentials: true,
    }).then(({ data }) => {
      const 로그인했을때비접근주소 = ["join", "login"];
      const 주소 = pathname.slice(1); //맨앞에 있는 문자열 지우는 코드 맨앞"/"를 지운다(==1번 위치 부터 나오라는 의미)

      console.log("data.nickname");
      console.log(data.nickname);
      console.log(data);
      //주소가 배열에 포함되어 있는 것이라면 + 로그인이 되어 있다면
      //login, join으로 접근하면 ==>  /페이지로 자동으로 보낸다.
      if (로그인했을때비접근주소.includes(주소) && data.nickname !== "") {
        console.log("data.nickname");
        console.log(data.nickname);
        navigation("/");
      }
    });

    const user = JSON.parse(localStorage.getItem("loginUser"));
    if (user) {
      console.log("APP에서 user변수");
      console.log(loginUser);
      setLoginUser(user);
    }
  };

  React.useEffect(() => {
    자동로그인();
  }, []);

  React.useEffect(() => {
    주소유효성검증();
  }, [loginUser]); //처음에는 값이 비어있기 때문에 loginUser가 변할때 리로딩을 해줘라

  return (
    <StoreContext.Provider
      value={{
        loginUser: loginUser, //loginUser는 전역변수로 어디서나 사용이 가능하다
        setLoginUser: setLoginUser,
      }}
    >
      <AppIndex />
    </StoreContext.Provider>
  );
}

export default App;
