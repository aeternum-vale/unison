import React, { Component } from 'react';
import './style.less';

export default class LyricsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lrcArray: this.props._lrcArray,
            time: 0
        };

        this.SCREEN_HEIGHT = 280;
        this.LINE_HEIGHT = 20;

        // let interval = 41;
        // setInterval(() => {
        //     this.setState({time: this.state.time + interval});
        // }, interval);

    }


    _calculateCurrentLineData() {
        let la = this.state.lrcArray;
        let time = this.state.time;

        let currentLineIndex = la.length - 1;
        let currentLineProgress = 0;

        for (let i = 0; i < la.length; i++) {
            if (la[i].time <= time &&
                i < la.length - 1 &&
                la[i + 1].time > time) {
                currentLineIndex = i;
                currentLineProgress = (time - la[i].time) / (la[i + 1].time - la[i].time);
                break;
            }
        }
        return {
            offset: this.SCREEN_HEIGHT / 2 - currentLineIndex * this.LINE_HEIGHT -  currentLineProgress * this.LINE_HEIGHT,
            currentLineIndex,
            currentLineProgress
        };
    }

    render() {
        let {offset, currentLineIndex, currentLineProgress} = this._calculateCurrentLineData();
        return (
            <div className="lyrics-screen" >
                <div className="lyrics-screen__lyrics" style={{transform: `translateY(${offset}px)`}}>
                    {
                        this.state.lrcArray.map((item, index) => {
                            //console.log(this.state.time + " " + item.time + " " + ((Math.abs(this.state.time - item.time) / 1000)% 1));
                            let opacity = 0;

                            if (index === currentLineIndex - 1)
                                opacity = 1 - currentLineProgress;
                            if (index === currentLineIndex)
                                opacity = 1;
                            if (index === currentLineIndex + 1)
                                opacity = currentLineProgress;

                            // let diff = Math.abs(this.state.time -  item.time);
                            //
                            // if (index === currentLineIndex)
                            //     opacity = 1; else
                            // if (diff < 5000)
                            //     opacity = 1 - diff / 5000;


                            return <div key={index} style={{opacity}} className="lyrics-screen__line">{item.line || "\u00a0"}</div>
                        })
                    }
                </div>
            </div>
        )
    }
}
