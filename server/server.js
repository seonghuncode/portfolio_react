const express = require("express");
const cors = require("cors");
const app = express();

const request = require("request");
const convert = require("xml-js");
const DB = { apart: [] };

app.use(cors()); //cors미들 웨이 추가 !!

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

//user에 관련된 코드---------------------------------------------
//로그인 정보를 저장 하는 DB
app.use(cors());
const UserDB = {
  user: [
    //회원수가 여러명이기에 user는 배열로 만든다
    {
      id: "a",
      pw: "a",
    },
  ],
};

//로그인시 서버로 넘어오는 부분
app.get("/login", (req, res) => {
  console.log("받은 데이터");
  // console.log(req.query); //client부분에서 보내는 값을 확인할 수 있다.
  console.log(JSON.parse(req.query.user)); //문자열로 넘어오기 때문에 객체로 변환

  const user = JSON.parse(req.query.user); //user라는 객체를 구조분해 할당으로 뺀다
  console.log("넘어온 user");
  console.log(user);
  const id = user.id;
  const pw = user.id;

  const result = {
    code: "success",
    message: "로그인 되었습니다.",
    user: null,
  };

  const 유효성배열 = [1];
  //유효성 검증(id, pw가 존재 하는가)
  for (let key in 유효성배열) {
    //배열을 for in반복문으로 돌린다
    if (id === "") {
      result.code = "fail";
      result.message = "아이디를 입력해 주세요";
      break;
    }
    if (pw === "") {
      result.code = "fail";
      result.message = "비밀번호를 입력해주세요";
      break;
    }

    //존재 하면 로그인 처리를 하는 코드
    // const findUser = UserDB.user.find((item) => {
    //   return item.id === id && item.pw === pw;
    // });
    const findUser = UserDB.user.find((item) => {
      return item.id === id && item.pw === pw;
    });
    console.log("findUser");
    console.log(findUser);

    if (findUser === undefined) {
      result.code = "fail";
      result.message = "정보가 일치하지 않습니다.";
      break;
    }
    result.user = findUser;
    res.send(result);
  }

  if (result.code === "fail") {
    res.send(result); //반복문이 끝나는 여기로 넘어온 것은 위에서 break되었기 때문이다.
  }
});

app.post("join", (req, res) => {
  console.log(req.query);
});
