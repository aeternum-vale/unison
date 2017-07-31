import React, { Component } from 'react';
import './style.less';
import AppConstants from '../../constants';

export default class LyricsScreen extends Component {

    constructor(props) {
        super(props);

        this.SCREEN_HEIGHT = 280;
        this.LINE_HEIGHT = 20;
    }

    _calculateCurrentLineData() {
        let la = this.props.lrcArray;
        let time = this.props.time;

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
            switch (this.props.viewState) {
                case AppConstants.VIEW_STATE_LYRICS:
                    let {offset, currentLineIndex, currentLineProgress} = this._calculateCurrentLineData();
                    return (
                        <div className='lyrics-screen'>
                        {'time: ' + this.props.time.toFixed(2) }
                        <br/>
                        {'offset: ' + offset.toFixed(2)}

                            <div className='lyrics-screen__lyrics' style={{transform: `translateY(${offset}px)`}}>

                                {
                                    this.props.lrcArray.map((item, index) => {
                                        //console.log(this.props.time + " " + item.time + " " + ((Math.abs(this.props.time - item.time) / 1000)% 1));
                                        let opacity = 0;

                                        if (index === currentLineIndex - 1)
                                            opacity = 1 - currentLineProgress;
                                        if (index === currentLineIndex)
                                            opacity = 1;
                                        if (index === currentLineIndex + 1)
                                            opacity = currentLineProgress;

                                        // let diff = Math.abs(this.props.time -  item.time);
                                        //
                                        // if (index === currentLineIndex)
                                        //     opacity = 1; else
                                        // if (diff < 5000)
                                        //     opacity = 1 - diff / 5000;

                                        return <div key={index} style={{opacity}} className='lyrics-screen__line'>{item.line || "\u00a0"}</div>
                                    })
                                }
                            </div>
                        </div>
                    )
                    break;

                case AppConstants.VIEW_STATE_LOADING:
                    return  <div className='lyrics-screen'>Searching for {'"' + this.props.title + '"'} lyrics</div>

                    break;

                case AppConstants.VIEW_STATE_ERROR:
                    return  <div className='lyrics-screen' >Cannot find {'"' + this.props.title + '"'} lyrics :(</div>
                    break;

                case AppConstants.VIEW_STATE_REPOSE:
                    return <div className='lyrics-screen' ></div>
                    break;

            }

    }
}
