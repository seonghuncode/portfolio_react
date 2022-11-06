import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";
import { parseStr } from "../helper/common-helper.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../App";

//-------------------------------------------------DB에서 user테이블 정보 불러오기
function Test() {
  //컴포넌트 함수는 무조건 대문자
  const 유저정보가지고오기 = async () => {
    await axios({
      url: "http://localhost:5000/user",
    }).then((res) => {
      console.log(res);
    });
  };
  return (
    <div style={{ padding: "100" }}>
      <button onClick={유저정보가지고오기}>유저정보가지고오기</button>
    </div>
  );
}
//-------------------------------------------------

function Main() {
  const navigation = useNavigate();
  const [apartData, setapartData] = React.useState();
  const [loading, setLoading] = React.useState(true); //아래서 삼항식을 통해 true이면 로딩화면을 false이면 회면을 보여주기 위한 변수
  const randomValue = []; //랜덤값을 넣기 위한 배열

  //랜덤 값으로 5개를 무작위로
  const getRandom = function (length) {
    return parseInt(Math.random() * length);
  };

  //리액트에서 api를 불러오는 방법이 아니라 server에서 불러오기  (DB에 값이 없을때만 수동으로 url입력해서 넣어주기)
  const apartAPI = async () => {
    await axios({
      url: "http://localhost:5000/apartAPI",
      withCredentials: false, //세션을 위해 로그인 할때 불러올때만 true이고 나머지는 false로 해준다
    })
      .then((response) => {
        console.log("apart API를 DB에 저장 했습니다.");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //DB에서 데이터를 select해오는 기능
  const findeDataFromDB = async () => {
    await axios({
      url: "http://localhost:5000/findDataFromDB",
      withCredentials: false,
    })
      .then((response) => {
        // 랜덤값 5개를 뽑는 알고리즘

        //값이 없으면 끝내기
        if (response.data.length === 0) {
          return;
        }

        const a = getRandom(response.data.length - 5); //시작값
        const b = a + 4; //끝값  ==> 화면에 5개의 정보를 보여주기 위해서는 차이가 5
        for (var i = a; i <= b; i++) {
          console.log(response.data[i]);
          randomValue.push(response.data[i]);
        }
        setapartData(randomValue);
        console.log(randomValue);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    findeDataFromDB();
  }, []); //빈 배열을 넣어 주어야 한번만 실행 된다.(없으면 랜더링 될때마다 실행)

  //로그인 괸련 변수 선언
  const { loginUser, setLoginUser } = React.useContext(StoreContext);
  //카카오톡 로그인을 위한 키 변수 설정
  const KAKAO_API_KEY = "98c3a78c484879e5166cd2cdb417472b"; //rest api키
  const KAKAO_CLIENT_ID = "5be66241f725b198c523fb70a432a8b6"; //javascript키
  const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao"; //KAKAO DEDVELOPER에서 설정한 REDIRECT URI 그대로 가지고 온다

  const 카카오소셜로그인링크 = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`; //이 경로로 보내주어야 한다, 카카오 공식 문서에서 이렇게 보내라고 정해 놓았다

  console.log(apartData);

  return (
    <div>
      {console.log("======================")}
      {console.log(loginUser)}
      {console.log("===========================")}
      안녕하세요 {loginUser.nickname} {loginUser.name} 님 !{""}
      <Test />
      {/* 컴포넌트함수 실행 */}
      <div className="mainFrame">
        <div className="nav-main">
          <input
            type="button"
            className="btn-nomal-main"
            value="오늘의 부동산"
          />
          <input
            type="button"
            className="main-login btn-nomal-main"
            onClick={async () => {
              localStorage.removeItem("loginUser");

              //서버에 접속해서 연결된 세션 모두 삭제하기
              await axios({
                //sessionStorage.clear();
                url: "http://localhost:5000/logout",
                withCredentials: true,
              })
                .then((response) => {
                  console.log("연결된 세션을 모두 삭제 했습니다.");
                })
                .catch((e) => {
                  console.log(e);
                });

              await window.Kakao.API.request({
                url: "/v1/user/unlink",
              })
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                });

              setLoginUser({
                id: "",
                pw: "",
              });
              // navigation("/login");
              navigation("/");
            }}
            value=" 로그아웃"
          />
          <input
            type="button"
            className="main-login btn-nomal-main"
            value="회원가입"
            onClick={() => {
              navigation("/join");
            }}
          />

          <input
            type="button"
            className="main-login btn-nomal-main"
            value="로그인"
            onClick={() => {
              navigation("/login");
              //window.location.href = 카카오소셜로그인링크; //위의 설정한 경로로 이동 -> 여기로 가면 AppIndex에서 카카오데이터 함수로 가도록 설정 되어 있다
            }}
          />

          <input
            type="button"
            className="btn-nomal-main"
            style={{ float: "right" }}
            value="오늘의 뉴스"
          />
          <input
            type="button"
            className="btn-nomal-main"
            style={{ float: "right" }}
            value="지도"
          />
        </div>
        <div className="center-main">
          <div className="mainQuestion">어떤 아파트를 찾으세요?</div>
          <div className="btn-area">
            <input className="btn-main" type="button" value="매물" />
            <input className="btn-main" type="button" value="분양" />
          </div>
          <form>
            <div className="search-in-icon">
              <input
                className="search"
                type="text"
                placeholder="지역 또는 단지명을 입력하세요. "
              />
              <button className="icon-main" type="submit">
                <FontAwesomeIcon
                  style={{ padding: "2px" }}
                  icon={faMagnifyingGlass}
                  size="2x"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* 추천 매물 아래는 공공 데이터를 불러와 뿌려주는 작업 */}
      <div className="bottom-area">
        <div>
          <div className="introduce" type="button" value="추천매물">
            추천매물
            <button
              type="button"
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={() => {
                findeDataFromDB();
              }}
            >
              {/* 버튼을 누르면 추천 매물 리로딩 */}
              <FontAwesomeIcon
                style={{ padding: "1px" }}
                icon={faMagnifyingGlassLocation}
                size="2x"
              />
            </button>
          </div>
        </div>

        {/**추천 매울에 대한 정보를 정리해서 보여준다*/}
        {/* 한번에 가지고 온 50개의 데이터를 5개를 랜덤 숫자를 뽑아 5개의 값을 추천으로 보여 준다. */}

        <div className="recommend-high">
          {apartData && //apartData && ==> 값이 있으면 출력하라는 의미
            apartData.map((item, index) => {
              console.log(item);
              return (
                <div key={index}>
                  <div className="recommend-frame">
                    <div>아파트 : {item.apart_name}</div>
                    <div>거래 금액 : {item.trading_price} (단위:만원)</div>
                    <div>건축 년도 : {item.year_of_constuction}</div>
                    <div>
                      주소 : {item.raod_name}
                      {item.number}
                    </div>
                    <div>
                      지도 보기 :
                      <a
                        // href={`https://www.google.com/maps/place/${item.도로명}${item.지번}`}
                        href={`https://www.google.com/maps/place/${item.raod_name}${item.number}${item.apart_name}아파트`}
                        target={"_black"}
                      >
                        지도
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Main;
