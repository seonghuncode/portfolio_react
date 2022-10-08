const express = require("express");
const cors = require("cors");
const app = express();

const request = require("request");

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
  request(
    {
      uri: "https://cors-anywhere.herokuapp.com/http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev", //요청 보내고 싶은 주소
      method: "get",
      qs: {
        //쿼리스트링 params랑 같다고 생각
        serviceKey:
          "WM+MJ1skpxpAh/LF6vyhnwEyYL6jE0z2qKopFOydxC8gt8G9cJ9sQror5m99zhcElmmdgcYb/sWQ+6jNqjdGCA==",

        LAWD_CD: 11110,
        DEAL_YMD: 201512,
      },
    },
    function (error, response, body) {
      //정상 동작 했을 경우 실행 되는 함수
      console.log(response);
    }
  );
  res.send();
});
