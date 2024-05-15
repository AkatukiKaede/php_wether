<?php
// cookieからcitycodeを取り出す
$citycode=$_COOKIE["citycode"];
// 今日の日付を取得
$today=date("Y-m-d") ;
// 日付を取得→db内に格納されている日付と比較してその天気が今日のものかを比較
// citycodeはdb内のキーなのでcookieで取得する

// db接続のための変数格納
// $dsn = 'mysql304.phy.lolipop.lan';
$dsn = 'mysql:host=mysql304.phy.lolipop.lan;dbname=LAA1600389-weather;charset=utf8';
$username = 'LAA1600389';
$password = 'Akatsukikawaii30';

try {
  // db接続
    $dbh = new PDO($dsn, $username, $password);
      
    // sql文でcitycodeが一致するデータを取りだす
    $sql = "SELECT * FROM weather WHERE citycode =" . $citycode . "";
    $sth = $dbh->prepare($sql);
    // sql文の実行
    $sth->execute();
    $result = $sth->fetchAll();
    
    // 取り出したデータをそれぞれの変数に格納
    foreach ($result as $row) {

        $date=strval($row['date']);
        $weather=$row['today_weather'];
        $tempsMax=$row['tempsmax'];
        $tempsMin=$row['tempsmin'];
    }

    // db内のデータと$today(今日の日付)が一致してない場合、気象庁のapiから天気を取得→dbに格納
        if ($today!==$date){
          //気象庁のAPIにて気象情報取得
          $url = "https://www.jma.go.jp/bosai/forecast/data/forecast/".$citycode.".json";
          $weather_json = file_get_contents($url);
          $weather_array = json_decode($weather_json, true);


          // 取得したjsonファイルから日付、天気、最高気温、最低気温を抽出
          // $weather_iconは抽出した天気から最初の天気の文言のみ抽出(晴れ、くもり、雨、雪のみ)
          $dated = $weather_array["0"]["timeSeries"]["0"]["timeDefines"]["0"];
          $weather = $weather_array["0"]["timeSeries"]["0"]["areas"]["0"]["weathers"]["0"];
          $tempsMax = $weather_array["1"]['timeSeries']["1"]['areas']["0"]['tempsMax']["1"];
          $tempsMin = $weather_array["1"]['timeSeries']["1"]['areas']["0"]['tempsMin']["1"];
          $weather_icon = mb_split("　", $weather);
          
          // 抽出した天気をdbに格納
          $sql="UPDATE weather 
          SET date='".$today."', today_weather='".$weather."', tempsmax='".$tempsMax."', tempsmin='".$tempsMin."'
          WHERE citycode='".$citycode."'";
          ;
          $sth = $dbh->prepare($sql);
          $sth->execute();
        }

        // 抽出もしくはdbから取り出した天気をcookieに格納する→select.jsで読み取るため
        $weather_icon = mb_split("　", $weather);
        setcookie("dated",$dated);
        setcookie("weather",$weather);
        setcookie("tempsmax",$tempsMax);
        setcookie("tempsmin",$tempsMin);
        setcookie("weather_icon",$weather_icon[0]);
  } catch (PDOException $e) {
    echo  "<p>Failed : " . $e->getMessage()."</p>";
    exit();
  }
?>