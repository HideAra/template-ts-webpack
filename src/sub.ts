// module.exportを使ってhello関数を定義する。
export const hello = (message: string): void => {
  log(message);
};

function log(message: string): void {
  const text1 = <HTMLInputElement>document.getElementById("text1");

  text1.value = message; // innerHTMLでhtmlを追加

  console.log(`${message}を出力しました`);
}

// export function piyo() {}
