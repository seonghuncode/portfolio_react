import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";
import { parseStr } from "../helper/common-helper.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../App";

function Main() {
  const navigation = useNavigate();
  const [apartData, setapartData] = React.useState();
  const [loading, setLoading] = React.useState(true); //아래서 삼항식을 통해 true이면 로딩화면을 false이면 회면을 보여주기 위한 변수
  const randomValue = []; //랜덤값을 넣기 위한 배열

  //랜덤 값으로 5개를 무작위로
  const getRandom = function (length) {
    return parseInt(Math.random() * length);
  };

  //리액트에서 api를 불러오는 방법이 아니라 server에서 불러오기
  const apartAPI = async () => {
    await axios({
      url: "http://localhost:5000/apartAPI",
    })
      .then((response) => {
        // 랜덤값 5개를 뽑는 알고리즘

        console.log(response.data);
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
    apartAPI();
  }, []); //빈 배열을 넣어 주어야 한번만 실행 된다.(없으면 랜더링 될때마다 실행)

  //로그인 괸련 변수 선언
  const { loginUser, setLoginUser } = React.useContext(StoreContext);

  return (
    <div>
      안녕하세요 {loginUser.id}님 !{""}
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
            onClick={() => {
              localStorage.removeItem("loginUser");
              setLoginUser({
                id: "",
                pw: "",
              });
              navigation("/login");
            }}
            value=" 로그아웃"
          />
          <input
            type="button"
            className="main-login btn-nomal-main"
            value="회원가입"
            onClick={() => {
              navigation("join");
            }}
          />
          <input
            type="button"
            className="main-login btn-nomal-main"
            value="로그인"
            onClick={() => {
              navigation("/login");
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
                apartAPI();
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
                    <div>아파트 : {item.아파트}</div>
                    <div>거래 금액 : {item.거래금액}</div>
                    <div>건축 년도 : {item.건축년도}</div>
                    <div>
                      주소 : {item.도로명}
                      {item.지번}
                    </div>
                    <div>
                      지도 보기 :
                      <a
                        // href={`https://www.google.com/maps/place/${item.도로명}${item.지번}`}
                        href={`https://www.google.com/maps/place/${item.도로명}${item.지번}${item.아파트}아파트`}
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
