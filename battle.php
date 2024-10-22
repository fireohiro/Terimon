<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>バトル画面</title>
    <style>
        #game-container {
            width: 80vw;      /* 横の比率 */
            height: 30vh;     /* 縦の比率 */
            margin: 0 auto;    /* 中央寄せ */
            border: 2px solid #000; /* 枠線 */
            display: flex;   /* フレックスボックスで整列 */
            justify-content: center; /* 中央寄せ */
            align-items: center; /* 垂直中央寄せ */
            font-size: 24px; /* フォントサイズ */
        }

        #status-container{
            position:absolute;
            top:10px;
            width:9vw;
            height:25vh;
            border:2px solid black;
            display:flex;
            justify-content:space-around;
            align-items:center;
            background-color;white;
        }
    </style>
</head>
<body>
    <div id="game-container">
        <div id="under-text" class="under-text"></div>
    </div>

    <div id="status-container">
        <div id="status-data" class="status-data"></div>
    </div>

    <script type="module" src="JavaScript/battle.js"></script> <!-- battle.jsを読み込む -->
</body>
</html>
