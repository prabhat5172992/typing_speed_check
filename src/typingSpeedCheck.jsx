import React, { Component } from "react";
import Content from "./all_data/typing.json";

class TypingSpeedCheck extends Component {
  constructor() {
    super();
    this.state = {
      countW: 0,
      countC: 0,
      countWS: 0,
      t1: 0,
      textContent: "",
      typingOnOFF: false,
      rp: Content["data"]["text1"],
      leftRP: Content["data"]["text1"],
      tStSP: false,
      typingSpeed: 0,
      typed: "",
      errors: "",
    };
  }
  // timer
  timeCounter = () => {
    let t = 0;
    this.counter = setInterval(() => {
      if (t < 60) {
        t += 1;
        this.setState({
          t1: t,
        });
      }
      if (t === 60) {
        this.setState({ typingOnOFF: true });
      }
    }, 1000);
  };
  checkNewLine = (word) => {
    return word.split("\n").filter((item) => item).length;
  };
  // Fetch Random Paragraph
  getParagraph = () => {
    const { data, count, keys } = Content;
    const idx = Math.floor(Math.random() * count);
    const k = keys[idx];
    return data[k];
  };
  // Clear count
  clearCount = () => {
    this.setState({
      countW: 0,
      countC: 0,
      countWS: 0,
    });
  };
  // clear content
  clearContent = () => {
    const gp = this.getParagraph();
    clearInterval(this.counter);
    this.clearCount();
    this.setState({
      textContent: "",
      t1: 0,
      typingOnOFF: false,
      rp: gp,
      leftRP: gp,
      typed: "",
      errors: "",
      tStSP: false,
      typingSpeed: 0,
    });
  };
  checkForCorrection = (para) => {
    const { rp, typed, errors, leftRP } = this.state;
    const gp = rp.split("");
    const tp = para.toString().split("");
    let leftContent = rp;
    if (tp[tp.length - 1] === gp[tp.length - 1] && !errors.length) {
      if (tp.length >= 1 && typed.length <= tp.length) {
        this.setState({
          typed: typed + tp[tp.length - 1],
          leftRP: leftContent.slice(tp.length - 1 + 1),
          //   errors: errors + gp[i],
        });
      } else {
        this.setState({
          typed: typed.slice(0, tp.length),
          leftRP: typed.slice(-1) + leftRP,
        });
      }
    } else {
      if (tp.length >= 1 && errors.length + typed.length <= tp.length) {
        this.setState({
          errors: errors + gp[tp.length - 1],
          leftRP: leftContent.slice(tp.length - 1 + 1),
        });
      } else {
        this.setState({
          errors:
            tp.length - typed.length
              ? errors.slice(0, tp.length - typed.length)
              : "",
          leftRP: errors.slice(-1) + leftRP,
        });
      }
    }
  };
  getCharCount = (e) => {
    const { textContent, tStSP, countW, t1 } = this.state;
    let { countC } = this.state;
    if (!textContent && !tStSP) {
      this.setState({ tStSP: true });
      this.timeCounter();
    }
    const val = e.target.value;
    this.checkForCorrection(val);
    this.setState({
      textContent: val,
      typingSpeed: t1 ? Math.floor((countW / t1) * 60) : 1,
    });
    let ws = 0;
    if (val) {
      // Char count with space
      if (val.toString().length < countC) {
        countC -= 1;
      } else {
        countC += 1;
      }
      // Char count without space
      for (let s of val) {
        ws += s.trim().length;
      }
      this.setState({ countC, countWS: ws });
      // Word count
      const wordArr = val.toString().split(" ");
      if (wordArr.length) {
        let wc = 0;
        for (let w of wordArr) {
          if (w && w.includes("\n")) {
            wc += this.checkNewLine(w);
          } else if (w) {
            wc += 1;
          } else {
            wc += 0;
          }
        }
        this.setState({ countW: wc });
      }
    } else {
      this.clearCount();
    }
  };
  render() {
    const {
      countW,
      countC,
      countWS,
      t1,
      leftRP,
      typed,
      errors,
      textContent,
      typingOnOFF,
      typingSpeed,
    } = this.state;
    return (
      <div>
        <h1 className="typeStH1">{`Your Typing Speed: ${typingSpeed} wpm`}</h1>
        <div className="typingInfoWrapper">
          <div className="infoWrapper">
            <p className="content-para">{`Word count is: ${countW}`}</p>
            <p className="content-para">{`Character count with spaces: ${countC}`}</p>
            <p className="content-para">{`Character count without spaces: ${countWS}`}</p>
            <p className="content-para">{`Timer: ${t1}`}</p>
          </div>
          <div className="paraWrapper">
            <span className="typed">{typed}</span>
            <span className="typed error">{errors}</span>
            {leftRP}
          </div>
        </div>
        <textarea
          className="typingSPCH blinking-cursor"
          value={textContent}
          onChange={(e) => this.getCharCount(e)}
          disabled={typingOnOFF}
        />
        <button
          className="clearContent-btn"
          onClick={() => this.clearContent()}
        >
          Clear
        </button>
      </div>
    );
  }
}
export default TypingSpeedCheck;
