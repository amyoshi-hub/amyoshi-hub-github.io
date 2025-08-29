# OSAI-browserに特化させるためのアプリAPI群と課題

本リポジトリは、独自設計のP2Pブラウザ「OSAI-browser」を前提として設計された、
物理エンジン、キャラクター制御、GLTFアニメーションの再生、
Three.jsとCanvasの統合に関するサンプルコード集です。

## 使用想定・構想

- IoT制御
- エンターテインメント作品
- 教育用コンテンツ
- 介護・インタラクティブな展示

など、OSAIの並列処理・非同期性を活かした応用を想定しています。

RustやNode.jsによる並列・分散処理の導入も構想に含まれますが、課題要件外のため今回の提出からは省いています。

## 動作確認

`index.html` をブラウザで開くことでデモを確認できます。

---

## 備考

本プロジェクトは自由な発想と技術的好奇心をベースに進められており、
今後もOSAIの強みを活かした拡張・実験を進める予定です。

https://github.com/amyoshi-hub/OSAI-browser
https://github.com/amyoshi-hub/OSAI-browser-apps
