import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../App";

function AllData() {
  const navigation = useNavigate();
  const [AllApartData, setAllApartData] = React.useState();

  const allApart = async () => {
    await axios({
      url: "http://localhost:5000/findDataFromDB",
    })
      .then((response) => {
        setAllApartData(response.data);
        console.log("==========");
        console.log(AllApartData);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    allApart();
  }, []);

  return (
    <div className="TopCenter">
      <div>
        <table className="topTable">
          <caption style={{ fontWeight: "bold" }}>전체 아파트 정보</caption>
          <thead className="thead">
            <tr>
              <th className="th-td">번호</th>
              <th className="th-td">아파트 이름</th>
              <th className="th-td">중공 일시</th>
              <th className="th-td">거래일(년.월.일)</th>
              <th className="th-td">주소</th>
              <th className="th-td">거래 유형</th>
              <th className="th-td">가격(단위 : 만원)</th>
              <th className="th-td">층</th>
              <th className="th-td">중개인 지역</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {AllApartData &&
              AllApartData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="th-td">{index + 1}</td>
                    <td className="th-td">
                      <div>{item.apart_name}</div>
                    </td>
                    <td className="th-td">
                      <div>{item.year_of_constuction}</div>
                    </td>
                    <td className="th-td">
                      <div>
                        {item.year}.{item.month}.{item.day}
                      </div>
                    </td>
                    <td className="th-td">
                      <div>
                        {item.road_name}
                        {item.number}
                        {item.apart_name}
                      </div>
                    </td>
                    <td className="th-td">
                      <div>{item.trading_type}</div>
                    </td>
                    <td className="th-td">
                      <div>{item.trading_price}</div>
                    </td>
                    <td className="th-td">
                      <div>{item.floor}</div>
                    </td>
                    <td className="th-td">
                      <div>{item.broker}</div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <input
        style={{
          float: "right",
          textAlign: "right",
          backgroundColor: "aqua",
          margin: "10px",
        }}
        type="button"
        value="뒤로가기"
        onClick={() => {
          navigation("/");
        }}
      />
    </div>
  );
}

export default AllData;
