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
      backTyped: [], // Paragraph which is typed
      correcCharCount: 0, // Correct Char typed
      errCharCount: 0, // Error char typed
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
      tStSP: false,
      typingSpeed: 0,
      backTyped: [],
      correctCharCount: 0,
      errCharCount: 0,
    });
  };

  // Calculate word count per minitue
  calculateWordCountPM(tp, rp, corr) {
    const { t1 } = this.state;
    const avgWordLength = Math.floor(rp.length / rp.split(" ").length);
    const typedWordLength = tp
      ? Math.floor(tp.length / tp.split(" ").length)
      : 0;
    console.log("hdsjhjs", avgWordLength,  typedWordLength);
    let wordCount = 0;

    if (typedWordLength > avgWordLength) {
      wordCount = Math.floor(corr / avgWordLength);
    } else {
      wordCount = typedWordLength ? Math.floor(corr / typedWordLength) : 0;
    }
    this.setState({
      typingSpeed: t1 ? Math.floor((wordCount / t1) * 60) : 1,
    });
  }

  // This method checks for paragraph typing correction and errors
  backCorrection(tp) {
    const { rp } = this.state;
    const typed = [];
    let k = 0;
    let er = 0;

    for (let i = 0; i < tp.length; i++) {
      if (tp[i] === rp[i]) {
        k += 1;
        typed.push(
          <span key={`correctSpan${i + 1}`} className="typed">
            {tp[i]}
          </span>
        );
      } else {
        er += 1;
        typed.push(
          <span key={`errorSpan${i + 1}`} className="typed error">
            {rp[i]}
          </span>
        );
      }
    }

    this.setState(
      {
        backTyped: typed,
        leftRP: rp.slice(typed.length),
        backCheck: true,
        correctCharCount: k,
        errCharCount: er,
      },
      () => {
        this.calculateWordCountPM(tp, rp, k);
      }
    );
  }

  getCharCount = (e) => {
    const { textContent, tStSP, rp } = this.state;
    let { countC } = this.state;
    if (!textContent && !tStSP) {
      this.setState({ tStSP: true });
      this.timeCounter();
    }
    const val = e.target.value;

    if (val.length <= rp.length) {
      this.setState(
        {
          textContent: val,
        },
        () => {
          this.backCorrection(val);
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
      textContent,
      typingOnOFF,
      typingSpeed,
      backTyped,
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
            {backTyped.map((item) => {
              return item;
            })}
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
