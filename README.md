# ことのはたんご
単語推理ゲーム「ことのはたんご」
リンク (https://plumchloride.github.io/tango/)

本アプリケーションは営利目的での展開はしていません。
著者によるリンク先での広告の掲示は行っていません。


Josh Wardle([twitter](https://twitter.com/powerlanguish))さんが作製したフリーウェブアプリである「[Wordle](https://www.powerlanguage.co.uk/wordle/)」より多大な影響を受け作成しました。
いわゆるWordleの日本語版です。

# ゲーム説明

　「HIT & BLOW (マスターマインド)」や「ヌメロン」といったゲームを初めとした推理ゲームの単語版です。

　本アプリが定めた5文字の単語をプレイヤーが5文字の単語を入力して当てるゲームです。

　5文字をそれぞれ分割し、「入力した文字が使用されており位置が同じ」「使用されているが位置は違う」の2点の評価を行い、行った評価をもとに各文字に対してハイライト表示を行います。

　そのハイライト表示をヒントに同試行を複数回（未定）繰り返しアプリが定めた5文字の単語を当てましょう。

# ライセンス

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />この 作品 は <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">クリエイティブ・コモンズ 表示 - 非営利 - 継承 4.0 国際 ライセンス</a>の下に提供されています。  
この作品はくわえて、BSDライセンスの下に提供されています。

また本アプリケーションは次の著作者によるソフトウェアを使用しています：The UniDic Consortium「UniDic-cwj_3.1.0」 [https://ccd.ninjal.ac.jp/unidic/]  
「UniDic-cwj_3.1.0」はBSDライセンスおよびクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。

また本アプリケーションは次の著作者によるソフトウェアを使用しています：国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)
国立国語研究所(2004)『分類語彙表増補改訂版データベース』(ver.1.0)はクリエイティブ・コモンズ 表示-非営利-継承4.0 非移植(CC BY-NC-SA 4.0)のもと提供されています。


# ファイル
GitHub/  
　├ filtering/  
　│　└ tango_filter.ipynb 単語辞書を作る際に利用したフィルター用コード  
　├ docs/  
　│　├ public/  
　│　│　├ data/  
　│　│　│　├ del.csv 分類語彙表より手動で辞書から削除したデータ  
　│　│　│　├ rename.csv 分類語彙表より手動で読み方を変換したデータ  
　│　│　│　├ A_data.csv 単語が実在するかのチェック用データ  
　│　│　│　└ Q_data.csv 問題に利用する単語のデータ  
　│　│　├ img/ 省略  
　│　│　└ style.css  
　│　├ src/  
　│　│　├ chek_answer.js 回答が正解と合っているか検証  
　│　│　├ create_answer_input.js UIキーボードの入力をテキストに変換  
　│　│　├ create_answer_keybord.js UIキーボードの入力を検知するイベントの生成  
　│　│　├ create_display.js 10*5の単語表示スペースの作成  
　│　│　├ create_key_bord.js UIキーボードの作成  
　│　│　├ display_setting.js 単語表示スペースの操作  
　│　│　├ end.js ゲーム終了時の処理  
　│　│　├ get_csv.js 辞書データを取得する  
　│　│　├ get_today_word.js 正解となる単語の取得  
　│　│　├ ui.js nav等の操作  
　│　│　├ wake_up.js アプリ起動時に様々なセットアップをする  
　│　│　└ webstorage.js webストレージとの通信  
　│　└ index.html  
　├ .gitignore  
　├ COPYING 著作権表示等  
　├ LICENSE BSDライセンス  
　└ README.md  
