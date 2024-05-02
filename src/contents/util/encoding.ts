import Encoding from "encoding-japanese";

// UNICODE文字列 → EUC-JPエスケープに変えてくれる関数
export const toEscapedEUCJP = (str: string) => {
  // EUC-JP に変換
  const actual = Encoding.convert(
    str.split("").map((v) => v.charCodeAt(0)),
    "EUCJP",
    "UNICODE",
  );
  // URL用にエスケープ
  return Encoding.urlEncode(actual);
};
// EUC-JPエスケープ → UNICODE文字列に変えてくれる関数
export const decordEUCJP = (str: string) => {
  //エスケープを戻す
  const eucjpArray = Encoding.urlDecode(str);
  // UNICODE に変換
  const unicodeArray = Encoding.convert(eucjpArray, "UNICODE", "EUCJP");
  // 文字列に変換
  return Encoding.codeToString(unicodeArray);
};
