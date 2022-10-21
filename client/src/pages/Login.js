// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { StoreContext } from "../App";

// function Login() {
//   //   const data = React.useContext(StoreContext);
//   //   console.log(data); //App.js에 있는 loginUser값이 들어 온다.
//   //구조분해 할당 사용
//   const { setLoginUser } = React.useContext(StoreContext);
//   //   console.log(loginUser);
//   const navigation = useNavigate();

//   const [user, setUser] = React.useState({
//     //여기서 id , pw은 key값이 된다!!
//     id: "",
//     pw: "",
//   });

//   //async , await은 비동기 에서 동기로 변경 하기 위한 코드
//   const 로그인 = async () => {
//     console.log("넘기는user");
//     console.log(user);

//     //서버 호출 하기
//     await axios({
//       url: "http://localhost:5000/login",
//       params: {
//         user: user,
//       },
//     }).then(({ data }) => {
//       //성공시 실행되는 코드
//       //받은 값 : 결과, 메세지 user에 대한 data
//       console.log(data.user);
//       if (data.user != null) {
//         setLoginUser(data.user);
//         //웹에서 로그인 정보를 기억 하는 방법은  (localStorage -> (영구적이다.) , Cookie -> (만료 날짜가 있다)가 있다)
//         localStorage.setItem("loginUser", JSON.stringify(data.user)); //setItem("loginUser", data.user) == loginUser라는 객체에 data.user을 넣는다는 의미
//         //오로지 문자열만 넣을수 있기다 -> data.user객체를 문자열로 변환해서 넣어 준다.

//         navigation("/");
//       }

//       console.log(data.user === null);
//       if (data.user === null) {
//         navigation("/login");
//       }
//     });
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <input
//           type="text"
//           onChange={(event) => {
//             const cloneUser = { ...user }; //불변성을 지키기 위해 복제
//             cloneUser.id = event.target.value;
//             setUser(cloneUser);
//             //브라우저에서 입력한 id값을 받아와 저장해 준다.
//           }}
//         />
//         <input
//           type="password"
//           style={{ marginTop: 10 }}
//           onChange={(event) => {
//             const cloneUser = { ...user }; //불변성을 지키기 위해 복제
//             cloneUser.pw = event.target.value;
//             setUser(cloneUser);
//             //브라우저에서 입력한 id값을 받아와 저장해 준다.
//           }}
//         />
//         <button style={{ marginTop: 10 }} onClick={로그인}>
//           로그인
//         </button>
//       </header>
//     </div>
//   );
// }

// export default Login;
