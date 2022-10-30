const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");

const session = require("express-session");
const fileStore = require("session-file-store")(session); // session file store

const server = http.createServer(app);

const request = require("request");
const convert = require("xml-js");

app.use(
  session({
    secret: "Session",
    saveUninitialize: true,
    store: new fileStore(), // 세션 객체에 세션스토어를 적용
    resave: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//mysql연결====================================================
const mysql = require("mysql2");
const { query } = require("express");
const { initParams } = require("request");
const DB2 = mysql.createPoolCluster();
DB2.add("project_apart", {
  //데이터베이스 이름 + 객체
  host: `127.0.0.1`, // == localhost
  user: "root",
  password: "",
  database: "project_apart", //sql에서 만든 데이터 베이스 이름
  port: 3306,
  //
  //개인 노트북 sql??
  // host: `127.0.0.1`, // == localhost
  // user: "ysh",
  // password: "ysh123",
  // database: "project_apart", //sql에서 만든 데이터 베이스 이름
  // port: 3306,
});

//mysql연결=====================================================

//mysql 가져오기==============================================================================================
app.get("/user", async (req, res) => {
  //async쓰면 안에서  await사용 가능(await사용하려면 최상의 부모한태 async)

  //외부에서 가지고 오는 것은 대부분은 비동기 이다
  //비동기 = promisr 객체, (DB2.getConnection은 비동기라 /user로 오면 나머지가 다 실행되고 맨 마지막에 실행 된다)
  //promise객체를 우리가 사용하도록 바꾸기 위해서는

  const data = await 디비실행({
    database: "project_apart",
    query: "SELECT * FROM user",
  });

  res.send(data);
});

//간단하게 함수화 하기
async function 디비실행(params) {
  //데이터 베이스, 쿼리를 받아 사용
  const { database, query } = params;

  const data = await new Promise((resolve, reject) => {
    // //promise객체를 우리가 사용하도록 바꾸기 위해서는 : 이 객체를 사용비동기 -> 동기
    DB2.getConnection(database, (error, connection) => {
      // 해당 함수가 user데이터 베이스와 연결을 하겠다
      if (error) {
        console.log("데이터 베이스 연결 오류 ===>", error);

        reject(error);
      } // 오류 나면 종료

      connection.query(query, (error, data) => {
        //query == sql문법
        if (error) {
          console.log("쿼리 오류 ==> ", error);

          reject(error);
        }

        resolve(data); //resolve로 받아 넘겨주어 사용한다고 생각
      });

      connection.release(); // 연결을 중복해서 여러번 요청하면 에러 한번 요청, 반환 하는 구조
    });
  });
  return data;
}
//mysql 가져오기=============================================================================================

//----------------------------------------------------------------------------------apart api mariaDB에 저장하기

//---------------------mariaDb에 넣기 위해 sql문 컬럼명으로 1대1 매칭 시켜준다
const a = {
  거래금액: "trading_price",
  거래유형: "trading_type",
  건축년도: "year_of_constuction",
  년: "year",
  도로명: "raod_name",
  도로명건물본번호코드: "road_name_main_code",
  도로명건물부번호코드: "road_name_unmain_code",
  도로명시군구코드: "road_name_city_code",
  도로명일련번호코드: "road_name_serial_number",
  도로명지상지하코드: "road_name_ground_underground_code",
  도로명코드: "road_name_code",
  법정동: "court_building",
  법정동본번코드: "court_building_main_code",
  법정동부번코드: "court_building_unmain_code",
  법정동시군구코드: "court_building_city_code",
  법정동읍면동코드: "court_building_town_code",
  법정동지번코드: "court_building_code",
  아파트: "apart_name",
  월: "month",
  일: "day",
  일련번호: "serial_number",
  전용면적: "dedicated_area",
  중개사소재지: "broker",
  지번: "number",
  지역코드: "number_code",
  층: "floor",
  해제사유발생일: "clear_reason",
  해제여부: "clear",
};

function 인서트만들기(params) {
  const { table, data } = params;
  const 컬럼 = Object.keys(data);
  const 값 = Object.values(data);

  const 쿼리 = `INSERT INTO ${table}(${컬럼.join(",")}) VALUES('${값.join(
    "','"
  )}')`;

  return 쿼리;
}

app.get("/apartAPI", async function (req, res) {
  try {
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
      async function (error, response, body) {
        //정상 동작 했을 경우 실행 되는 함수
        const xmlToJson = convert.xml2json(body, { compact: true, spaces: 4 });
        const apiData = JSON.parse(xmlToJson);
        const apartData = apiData.response.body.items.item;
        const result = [];

        console.log("mariaDB에 넣기 위해 apartAPI에서 불러온 body");

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

              const 키다시정의 = a[key]; //sql 컬럼에에 맞게 재정의  ex. 키다시정의 = a[거래금액] ==> trading_price

              resultObject[키다시정의] = value; //resultObject[]
            }
            result.push(resultObject);
          });
        }

        console.log("mariaDB에 넣기 위한 코드===========================");
        console.log("result값");
        console.log(result);

        console.log(result.length);

        let cnt = 0;

        for await (let item of result) {
          const 쿼리 = 인서트만들기({
            table: "apart",
            data: item,
          });

          console.log("실행중 ========>", cnt);

          await 디비실행({
            database: "project_apart",
            query: 쿼리,
          });
          cnt++;
        }

        console.log("끝남");

        res.send(result);
        // console.log(result);
      }
    );
  } catch (e) {
    console.log(e);
  }
});

//----------------------------------------------------------------------------------apart api mariaDB에 저장하기

app.get("/", function (req, res) {
  res.send("Hello Node.js");
});

server.listen(5000, () => {
  console.log("Start Server..");
});

app.get("/apartAPI2", (req, res) => {
  res.send("?");
});

// //user에 관련된 코드---------------------------------------------
// //로그인 정보를 저장 하는 DB
// app.use(cors());
// const UserDB = {
//   user: [
//     //회원수가 여러명이기에 user는 배열로 만든다
//     {
//       id: "a",
//       pw: "a",
//     },
//   ],
// };

// //로그인시 서버로 넘어오는 부분 (비밀번호릐 경우 암호화 처리 필요!! - js비밀번호 암호화 처리)
// app.get("/login", (req, res) => {
//   console.log("받은 데이터");
//   // console.log(req.query); //client부분에서 보내는 값을 확인할 수 있다.
//   console.log(JSON.parse(req.query.user)); //문자열로 넘어오기 때문에 객체로 변환(하얀색 : 문자열, 초록색 : 객체)

//   const user = JSON.parse(req.query.user); //user라는 객체를 구조분해 할당으로 뺀다
//   console.log("넘어온 user");
//   console.log(user);
//   const id = user.id;
//   const pw = user.pw;

//   const result = {
//     code: "success",
//     message: "로그인 되었습니다.",
//     user: null,
//   };

//   const 유효성배열 = [1];
//   //유효성 검증(id, pw가 존재 하는가)
//   for (let key in 유효성배열) {
//     //배열을 for in반복문으로 돌린다
//     if (id === "") {
//       result.code = "fail";
//       result.message = "아이디를 입력해 주세요";
//       break;
//     }
//     if (pw === "") {
//       result.code = "fail";
//       result.message = "비밀번호를 입력해주세요";
//       break;
//     }

//     //존재 하면 로그인 처리를 하는 코드
//     // const findUser = UserDB.user.find((item) => {
//     //   return item.id === id && item.pw === pw;
//     // });
//     const findUser = UserDB.user.find((item) => {
//       return item.id === id && item.pw === pw;
//     });
//     console.log("findUser");
//     console.log(findUser);

//     if (findUser === undefined) {
//       result.code = "fail";
//       result.message = "정보가 일치하지 않습니다.";
//       break;
//     }
//     result.user = findUser;
//     res.send(result);
//   }

//   if (result.code === "fail") {
//     res.send(result); //반복문이 끝나는 여기로 넘어온 것은 위에서 break되었기 때문이다.
//   }
// });

// app.post("join", (req, res) => {
//   console.log(req.query);
// });

//------------------------------------------------------------------------------------------------------------------userDB
//카카카오 기능으로 로그인 할 경우 로그인 정보를 저장해 주는 정보--------------------------------------
// const kakaoDB = {
//   user: [
//     {
//       nickname: "관리자",
//       backgroundUrl: "관리자",
//     },
//   ],
// };

const UserDB = {
  user: [
    {
      name: "테스트 name",
      email: "test2@naver.com",
      password: "123",
    },
    {
      name: "관리자",
      email: "test@naver.com",
      password: "123",
    },
    {
      nickname: "관리자",
      backgroundUrl: "관리자",
    },
  ],
};
//------------------------------------------------------------------------------------------------------------------userDB

//---------------------------------------------------------------------------------------------------------------자동 로그인

app.get("/autoLogin", (req, res) => {
  console.log("AUTO LOGIN ================================");
  console.log(req.session);
  console.log("AUTO LOGIN ================================");

  res.send("");
});

/**
 * req.session.destroy(function(){
req.session;
});
 */
//---------------------------------------------------------------------------------------------------------------자동 로그인

//---------------------------------------------------------------------------------------------------------------카카오 로그인
app.get("/kakaoLogin", (req, res) => {
  // console.log(req.query);
  // console.log(req.query.user); //이렇게 사용하면 문자열로 사용할 수 없다.
  console.log("클라이언트 에서 넘어온  user정보 입니다");
  console.log(JSON.parse(req.query.user));
  const user = JSON.parse(req.query.user);

  UserDB.user.push(user);

  const result = {
    code: "success",
    message: "로그인 되었습니다.",
    user: user,
  };
  req.session.loginUser = user;
  req.session.save((error) => {
    if (error) console.log(error);
  });

  res.send(result);
});
//---------------------------------------------------------------------------------------------------------------카카오 로그인

//회원 가입을 진행하는 서버----------------------------------------------------------------------------------------------------
app.get("/join", (req, res) => {
  console.log("회원가입 서버 입니다");
  console.log(JSON.parse(req.query.user));

  const user = JSON.parse(req.query.user);

  const name = user.name;
  const email = user.email;
  const password1 = user.password1;
  const password2 = user.password2;

  const result = {
    code: "success",
    message: "회원가입이 왼료 되었습니다.",
    user: null,
  };

  const 유효성배열 = [1];
  for (let key in 유효성배열) {
    if (name === "") {
      result.code = "fail";
      result.message = "name을 입력해 주세요";
      break;
    }

    if (email === "") {
      result.code = "fail";
      result.message = "email을 입력해 주세요";
      break;
    }

    if (password1 === "") {
      result.code = "fail";
      result.message = "passord1를 입력해 주세요";
      break;
    }

    if (password2 === "") {
      result.code = "fail";
      result.message = "passord2를 입력해 주세요";
      break;
    }

    if (password1 !== password2) {
      result.code = "fail";
      result.message = "입력한 비밀번호 두개가 일치하지 않습니다.";
      break;
    }

    const checkExistEmail = UserDB.user.findIndex((item) => {
      return item.email === email;
    });
    console.log("checkExistEmail");
    console.log(checkExistEmail);
    if (checkExistEmail !== -1) {
      //존재 하는 값이 없을 경우 -1이 나온다
      result.code = "fail";
      result.message = "해당 email은 이미 존재하는 email입니다.";
      break;
    }
  }

  UserDB.user.push(user);
  result.user = user;
  res.send(result);
  console.log("저장이 되었는지 확인 하기");
  console.log(UserDB);
});

//회원 가입을 진행하는 서버----------------------------------------------------------------------------------------------------

//일반 로그인 진행하는 서버---------------------------------------------------------------------------------------------------
app.get("/login", (req, res) => {
  console.log(req.query);
  console.log(JSON.parse(req.query.user));

  const userInfo = JSON.parse(req.query.user);
  const email = userInfo.email;
  const password = userInfo.password;
  // console.log(email);
  // console.log(password);

  const result = {
    code: "success",
    message: "로그인 성공 했습니다.",
    user: null,
  };

  const 유효성배열 = [1];
  for (let key in 유효성배열) {
    //객체안 키값으로 반복문
    if (email === "") {
      result.code = "fail";
      result.message = "email을 입력해 주세요";
      break;
    }

    if (password === "") {
      result.code = "fail";
      result.message = "password를 입력해 주세요";
      break;
    }

    const findUser = UserDB.user.find((item) => {
      return item.email === email && item.password === password;
    });
    console.log("=============findUser====================");
    console.log(findUser);

    if (findUser === undefined) {
      result.code = "fail";
      result.message =
        "존재하지 않는 email 또는 password 입니다. 확인해 주세요";
      break;
    }
    result.user = findUser;
    console.log(findUser);
  }
  //로그인이 최종적으로 되면 세션을 넣어 주어야 한다
  req.session.loginUser = userInfo;
  req.session.save((error) => {
    if (error) console.log(error);
  });
  res.send(result);
});
//일반 로그인 진행하는 서버---------------------------------------------------------------------------------------------------
