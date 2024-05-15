// セレクトボックス全体のidの取得
const rootElement = document.getElementById("weather");

// メインで動く関数
async function initAreaSelector() {
  await updateRegion();
  await updatePrefectures();
}

// region.jsonの取得(地方の取得)
async function getRegion() {
  const regionResponce = await fetch("region.json");
  return await regionResponce.json();
}

// prefectures.jsonの取得
async function getPrefectures(regionCode) {
  // 地方が選択されてないときor初回起動時
  if (`${regionCode}` === "選択してください" || `${regionCode}` === null) {
    prefs.value = null;
    createPrefOptionsHtml(prefs);
  } else {
    // 地方が選択されてる=>codeに対応したjsonファイル(地方ごとに分けたjsonファイル)の読み取り
    const cityResponce = await fetch(`./prefectures/${regionCode}.json`);
    return await cityResponce.json();
  }
}

// 取得したjsonをhtmlを作るCreateRegionHtmlに渡す関数
async function updateRegion() {
  const regions = await getRegion();
  createRegionOptionsHtml(regions);
}

// 地方によって取得した地方の値をprefに投げる=>それに応じたjsonファイルでCreatePrefOptionsHtmlに値を渡す
async function updatePrefectures() {
  try {
    // 地方のセレクトボックスのid指定
    const RegionSelectorElement = rootElement.querySelector("#region");
    // セレクトボックスのvalue読み取り
    const prefs = await getPrefectures(RegionSelectorElement.value);
    // 受け取ったvalueをセレクトボックスを生成する関数に渡す
    createPrefOptionsHtml(prefs);
  } catch (e) {
    createPrefOptionsHtml(prefs);
  }
}

// 地方のセレクトボックスを生成する関数
function createRegionOptionsHtml(regions) {
  const optionsStrs = [];
  // セレクトボックスの一番上に「選択してください」を表示する
  optionsStrs.push(
    `<option name="選択してください" value="選択してください" >選択してください</option>`
  );
  // 受け取ったjsonファイルの中身を一つずつ取り出してセレクトボックスに入れる
  for (const region of regions) {
    optionsStrs.push(`
        <option name="${region.name}>" value="${region.code}">${region.name}</option>`);
  }
  // セレクトボックスを表示したいところのidを取得(#region)
  const regionSelectorElement = rootElement.querySelector("#region");
  // 出力
  regionSelectorElement.innerHTML = optionsStrs.join("");

  // 地方のセレクトボックスの中身が変わったか感知
  regionSelectorElement.addEventListener("change", (event) => {
    updatePrefectures();
  });
}

// 都道府県のセレクトボックスを生成する関数
function createPrefOptionsHtml(prefs) {
  const optionStrs = [];

  // 地方のセレクトボックスが初期値(選択してください)もしくは初回起動時の時に都道府県のセレクトボックスに「--」を表示
  if (prefs.value === "選択してください" || prefs.value === null) {
    optionStrs.length = 0;
    optionStrs.push('<option name="none" value="none">--</option>');
  } else {
    // 地方が入力された状態でセレクトボックスの一位上に「選択してください」を表示
    optionStrs.push(
      `<option name="選択してください" value="選択してください" >選択してください</option>`
    );
    // 受け取ったjsonファイルの中身を一つずつ取り出す
    for (const pref of prefs) {
      optionStrs.push(`
          <option name="${pref.name}" value="${pref.prefCode},${pref.code}" >${pref.name}</option>`);
    }
  }
  // セレクトボックスを表示したいところを取得(今回は#prefs)
  const prefSelectorElement = rootElement.querySelector("#prefs");
  // 出力
  prefSelectorElement.innerHTML = optionStrs.join("");
}

initAreaSelector();
