import  React, { Component } from 'react';
import LyricsScreen from '../LyricsScreen';
import ControlBar from '../ControlBar';
import './style.less';

import Actions from '../../actions';
let Store = chrome.extension.getBackgroundPage().Store;

// let testLrc = `[ti:Lonely Day]
// [ar:System of a Down]
// [al:Hypnotize]
// [by:van]
// [offset:500]
// [00:00.00]System of a Down - Lonely Day
// [00:12.00]
// [00:14.00]Such a lonely day
// [00:17.20]And it’s mine
// [00:20.55]The most loneliest day of my life
// [00:25.74]
// [00:26.71]Such a lonely day
// [00:29.87]Should be banned
// [00:33.49]It’s a day that I can't stand
// [00:38.57]
// [00:39.54]The most loneliest day of my life
// [00:45.86]The most loneliest day of my life
// [00:50.96]
// [00:52.24]Such a lonely day
// [00:55.42]Shouldn’t exist
// [00:59.10]It's a day that I’ll never miss
// [01:04.38]
// [01:05.05]Such a lonely day
// [01:08.30]And it’s mine
// [01:11.52]The most loneliest day of my life
// [01:16.73]
// [01:17.55]And if you go,
// [01:20.73]I wanna go with you
// [01:23.94]And if you die,
// [01:27.05]I wanna die with you
// [01:30.19]Take your hand and walk away
// [01:37.99]
// [02:01.78]The most loneliest day of my life
// [02:07.85]The most loneliest day of my life
// [02:14.11]The most loneliest day of my life
// [02:24.93]
// [02:26.52]Such a lonely day
// [02:29.85]And it’s mine
// [02:32.92]It’s a day that I’m glad I survived
// [02:40.00]
// [02:41.69]
// [02:45.34]
// [02:47.70]END?`;

function getStateFromFlux() {

    return {
        lrc: Store.lrc,
        artist: Store.artist,
        title: Store.title,
        time: 0,
        isPlaying: Store.isPlaying
    };
}


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = getStateFromFlux();

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        Store.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState(getStateFromFlux());
    }

    _getLrcArray(lrc) {

        if (!lrc)
            throw new Error('no lrc provided');

        let getlrcObj = (time, line) => {
            return {
                time,
                line
            }
        };
        let getTimestamp = (mm, ss, xx) => (mm * 60 * 1000 + ss * 1000 + xx);
        let getTimestampByExecResult = result => getTimestamp(+result[1] || 0, +result[2] || 0, +result[3] || 0);

        let lrcArray = [];
        let regTemplate = /\[(\d\d):(\d\d)\.*(\d\d)*](.*)$/;
        let regexp = new RegExp(regTemplate, 'igm');
        let regexp2 = new RegExp(regTemplate, 'i');

        let result;
        let innerResult;
        while (result = regexp.exec(lrc)) {
            let line = result[result.length - 1];
            let timestamps = [getTimestampByExecResult(result)];

            while (innerResult = regexp2.exec(line)) {
                timestamps.push(getTimestampByExecResult(innerResult));
                line = innerResult[innerResult.length - 1];
            }

            timestamps.forEach(timestamp => lrcArray.push(getlrcObj(timestamp, line)));
        }

        lrcArray.sort((a, b) => (a.time - b.time));
        return lrcArray;
    }

    render() {
        return (
            <div className='app'>
                <LyricsScreen lrcArray={ this.state.lrc ? this._getLrcArray(this.state.lrc) : null } isPlaying={ this.state.isPlaying } initialTime={ this.state.time } />
                <ControlBar />
            </div>
        );
    }
}
