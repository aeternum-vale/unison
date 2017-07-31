import AppConstants from './constants';

let topAudioLayerPlace = document.querySelector('#top_audio_layer_place');

if (haveNecessaryElements())
    setWatchers();
else {
    let observer = new MutationObserver(function(mutations) {
        if (haveNecessaryElements()) {
            setWatchers();
            observer.disconnect();
        }
    });
    let config = {
        subtree: true,
        childList: true,
        characterData: true
    }

    observer.observe(topAudioLayerPlace, config);
}

function haveNecessaryElements() {
    return !!(document.querySelector('button.audio_page_player_ctrl') &&
        document.querySelector('span.audio_page_player_title_performer') &&
        document.querySelector('span.audio_page_player_title_song') &&
        document.querySelector('div.audio_page_player_duration'));
}

function setWatchers() {
    let playButtonElement = document.querySelector('button.audio_page_player_ctrl');
    let artistElement = document.querySelector('span.audio_page_player_title_performer');
    let titleElement = document.querySelector('span.audio_page_player_title_song');
    let durationElement = document.querySelector('div.audio_page_player_duration');

    let getPlayingState = () => playButtonElement.classList.contains('audio_playing');
    let getArtist = () => artistElement.textContent;
    let getTitle = () => titleElement.textContent.substring(3);
    let getTime = () => {
        let re = /(\d{1,2})*:*(\d{1,2}):(\d{1,2})$/;
        let result = re.exec(durationElement.textContent);
        return (+result[3] + 60 * (+result[2] || 0) + 60 * 60 * (+result[1] || 0)) * 1000;
    };

    let playingState = getPlayingState();
    let artist = getArtist();
    let title = getTitle();
    let time = getTime();

    function sendVKState() {
        chrome.runtime.sendMessage({
            playingState,
            artist,
            title,
            time
        });
    }
    sendVKState();


    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            switch (mutation.target) {
                case playButtonElement:
                    let newPlayingState = getPlayingState();
                    if (playingState !== newPlayingState) {
                        sendVKState();
                        playingState = newPlayingState;
                    }
                    break;

                case artistElement:
                    let newArtist = getArtist();
                    let newTitle = getTitle();

                    if (artist !== newArtist || title !== newTitle) {
                        sendVKState();
                        title = newTitle;
                        artist = newArtist;
                        time = 0;
                        playingState = true;
                    }
                    break;

                case durationElement:
                    let newTime = getTime();

                    if (newTime !== time) {
                        sendVKState();
                        time = newTime;
                    }
                    // if (Math.abs(time - newDuration) > 1000)
                    //     console.log('jump ' + time + ' ' + newDuration);


                    break;
            }
        });
    });

    let config = {
        attributes: true,
        childList: true,
        characterData: true
    }

    observer.observe(playButtonElement, config);
    observer.observe(artistElement, config);
    observer.observe(durationElement, config);
}
