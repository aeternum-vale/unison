import React, {
    Component
} from 'react';
import LyricsScreen from '../LyricsScreen';
import './style.less';


export default class App extends Component {
    constructor(props) {
        super(props);
        let artist = 'System of a Down';
        let title = 'Lonely Day';
        let time = 1500;

        this.state = {
            artist,
            title,
            time
        };
    }

    render() {
        return <LyricsScreen _lrcArray = {
            getLrcArray(`[ti:Lonely Day]
            [ar:System of a Down]
            [al:Hypnotize]
            [by:van]
            [offset:500]
            [00:00.00]System of a Down - Lonely Day
            [00:12.00]
            [00:14.00]Such a lonely day
            [00:17.20]And it’s mine
            [00:20.55]The most loneliest day of my life
            [00:25.74]
            [00:26.71]Such a lonely day
            [00:29.87]Should be banned
            [00:33.49]It’s a day that I can't stand
            [00:38.57]
            [00:39.54]The most loneliest day of my life
            [00:45.86]The most loneliest day of my life
            [00:50.96]
            [00:52.24]Such a lonely day
            [00:55.42]Shouldn’t exist
            [00:59.10]It's a day that I’ll never miss
            [01:04.38]
            [01:05.05]Such a lonely day
            [01:08.30]And it’s mine
            [01:11.52]The most loneliest day of my life
            [01:16.73]
            [01:17.55]And if you go,
            [01:20.73]I wanna go with you
            [01:23.94]And if you die,
            [01:27.05]I wanna die with you
            [01:30.19]Take your hand and walk away
            [01:37.99]
            [02:01.78]The most loneliest day of my life
            [02:07.85]The most loneliest day of my life
            [02:14.11]The most loneliest day of my life
            [02:24.93]
            [02:26.52]Such a lonely day
            [02:29.85]And it’s mine
            [02:32.92]It’s a day that I’m glad I survived
            [02:40.00]
            [02:41.69]
            [02:45.34]
            [02:47.70]END?`)
        }
        time = {
            this.props.time
        }
        />;
    }
}

function getLrcArray(lrc) {
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


function search(artist, title) {
    function request(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            let data = '';
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                if (this.status != 200) return reject();
                resolve(this.responseText);
            };
            xhr.send();
        });
    }

    function googleSearch(query) {
        return new Promise((resolve, reject) => {

            let searchUrl = `https://www.google.com/search?site=&q=${encodeURIComponent(query)}&oq=${encodeURIComponent(query)}`;
            request(searchUrl).then(responseText => {
                //sandbox.innerHTML = responseText;
                let firstH3Value = '<h3 class="r">';
                let linkBeginValue = 'href="';
                let linkEndValue = '"';

                let firstH3Pos = responseText.indexOf(firstH3Value);
                let linkBeginPos = responseText.indexOf(linkBeginValue, firstH3Pos + firstH3Value.length);
                let linkEndPos = responseText.indexOf(linkEndValue, linkBeginPos + linkBeginValue.length);
                let firstLink = responseText.substring(linkBeginPos + linkBeginValue.length, linkEndPos);

                if (firstLink && ~firstH3Pos && ~linkBeginPos && ~linkEndPos)
                    resolve(firstLink);
                else
                    reject();
            }).catch(() => {
                reject();
            });
        });
    }

    function lrcRequest(link) {
        let url = `${link}?__VIEWSTATE=%2FwEPDwUKMTQyNTY4OTA5MGRkqbCCFLSPOtiTDSGMOEFjZrRFCFkQDsNUdRtCl6jLYrc%3D&__EVENTVALIDATION=%2FwEdAAL%2BOgribgzGGhWRmKMXo7jQWtMXX3%2BdPLuV1%2BH0GVcECHiubBn7NW%2BHm3rfGoVmNludXm26YcHVSzb9FeIgVfh8&btnDnlLrc=Download`;
        return request(url);
    }

    let query = `site:lyricslrc.com ${artist} ${title}`;
    return googleSearch(query).then(link => {
        return lrcRequest(link);
    });
}
