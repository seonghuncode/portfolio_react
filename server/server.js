const express = require("express");
const cors = require("cors");
const app = express();

const request = require("request");
const convert = require("xml-js");
const DB = { apart: [] };

app.use(cors()); //cors미들 웨이 추가

app.get("/", function (req, res) {
  res.send("Hello Node.js");
});

app.listen(5000, function () {
  console.log("Start Node Server!");
});

//여기서 공공데터 포털에 요청을 한다
app.get("/apartAPI", async function (req, res) {
  //react는axios를 사용했지만
  //node.js npm install request를 다운 받아 const request = require("request");를 사용하여 받아온다
  if (DB.apart.length > 0) {
    res.send(DB.apart);
    return;
  }
  request(
    {
      uri: "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev", //요청 보내고 싶은 주소
      method: "get",
      qs: {
        //쿼리스트링 params랑 같다고 생각
        serviceKey:
          "WM+MJ1skpxpAh/LF6vyhnwEyYL6jE0z2qKopFOydxC8gt8G9cJ9sQror5m99zhcElmmdgcYb/sWQ+6jNqjdGCA==",
        numOfRows: 50,
        LAWD_CD: 11110,
        DEAL_YMD: 201512,
      },
    },
    function (error, response, body) {
      //정상 동작 했을 경우 실행 되는 함수

      const xmlToJson = convert.xml2json(body, { compact: true, spaces: 4 });
      const apiData = JSON.parse(xmlToJson);
      const apartData = apiData.response.body.items.item;
      const result = [];

      //데이터가 들어 있으면
      if (apartData.length > 0) {
        apartData.forEach((obj) => {
          // console.log(obj);
          let resultObject = {};

          for (let key in obj) {
            //객체 안에 반복문을 돌리는 for in반복문
            const value =
              obj[key]?._text === undefined
                ? null
                : obj[key]?._text.replaceAll(" ", ""); //공백을 없애는 기능

            resultObject[key] = value;
          }
          result.push(resultObject);
        });
      }
      // console.log(result);
      console.log(DB.apart);
      DB.apart = result;
      // res.send(result);
      res.send(DB.apart);
    }
  );
});
