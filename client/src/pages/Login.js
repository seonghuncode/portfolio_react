function Join() {
  return (
    <div className="box-2">
      <img
        className="logo"
        src={`${process.env.PUBLIC_URL}/24209-house-ou-apartment.gif`}
        alt="로고GIF"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 12,
          width: "100%",
        }}
      >
        <input className="inputs" type="text" placeholder="이름" />
        <input className="inputs" type="email " placeholder="이멜일" />
        <input className="inputs" type="password" placeholder="비밀번호" />
        <input className="inputs" type="password" placeholder="비밀번호 확인" />
      </div>
      <button className="button">회원가입 하기</button>
    </div>
  );
}

export default Join;
