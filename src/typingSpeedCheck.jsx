import React, { Component } from "react";
import Content from "./all_data/typing.json";

class TypingSpeedCheck extends Component {
  constructor() {
    super();
    this.state = {
      countW: 0, // count word
      countC: 0, // count characters
      countWS: 0, // char count without spaces
      t1: 0, // timer
      textContent: "",
      typingOnOFF: false, // To disable textarea when timer shows 60 s
      rp: Content["data"]["text1"], // random paragraph
      leftRP: Content["data"]["text1"], // random paragraph left to type
      tStSP: false, // typing status to start timer once started it will be true
      typingSpeed: 0,
      typed: "", // The paragraph which is already typed correctly
      errors: "", // Paragraph typed with error
    };
  }
  // timer
  timeCounter = () => {
    let t = 0;
    this.counter = setInterval(() => {
      if (t < 120) {
        t += 1;
        this.setState({
          t1: t,
        });
      }
      if (t === 120) {
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
    const { textContent, tStSP, typed, t1, rp } = this.state;
    let { countC } = this.state;
    if (!textContent && !tStSP) {
      this.setState({ tStSP: true });
      this.timeCounter();
    }
    const val = e.target.value;
    const typedCount = typed ? typed.split(" ").length : 0;

    if (val.length <= rp.length) {
      this.setState(
        {
          textContent: val,
          typingSpeed: t1 ? Math.floor((typedCount / t1) * 60) : 1,
        },
        () => {
          this.checkForCorrection(this.state.textContent);
        }
      );

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
    }
  };

  disablePaste(e) {
    e.preventDefault();
  }

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
      <div className="typs-wrapper">
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
        <h3>
          !! Please type each characters correctly, also correct the red one and
          make it green. Typing speed includes only green ones. !!
        </h3>
        <textarea
          className="typingSPCH blinking-cursor"
          value={textContent}
          onChange={(e) => this.getCharCount(e)}
          onPaste={(e) => this.disablePaste(e)}
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
