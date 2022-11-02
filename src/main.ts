import { hello } from "./sub";
// import文を使ってSassファイルを読み込む。
import "./css/style.scss";

// sub.jsに定義されたJavaScriptを実行する。
hello("abbbbあら");

const button = <HTMLButtonElement>document.getElementById("btn1");
button.addEventListener("click", butotnClick);

// export default function () {
$("#hoge").text("hello");
// }

function butotnClick() {
  console.log("Click");
}

// export function sayMessage() {
//   console.log("aaaaa");
//   hello("abbbb");
// }

// export function sayMessage(message: string) {
//   hello(message);
//   alert(message);
// }
