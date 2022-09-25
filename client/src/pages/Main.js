import React from "react";
import "./Main.scss";
import { AIcon } from "react-icons/fa";

function Main() {
  return (
    <div>
      <div>
        <div className="search-container">
          <div className="search__inner">
            <h1 className="search__title">어떤 아파트를 찾으세요?</h1>
            <div className="search__option-btn-group">
              <p className="search__option-btn">매물</p>
              <p className="search__option-btn">분양</p>
            </div>
            <form className="search__form">
              <label htmlFor="search-input">
                {/* <AIcon type="search" class="search__form__icon" /> */}
              </label>
              <input
                type="text"
                id="search-input"
                placeholder="지역 또는 단지명을 입력하세요."
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
