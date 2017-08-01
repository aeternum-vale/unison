import React, {
    Component
} from 'react';
import LyricsScreen from '../LyricsScreen';
import ControlBar from '../ControlBar';
import './style.less';

let Actions = chrome.extension.getBackgroundPage().Actions;
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
        lrcArray: Store.lrcArray,
        artist: Store.artist,
        title: Store.title,
        time: Store.time,
        playingState: Store.playingState,
        viewState: Store.viewState
    };
}


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = getStateFromFlux();
        this.interval = -1;

        this._onChange = this._onChange.bind(this);
        this._play = this._play.bind(this);
        this._pause = this._pause.bind(this);
    }

    _play() {
        this._pause();
        if (this.interval === -1) {
            let total = 0;
            let prev = performance.now();
            this.interval = setInterval(() => {
                let now = performance.now();
                let timePassed = now - prev;
                total += timePassed;
                prev = now;

                if (total < 1000)
                    Actions.setTime(this.state.time + timePassed);
            }, 91);
        }
    }

    _pause() {

        clearInterval(this.interval);
        this.interval = -1;
    }

    componentDidMount() {
        if (this.state.playingState)
            this._play();
        else
            this._pause();

        Store.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        this._pause();
        Store.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState(getStateFromFlux(), () => {

            if (this.state.playingState)
                this._play();
            else
                this._pause();

        });
    }


    render() {
        return (
            <div className='app'>
                <LyricsScreen
                    viewState = {
                        this.state.viewState
                    }
                    title = {
                        this.state.title
                    }
                    artist = {
                        this.state.artist
                    }
                    lrcArray = {
                        this.state.lrcArray
                    }
                    time = {
                        this.state.time
                    }
                />
                <ControlBar />
            </div>
        );
    }
}
