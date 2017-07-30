// выбираем элемент
let playButtonElement = document.querySelector('button.audio_page_player_ctrl');
let artistElement = document.querySelector('span.audio_page_player_title_performer');
let titleElement = document.querySelector('span.audio_page_player_title_song');
let durationElement = document.querySelector('div.audio_page_player_duration');

let getPlayingState = () => playButtonElement.classList.contains('audio_playing');
let getArtist = () => artistElement.textContent;
let getTitle = () => titleElement.textContent.substring(3);
let getDuration = () => {
    let re = /(\d{1,2})*:*(\d{1,2}):(\d{1,2})$/;
    let result = re.exec(durationElement.textContent);
    return +result[3] + 60 * (+result[2] || 0) + 60 * 60 * (+result[1] || 0);
};

let playing = getPlayingState();
let artist = getArtist();
let title = getTitle();
let duration = getDuration();

// создаем экземпляр наблюдателя
let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        switch (mutation.target) {
            case playButtonElement:
                let newPlayingState = getPlayingState();
                if (playing !== newPlayingState) {
                    console.log('playing change');
                    playing = newPlayingState;
                }
                break;

            case artistElement:
                let newArtist = getArtist();
                let newTitle = getTitle();

                if (artist !== newArtist || title !== newTitle) {
                    console.log('track change');
                    title = newTitle;
                    artist = newArtist;
                    duration = 0;
                    playing = true;
                }
                break;

            case durationElement:
                let newDuration = getDuration();
                if (Math.abs(duration - newDuration) > 1)
                    console.log('jump ' + duration + ' ' + newDuration);

                duration = newDuration;
                break;
        }
    });
});

// настраиваем наблюдатель
var config = {
    attributes: true,
    childList: true,
    characterData: true
}

// передаем элемент и настройки в наблюдатель
observer.observe(playButtonElement, config);
observer.observe(artistElement, config);
observer.observe(durationElement, config);


chrome.runtime.sendMessage({greeting: "hello to unison pages from injected"}); //cb removed
