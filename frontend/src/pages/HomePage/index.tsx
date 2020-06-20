import React from "react";
import { Paper } from "@material-ui/core"


export const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-length-explain">
        <h2>コード長で測る問題毎の実装重さ評価</h2>
        <p>Tableページの「ShowCodeSize」で表示されます。</p>
        <p>実装の重い問題　≒　ACコードのコード長も長い。という解釈で、各問題の実装重さを評価しています。</p>
        <p>問題毎にACコードのコード長中央値をもとめ、中央値の集合の中での順位からランクづけを行なっています（言語別）</p>
        <h4 className="red">上位 0.3%: 赤</h4>
        <h4 className="orange">上位 1%: 橙</h4>
        <h4 className="yellow">上位 3%: 黄</h4>
        <h4 className="blue">上位 7%: 青</h4>
        <h4 className="cyan">上位 15%: 水</h4>
        <h4 className="green">上位 30%: 緑</h4>
        <h4 className="brown">上位 50%: 茶</h4>
        <h4 className="gray">上位 100%: 灰</h4>
      </div>
      <div className="home-code-explain">
        <h2>ACコードのランク評価</h2>
        <p>各問題について、実行時間またはコード長でソート（ACのみ）した際の、ユーザーのACコードの順位に基づいてランク評価を行なっています。（言語別）</p>
        <p>コード長が短い・実行時間が短いコードが高ランクになります</p>
        <h4 className="red">上位 10%: A</h4>
        <h4 className="yellow">上位 25%: B</h4>
        <h4 className="blue">上位 50%: C</h4>
        <h4 className="green">上位 75%: D</h4>
        <h4 className="brown">上位 100%: E</h4>
      </div>
      <div className="home-ranking-explain">
        <h2>ランキング</h2>
        <p>ACコードのランク評価をもとにA: 5p, B: 4p, C:3p, D: 2p, E: 1pとして総合得点または平均点でランキングを作成しています。</p>
      </div>
      <div>
        <h2>当サイトについて</h2>
        <p>当サイトはAtCoder ProblemsさんのAPIをお借りしています。ソースコードも参考にさせていただきました。</p>
      </div>
    </div>
  )
}