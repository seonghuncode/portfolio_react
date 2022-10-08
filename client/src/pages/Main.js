import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";
import { parseStr } from "../helper/common-helper.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigation = useNavigate();
  const [apartData, setapartData] = React.useState({});
  const [loading, setLoading] = React.useState(true); //아래서 삼항식을 통해 true이면 로딩화면을 false이면 회면을 보여주기 위한 변수

  //리액트에서 api를 불러오는 방법이 아니라 server에서 불러오기
  const apartAPI = async () => {
    await axios({
      url: "http://localhost:5000/apartAPI",
    })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    apartAPI();
  });

  return (
    <div>
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
            value="회원가입"
            onClick={() => {
              navigation("join");
            }}
          />

          <input
            type="button"
            className="main-login btn-nomal-main"
            value="로그인"
            // onClick={}
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
            >
              <FontAwesomeIcon
                style={{ padding: "1px" }}
                icon={faMagnifyingGlassLocation}
                size="2x"
              />
            </button>
          </div>
        </div>
      </div>

      {/**추천 매울에 대한 정보를 정리해서 보여준다*/}
      {/* 한번에 가지고 온 50개의 데이터를 5개를 랜덤 숫자를 뽑아 5개의 값을 추천으로 보여 준다. */}

      <div
        onClick={() => {
          apartData();
        }}
      ></div>
    </div>
  );
}

export default Main;
