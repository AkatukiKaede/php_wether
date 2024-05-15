// addeventlistenerのために都道府県のセレクトボックスを指定
const prefsElement = document.getElementById("prefs");

// cookieから取り出すための変数定義
let weather;
let tempmax;
let tempmin;
let weather_icon;
let prefname;
let prefcode;

// セレクトボックス変更の感知
prefsElement.addEventListener("change", (event) => {
  // read関数の定義
  const read = async function (prefsElement) {
    // セレクトボックス指定
    prefsElement = document.getElementById("prefs");
    // セレクトボックスのvalueを取得(jsonのcodeを取得するため)
    const PrefCode = "00" + String(`${prefsElement.value[(0, 2)]}`);
    // 取得したcodeからprefcodeを取り出すためにjsonファイルを指定
    const PrefsResponce = await fetch("./prefectures/" + PrefCode + ".json");
    // jsonファイルの読み取り
    const Prefs = await PrefsResponce.json();
    // jsonファイルの行数指定するためにもう一つのvalueを読みとり
    const Prefcode1 = parseInt("00" + String(`${prefsElement.value[(0, 6)]}`));
    // jsonファイルから都道府県名とprefcodeを取得
    prefcode = `${Prefs[Prefcode1 - 1].prefcode}`;
    prefname = `${Prefs[Prefcode1 - 1].name}`;
    // prefcodeをcookieに保存
    document.cookie = "prefcode=" + prefcode; // key=value
    // fetchdataの起動
    fetchData();
  };
  read();
});

// メインとなるindex.phpとは別にDBを操作するためのdb.phpを動かすための関数
// prefcodeを取得後でないと動かないためJSから起動
async function fetchData() {
  try {
    // PHPファイルを非同期で取得
    const response = await fetch("db.php");
    // 天気を表示するためのid取得
    const weatherprevElement = document.getElementById("weatherprev");
    // cookie一括取得＆デコードのためにdecodecookiesを起動
    decodeCookies();

    // 取得したcookieを変数に格納後、表示
    weatherprevElement.innerHTML = ` 
    <div id="iconheader">   
    <h2>${prefname}の天気</h2>
    <img src="./weather_icon/${weather_icon}.png">
    </div>
    <div id="info">
    <ul> 
    <li><p>天気:${weather}</p></li><br>
    <li><p>最高気温:${tempmax}</p></li><br>
    <li><p>最低気温:${tempmin}</p></li>
    </ul>
    </div>
`;
    // 以下DBに接続できなかった場合の処理
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.text(); // レスポンスのテキストを取得
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// cookie一括取得&デコードに関する関数
function decodeCookies() {
  // すべてのCookieを取得
  const cookies = document.cookie;
  // Cookieが存在しない場合の処理
  if (!cookies) {
    console.log("No cookies found");
    return;
  }

  // Cookieを「;」で分割して個別のCookieにする
  const cookieArray = cookies.split(";");
  // 各Cookieを処理
  cookieArray.forEach((cookie) => {
    // 名前と値を分割
    const [name, value] = cookie.split("=");
    // 名前と値の前後の空白を削除し、値をデコード
    const decodedName = decodeURIComponent(name.trim());
    const decodedValue = decodeURIComponent(value.trim());

    // 取り出したcookieを変数に格納するためにswitch文を使用
    switch (decodedName) {
      case "tempmax":
        tempmax = decodedValue;
        break;
      case "weather":
        weather = decodedValue;
        break;
      case "tempmin":
        tempmin = decodedValue;
        break;
      case "weather_icon":
        weather_icon = decodedValue;
        break;
    }
  });
}
