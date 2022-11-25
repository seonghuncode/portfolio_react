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
  const [apartData, setapartData] = React.useState(); //랜덤으로 뽑은 아파트 데이터 즉 ramdomValue가 들어가 있다.
  const [loading, setLoading] = React.useState(true); //아래서 삼항식을 통해 true이면 로딩화면을 false이면 회면을 보여주기 위한 변수
  const randomValue = []; //랜덤값을 넣기 위한 배열
  const [allApartData, setAllApartData] = React.useState([]); //검색어 기능을 위해 전체 데이터를 담고 있는 배열

  //검색란에 입력된 값에 따라 1.검색어와 일치하는 데이터만 보여주기 2. 일치하는 값이 없을 경우 없다고 알려주기 3. 검색어가 입력되지 않으면 랜덤으로 5개만 보여주기
  const [searchType, setSearchType] = React.useState();
  // console.log("searchType은??");
  // console.log(searchType);
  if (searchType === "") {
    console.log("searchType이 비어있습니다."); //검색어를 타이핑 할때 콘솔에 찍히는게 한스템씩 느림
  }

  //랜덤 값으로 5개를 무작위로
  const getRandom = function (length) {
    //length는 API로 부터 받은 전체 길이에서 5를 뺀 길이 이다.
    return parseInt(Math.random() * length); //랜덤값은 0 ~ lenth까지중 랜덤수를 리턴해 준다.
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
        console.log("아파트 API를 불러오지 못 했습니다.");
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

        setAllApartData(response.data);

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
  const { loginUser, setLoginUser } = React.useContext(StoreContext); //현재 세션에 저장되어 있는 회원 정보에 따라 세션에 회원 정보 저장
  //카카오톡 로그인을 위한 키 변수 설정
  const KAKAO_API_KEY = "98c3a78c484879e5166cd2cdb417472b"; //rest api키
  const KAKAO_CLIENT_ID = "5be66241f725b198c523fb70a432a8b6"; //javascript키
  const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao"; //KAKAO DEDVELOPER에서 설정한 REDIRECT URI 그대로 가지고 온다

  const 카카오소셜로그인링크 = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`; //이 경로로 보내주어야 한다, 카카오 공식 문서에서 이렇게 보내라고 정해 놓았다

  // console.log("랜덤한 아파트 데이터");
  // console.log(apartData);
  // console.log("모든 아파트 데이터");
  // console.log(allApartData);

  //------------------------------------------------------------검색어와 일치하는 데이터만 리턴해 주는 함수

  const [searchData, setSearchData] = React.useState();
  function SearchValue(promp) {
    const sameData = []; //아파트 이름중 검색어가 포함된 아파트 이름의 정보들을 저장
    //우선 아파트 이름과 동일한 검색만 되도록 하는 기능 ==> 추후에 검색 가능한 기능 늘라기
    allApartData.map((value, index) => {
      if (value.apart_name.includes(promp)) {
        // console.log("if문에 만족하느 value값");
        // console.log(value);
        sameData.push(value);
      }
    });
    // setContainData(...sameData);
    // console.log("==============================");
    // console.log("==============================");
    // console.log("SearchValue가 실행 되었습니다========>>>");
    // console.log(sameData);
    // console.log(containData);
    setSearchData(sameData);
  }

  // console.log("========================>실행 과정");
  // console.log(sameData);
  // console.log(sameData);
  // console.log("검색어와 일치하는 데이터들 =====>");
  // // console.log(containData);
  // // console.log(allApartData);
  // console.log(sameData);

  //------------------------------------------------------------검색어와 일치하는 데이터만 리턴해 주는 함수  ==> 현재 문제 검색어를 입력하면 해당 값이 sameData에는 저장되나 리턴시
  //출력이 않된다.

  //--------------------------------------------------------------------------------------input 타입의 버튼에서 로그인 상태에 따라 disabled 여부를 결정할 함수 (함수면 대문자 시작)
  const LoginStatus = () => {
    if (loginUser.name !== "" || loginUser.nickname !== "") {
      return "disabled";
    } else {
      return "";
    }
  };

  const loginStatus = LoginStatus();
  console.log("loginStatus");
  console.log(loginStatus);

  //로그인 상태에 따라 버튼 비활성화를 색으로 표현해주기 위한 함수
  const LogoutColor = () => {
    if (loginUser.name !== "" || loginUser.nickname !== "") {
      return "";
    } else {
      return "black";
    }
  };

  const logoutColor = LogoutColor();

  const LoginColor = () => {
    if (loginUser.name !== "" || loginUser.nickname !== "") {
      return "black";
    } else {
      return "";
    }
  };

  const loginColor = LoginColor();

  //-----------------------------------------------------------------------------

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
            disabled={!loginStatus}
            type="button"
            style={{ color: logoutColor }}
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
                  window.location.href = "/";
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
              // navigation("/");
              // window.location.href = "/";
            }}
            value=" 로그아웃"
          />
          <input
            disabled={loginStatus}
            type="button"
            className="main-login btn-nomal-main"
            style={{ color: loginColor }}
            value="회원가입"
            onClick={() => {
              navigation("/join");
            }}
          />
          <input
            disabled={loginStatus}
            type="button"
            className="main-login btn-nomal-main"
            value="로그인"
            style={{ color: loginColor }}
            onClick={() => {
              navigation("/login");
              //window.location.href = 카카오소셜로그인링크; //위의 설정한 경로로 이동 -> 여기로 가면 AppIndex에서 카카오데이터 함수로 가도록 설정 되어 있다.
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
                onChange={(event) => {
                  //만약 검색창에 입력어가 있으면 해당 검색어에 대한 정보만 보여주기,
                  //일치하는게 없으면 없다고 알려주가,
                  //검색어를 입력하지 않으면 랜덤으로 5개만 보여주기(여기서 값을 통해 변수를 true,false로 만들어 true일때만 아래서 실행되도록 수정)
                  //event.target.value ==> 입력창에 입력된 값 -> searchType에 값을 넣어준다.
                  setSearchType(event.target.value);
                  // console.log("searchType : " + searchType);
                  SearchValue(event.target.value);
                }}
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
              // console.log(item);
              if (searchType === "" || searchType === undefined) {
                //검색창에 검색어가 입력 되어 있지 않다면 랜덤으로 뽑은 아파트 매물들을 보여주어라
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
              } else {
                //else문을 작성하지 않아도 문제는 없지만 화살표 함수에서 ==> 부분에 경고가 뜨기때문에 안전하게 하기 위해 작성함
                return false;
              }
            })}
          {/* {console.log("===============")}
           <SearchValue /> 
          {console.log("1. sameData , 2. apartData")}
          {console.log(sameData)} 
          {console.log(apartData)}
          컴포턴트 명은 항상 대문자로 시작  */}
          {searchData &&
            searchData.map((value, index) => {
              // console.log("현재 검색어가 입력 되어있을때 searchType은>>>");
              // console.log(searchType);
              if (searchType.trim() !== "") {
                return (
                  <div key={index}>
                    <div className="recommend-frame">
                      <div>아파트 : {value.apart_name}</div>
                      <div>거래 금액 : {value.trading_price} (단위:만원)</div>
                      <div>건축 년도 : {value.year_of_constuction}</div>
                      <div>
                        주소 : {value.raod_name}
                        {value.number}
                      </div>
                      <div>
                        지도 보기 :
                        <a
                          // href={`https://www.google.com/maps/place/${item.도로명}${item.지번}`}
                          href={`https://www.google.com/maps/place/${value.raod_name}${value.number}${value.apart_name}아파트`}
                          target={"_black"}
                        >
                          지도
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
}

export default Main;
