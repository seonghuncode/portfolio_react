import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";
import { parseStr } from "../helper/common-helper.js";
import axios from "axios";

function Main() {
  const apartAPI = async () => {
    const url =
      "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";
    const serviceKey =
      "WM+MJ1skpxpAh/LF6vyhnwEyYL6jE0z2qKopFOydxC8gt8G9cJ9sQror5m99zhcElmmdgcYb/sWQ+6jNqjdGCA==";

    await axios({
      url: "미정",
      method: "get",
      params: {
        serviceKey: serviceKey,
        numOfRows: 50,
        pageNo: 1,
      },
    })
      .then((response) => {
        console.log(response);
        console.log(response.date);

        //JSON데이터로 변환
        const jsonData = parseStr(response.data);
        console.log(jsonData);

        //바꾼데이터를 변환 시키기
      })
      .catch(() => {
        console.log("에러!!");
      });
  };
  React.useEffect(() => {
    apartAPI();
  }, []);

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
          />

          <input
            type="button"
            className="main-login btn-nomal-main"
            value="로그인"
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
    </div>
  );
}

export default Main;
