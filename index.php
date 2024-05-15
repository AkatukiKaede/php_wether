<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css" />
    <title>天気予報アプリ</title>
</head>

<body>
    <!-- ヘッダー -->
    <div id="header">
        <h1><a href="index.php">天気予報</a></h1>
    </div>

    <div id="main">

        <!-- サイドバー -->
        <div id="sidebar">
            <h3>このサイトについて</h3>
            <p>このサイトはCookieを使用しています。
                天気の取得のみに使用しているので
                個人情報の収集には使用していません。ご理解の上利用していただけると幸いです。</p>

        </div>

        <!-- 天気関連 -->
        <div id="weather">


            <!-- セレクトボックス（中身はmain.js） -->
            <div id="selectarea">
                <p>地方:</p>
                <!-- 地方のセレクトボックス -->
                <select id="region">
                </select>
                <!-- 都道府県のセレクトボックス -->
                <p>都道府県:</p>
                <select id="prefs"></select>
            </div>

            <!-- 天気の表示 -->
            <div id="weatherprev"></div>

        </div>
    </div>


    <!-- フッター -->
    <div id="footer">
        <!-- セレクトボックスのJS -->
        <script src="main.js"></script>
        <!-- 天気の取得のJS -->
        <script src="select.js"></script>
        <script>
        // コピーライト表示
        const currentYear = new Date().getFullYear();
        const protectMessage = `&copy;${currentYear} `;
        const messageElement = document.getElementById('footer');
        messageElement.innerHTML = protectMessage;
        </script>
    </div>
</body>

</html>