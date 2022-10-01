import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Main() {
  return (
    <div className="mainFrame">
      <div className="nav-main">
        <input type="button" className="btn-nomal-main" value="오늘의 부동산" />

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
        <div>
          <form>
            <input
              className="search"
              type="text"
              placeholder="지역 또는 단지명을 입력하세요. "
            />

            <button style={{ margin: "5px" }} type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="3x" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Main;
