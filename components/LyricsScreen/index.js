import React, { Component } from 'react';
import './style.less';
import AppConstants from '../../constants';

export default class LyricsScreen extends Component {

    constructor(props) {
        super(props);
        this.prevOffset = null;

        this.lines = [];
        this.heightsBefore = [];
        this.state = {isInit: false};

        this.SCREEN_HEIGHT = 280;
        this.LINE_HEIGHT = 20;

        this._calculateCurrentLineData = this._calculateCurrentLineData.bind(this);
        this._getLineHeight = this._getLineHeight.bind(this);
        this._getHeightBefore = this._getHeightBefore.bind(this);
    }

    _getLineHeight(index) {
        return (this.lines[index]) ? this.lines[index].offsetHeight : this.LINE_HEIGHT;
    }

    _getHeightBefore(index) {
        if (this.heightsBefore[index])
            return this.heightsBefore[index];

        if (index !== 0) {
            let prevLineHeight = this.lines[index - 1] && this._getLineHeight(index - 1);
            let result;
            if (prevLineHeight) {
                result = prevLineHeight + this._getHeightBefore(index - 1);
                this.heightsBefore[index] = result;
            } else
                result = this.LINE_HEIGHT + this._getHeightBefore(index - 1);
            return result;
        } else
            return 0;
    }



    _calculateCurrentLineData() {

        let la = this.props.lrcArray;
        let time = this.props.time;

        let currentLineIndex = 0;
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

        if (time > la[la.length - 1].time)
            currentLineIndex = la.length - 1;

        let offset = this.SCREEN_HEIGHT / 2 - this._getHeightBefore(currentLineIndex) -  currentLineProgress * this._getLineHeight(currentLineIndex);

        return {
            offset,
            currentLineIndex,
            currentLineProgress
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({isInit: false});
    }

    componentDidUpdate() {
        if (!this.state.isInit)
            this.setState({isInit: true});
    }

    componentDidMount() {
        if (!this.state.isInit)
            this.setState({isInit: true});
    }

    render() {
            switch (this.props.viewState) {
                case AppConstants.VIEW_STATE_LYRICS:

                    let {offset, currentLineIndex, currentLineProgress} = this._calculateCurrentLineData();


                    if (this.prevOffset !== null) {
                        if (offset > this.prevOffset)
                            offset = this.prevOffset;

                        if ((this.prevOffset - offset) > 0.5 && (this.prevOffset - offset) < 20)
                            offset = this.prevOffset - (this.prevOffset - offset) * 0.1;
                    }

                    this.prevOffset = offset;

                    // {'time: ' + this.props.time.toFixed(2) }
                    // <br/>
                    // {'offset: ' + offset.toFixed(2)}

                    return (
                        <div className='lyrics-screen'>
                            <div className='lyrics-screen__lyrics' style={{transform: `translateY(${offset}px)`}}>

                                {
                                    this.props.lrcArray.map((item, index) => {
                                        //console.log(this.props.time + " " + item.time + " " + ((Math.abs(this.props.time - item.time) / 1000)% 1));
                                        let opacity = 0;
                                        const BORDER = 2500;

                                        if (index === currentLineIndex - 1)
                                            opacity = (1 - currentLineProgress);
                                        if (index === currentLineIndex)
                                            opacity = 1;
                                        if (index === currentLineIndex + 1)
                                            opacity = currentLineProgress;

                                        return <div key={index} style={{opacity}} ref={ line=>{this.lines[index] = line; this.heightsBefore[index] = this._getHeightBefore(index)}} className='lyrics-screen__line'>{item.line || "\u00a0"}</div>
                                    })
                                }
                            </div>
                        </div>
                    )

                    break;

                case AppConstants.VIEW_STATE_LOADING:
                    return  (
                        <div className='lyrics-message'>
                            <div>Searching for {`"${this.props.artist} - ${this.props.title}"`} lyrics...</div>
                        </div>
                    )
                    break;

                case AppConstants.VIEW_STATE_ERROR:
                return  (
                    <div className='lyrics-message'>
                        <div>Cannot find {`"${this.props.artist} - ${this.props.title}"`} lyrics :(</div>
                    </div>
                )
                    break;

                case AppConstants.VIEW_STATE_REPOSE:
                    return <div className='lyrics-screen'></div>
                    break;

            }

    }
}
