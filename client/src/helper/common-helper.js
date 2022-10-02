import XMLParser from "react-xml-parser";

function parseStr(dataSet) {
  const dataArr = new XMLParser().parseFromString(dataSet).children;
  return dataArr;
}

export { parseStr };
