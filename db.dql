#수업 내용
#MySql

#xampp -> start -> 
#(mysql을 사용하기 위해 서버 설정을 자동으로 해주는 역할)

#sqlyog -> 새.. ->이름 설정 => 연결 -> 왼족 우클릭(데이터 베이스 생성), 데이터베이스문(utf-8), 
#데이터 베이스 대(utf8_general_ci) -> 생성

#테이블 생성 방법 -> 테이블 생성 -> 테이블이름, 엔진(inooDB),문자인코딩(utf8),콜레이션(utf8_general_ci)
#-> 테이블 만들기

DROP DATABASE IF EXISTS project_apart;
CREATE DATABASE project_apart;
USE project_apart;

#유저 테이블
CREATE TABLE `user`(
  id INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name`CHAR(50),
  email CHAR(50),
  `password` CHAR(50),
  nickname CHAR(50),
  `type` INT(2) NOT NULL 
)


#insert into 테이블명(id,pw) values('dfdf', 'dfdfdfdf'); or아래 방법 으로 테이블 값 넣기
#type = 1 ==> 일반 회원 , type = 2 ==> kakao회원

INSERT INTO `user`
SET `name` = "관리자",
email = "test@naver.com",
`password` = "123",
`type` = 1;



INSERT INTO `user`
SET nickname = "kakauser",
`password` = "123",
`type` = 2;


SELECT * FROM `user`;



#부동산 API테이블
CREATE TABLE apart(
id INT(50) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
trading_price VARCHAR(50) NOT NULL,
trading_type VARCHAR(10),
year_of_constuction VARCHAR(20) NOT NULL,
`year` VARCHAR(20) NOT NULL,
raod_name VARCHAR(30) NOT NULL,
road_name_main_code VARCHAR(30) NOT NULL,
road_name_unmain_code VARCHAR(30) NOT NULL,
road_name_city_code VARCHAR(30) NOT NULL,
road_name_serial_number VARCHAR(30) NOT NULL,
road_name_ground_underground_code VARCHAR(30) NOT NULL,
road_name_code VARCHAR(20) NOT NULL,
court_building VARCHAR(20) NOT NULL,
court_building_main_code VARCHAR(30) NOT NULL,
court_building_unmain_code VARCHAR(30) NOT NULL,
court_building_city_code VARCHAR(30) NOT NULL,
court_building_town_code VARCHAR(30) NOT NULL,
court_building_code VARCHAR(20) NOT NULL,
apart_name VARCHAR(20) NOT NULL,
`month` VARCHAR(20) NOT NULL,
`day` VARCHAR(20) NOT NULL,
serial_number VARCHAR(20) NOT NULL,
dedicated_area VARCHAR(20) NOT NULL,
broker VARCHAR(10),
`number` VARCHAR(10) NOT NULL,
number_code VARCHAR(10) NOT NULL,
`floor` VARCHAR(10) NOT NULL,
clear_reason VARCHAR(10),
clear VARCHAR(10)
)

SELECT * FROM apart;


SELECT * FROM apart LIMIT 10000000000000000000;

TRUNCATE apart;