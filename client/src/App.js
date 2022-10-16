import "./App.css";
import React from "react";
import AppIndex from "./AppIndex";
import {useLocation, useNavigate} from "react-router-dom"

//로그인이라는 기능을 사용하기 위해서는 무조건 전역변수가 필요하다.(여러 페이지 에서 로그인 정보를 가지고 와야 하기때문이다.)
//useContext : 리액트 에서의 전역 변수 사용 방법(리액트 내에 있어서 다운 X)
//Redux, Recoil도 전역 변수를 설정해주는 라이브러리 (다운 받아야 사용 가능)

//export를 해주어야 다른 페이지에서 사용이 가능
export const StoreContext = React.createContext({}); // storeContext는 전역 변수가 된다.

function App() {
  const [loginUser, setLoginUser] = React.useState({
    id: "",
    pw: "",
    //받을 정보를 원하는 만큼 넣어준다. -> 이 유저 정보를 AppIndex로 보내주어야 한다
    //==> 전역변수 사용
  });

const {pathname} = useLocation();
const navigation = useNavigate();

const 주소유효성검증 = () => {
  const 로그인했을때비접근주소 = ["join", "login"];
  const 주소 = pathname.slice(1);

  if(로그인했을때비접근주소.includes(주소) && loginUser.id !== ""){
    navigation("/");
  }
}

const 자동로그인 = () => {
  const user = JSON.parse(localStorage.getItem("loginUser"))
  if(user){
    setLoginUser(user);
  }
}

React.useEffect(()=>{
  자동로그인();
}, [])

React.useEffect(()=>{
  주소유효성검증();
}, [loginUser])

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
