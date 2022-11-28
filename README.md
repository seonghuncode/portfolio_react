# portfolio_react
프론트앤드5 포토폴리오 수업(오늘의 부동산(React + node.js) - 지역별 아파트 매매 정보 및 주변 편의 시설 정보 제공 부동산 서비스)


프론트앤드5-2(22.09.25/개인 프로젝트)

개인 프로젝트 서비스
(- 오늘의 부동산(React + node.js) - 지역별 아파트 매매 정보 및 주변 편의 시설 정보 제공 부동산 서비스)
참고 블로그
http://cafemate.shop
github.com/sungeun101/cafemate

📌1. 구현 기능 리스트
-회원 정보 수정 : 회원가입, 로그인, 로그아웃, 회원 정보 수정
-지역별 아파트 매매 정보 제공 서비스 : 동 검색을 통해 아파트 매매 정보를 제공, 시-구-동 옵션 선택을 통한 아파트 정보 제공
-최저가, 최고가 아파트 매매정보 : 검색한 지역별 아파트 목록에서 최저가, 최고가 매매 정보 제공
-선택한 아파트 로드뷰 : 선택한 아파트 주변을 카카오 로드뷰로 제공 
-주변 편의 시설 제공 : 은행, 마트,약국, 주요소, 카페, 편의점 정보 제공
-관심 목록 등록 : 로그인한 상태 에서 관심 목록 등록시 관심 목록 페이지 에서 한법에 제공
-1대1문의 서비스 : 로그인한 상태 에서 고객센터 문의(수정, 삭제 가능), 관리자 아이디시 모든 사용자의 문의를 확인하고 담급, 삭제 가능
-오늘의 부통산 뉴스 제공 서비스 : 실시간 네이버 부동산 뉴스 페이지를 크롤링 하여 당일 부동산 뉴스를 사용자 에게 제공


📌프로젝트 기본 구축----------------------------------------------------------------------------------------
client(react)===============
-npx create-react-app 프로젝트이름
-생성 되면 모든 프로젝트를 client로 옮겨주고 프로젝트 이름 지우기(client로 모든 파일 빼주기)
-npm install node-sass ==> scss사용 하기 위해
-npm install axios, npm install react-router-dom : 
(
axios : 브라우저나 node.js에서 비동기로 http 통신을 하기 위한 도구
react-router-dom : 페이지 이동
라우팅 : 사용자가 요청한 url에 따라 해당 url에 맞는 페이지를 보여주는 것
리액트 라우터 : 사용자가 입력한 주소를 감지 하는 역할을 하며, 여러 환경에서 동작하도록 라우터 컴포넌트 제공
(BrowserRouter, HashRouter로 나뉨)
)

server(node.js)====================
-npm init -> package.json생성(모두enter)
-server.js파일 추가
-npm install express
-npm install nodemon
-npm install cors
-server.js코드는 이전에 사용했던 코드 복사 해서 사용
-package.json에 "start": "nodemon server.js"추가(노드문 사용하기 위한 설정)
-server.js기본 세팅
	const express = require("express");
	const cors = require("cors");
	const app = express();

	app.use(cors()); //cors미들 웨이 추가

	app.get("/", function (req, res) {
	  res.send("Hello Node.js");
	});

	app.listen(5000, function () {
	  console.log("Start Node Server!");
	});

------------------------------------------------------------------------------------------------------------------



📌공공데이터 포탈 에서 데이터 가지고 오는 방법================================================================
step1
공공테이터 포탈 -> 로그인 -> 데이터 찾기, 목록 에서 원한느 데이터 찾기(데이터 종류가JSON->쉬운 변환,XML->변환이 어렵다)
-> 활용신청 -> 사유(간단하게) -> 상단 마이페이지 -> 해당 데이터 클릭 -> 일반인증키 복사 -> 미리보기에 확인 클릭하고 ServiceKey에 붙여 넣기
-> 미리보기 -> 데이터가 해당 형태에 맞게 보여진다.
->numOrsev에 50로 변경(50개의 데이터를 가지고 와서 보여준다)
[ 상세설명을 보고 참고 한다 - api정보 중 아래 요청변수(우리가 보낼 수 있는 파라미터, 쿼리스트링)중요, 줄수있는 값들 확인 ]


step2 사용방법 (End Point주소 == 주소) , 일반인증키 복사해서 넣고 미리보기 -> url에 ?전까지(쿼리스트링 전까지) 복사 == 쿼리스트링전까지
[App.js]

fucntion App(){

const testApi = async() => {
	const url = '쿼리스트링 전까지 붙여넣기';
	const serviceKey = '일반인증키 붙여넣기'

	//서버에 있는것 가지고 오는 것
	await axios({
		url : url,
		method : "get",
		params : {
			serviceKey : serviceKey,
			numOfRows : 50, //한페이지에 보여줄 데이터 갯수
			pageNo : 1
			}
	}).then((response) => { //성공시
		console.log(response);  // 콘솔을 보면 Object에 데이터를 보면 문자열로 된 데이터가 있다(XML형식일 경우). step3처럼 json으로 변환 필요
		console.log(response.data) //element data로 오기에 사용할 수 없다.(객체 or 배열로 만들어야 사용 가능)
		
		//바꾸기 위한 코드
		//import {parseStr} from "./helper/common-helper.js"; 해주고
		const jsonData = parseStr(response.data);
		console.log(jsonData);	
		//여기 까지 json으로 바꾸었지만 가공을 해주어야 한다. ==> 가공해서 필요한 정보만 모아주어야 한다(하나의 배열로)-console.log로 보고
		
		//이러한 형태로 바꾼다고 생각하고 진행 (EX)
		const data = [{
			name : "정보......",
		}] 

	}).catch(()=>{  //에러시
		console.log("에러!");
	})
}
React.useEffect(()=> {
	testApi();
},[])



}


step3 (javascript sml to json 구글링) : xml형태의 데이터를 불러오면 우리가 사용할 수 없다 따라서 json형식으로 변환을 해주어야 한다
만들어진 함수를 복사해서 사용

(
client에서 서버로 통신 -> 서버 에서 공공데이터 포털로 데이터 불러오기 -> 서버에서 데이터 가공(xml을 json....) -> 
->
)

[서버 에서 받는 방법이 어려워서 우선 client에서 받아와 사용]
1. npm install react-xml-parser
2. import XMLParser from "react-xml-parser
3. 사용할 곳에 넣어 주기 (src -> helper폴거 만들기 -> common-heleper.js )

import XMLParser from "react-xml-parser

function parseStr(dataSet) {
  const dataArr = new XMLParser().parseFromString(dataSet).children;
  return dataArr;
}

export {parserStr}

============================================================================================

📌공공 데이터 포털
공공데이터 에서 트래픽을 너무 많이 보내면 막아 버린다 -> 해당 api에 가서 운영계정을 신청하면 트래픽을 늘려준다


📌[서버에서 api불러 오는 방법]
 //react는axios를 사용했지만
  //node.js npm install request를 다운 받아 const request = require("request");를 사용하여 받아온다

📌공공데이터 xml데이터 -> json데이터로 수정
//xml의 데이터를 json형식으로 변환해주는 라이브러리 다운 받기
npm install xml-js
const convert = require(xml-js)

const xmlToJson = convert.xml2json(body, {compact: true, spaces: 4})
console.log(xmlToJson)

그리고 json형태를 우리가 사용하기 위해서 변환을  parseStr을  통해 한번더 사용해 주어야 한다.

----


📌[카카오톡 로그인 서비스 사용하기]
->kakao developers 로그인
->내 어플리 케이션
->어플리 케이션 추가 하기
->원하는 것 클릭,  웹 이름, 사업자 명, 체크 , 저장
->추가된다 -> 추가된것을 들어 간다
->플랫폼 설정하기 -> web플랫폼 등록(현재 web에서만 사용하기 때문에 이것만 사용한다)
->web 플랫폼 등록 -> 사이트 도메인 (ex. http://localhost:3000)
->redirect url등록 -> 등록하러 가기 -> 활성화 설정 ON
->redirect url 등록 -> http://localhost:3000/oauth/callback/kakao -> 설정
->왼쪽 카카오 로그인 동의 항목 -> 설정 닉네임 필수 동의  목적:테스트 개발 중 입니다
->프로필 사진 필수 동의 -> 목적 : 테스트 개발 중 입니다. (원하는 정보들 있으면 이렇게 체크)
==>kakao developers 설정 완료 나머지는 코드로 구현
(요약 정보에 있는 내용들 활용)
네이티브 앱키 : 모바일 에서 사용
REST API키, JavaScript키 필요

[용어, 기본 내용 정리]:
->callback : 부르고 뒤로 보낸다.(부르고 우리가 사용할 곳으로 보낸다) -> 보안 때문에 사용
로그인 할때 해당 로그인 버튼이 있다면 거기로 요청해야 한다 url, 새로고침 하면을 하면 보안상 데이터를 받을 수 없다
index.html -> <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>추가 (카카오에 있는 데이터를 받기 위해서는 카카오 자바스크립트를 추가 해주어야 한다.)

📌AWS클라이언트 올리는 방법 정리  https://velog.io/@gnos456/AWS%EC%82%AC%EC%9A%A9%EB%B2%95
📌AWS서버 부분 올리는 방법 정리 https://velog.io/@gnos456/AWS%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%84%9C%EB%B2%84DB-%EB%B6%80%EB%B6%84

-----------------------------------------------------------------------------------------------------------------------------------------------------------------








