chrome.webRequest.onHeadersReceived.addListener((data) => {
    data.responseHeaders.push({
        name: 'Access-Control-Allow-Origin',
        value: '*'
    });

    return {
        responseHeaders: data.responseHeaders
    };
}, {
    urls: ["*://google.com/*", "*://lyricslrc.com/*"]
}, [
    "blocking", "responseHeaders"
]);

// chrome.browserAction.onClicked.addListener(function(tab) {
//     console.log(tab)
//     console.log(chrome.extension.getViews());
// });
//chrome.browserAction.setPopup({popup: '../background.html'});

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         console.log(request);
//     });

//console.log(chrome.extension.getViews());


//-----------------------------------------------------

import AppConstants from './constants';
import {
    Dispatcher
} from 'flux';
let AppDispatcher = new Dispatcher();

//------------------------------------------------------

let dispatch = payload => AppDispatcher.dispatch(payload);
import api from './api';
let Actions = {
    setNewLyrics(artist, title) {
        dispatch({
            type: AppConstants.LYRYCS_LOAD_START,
            artist,
            title
        });

        api.search(artist, title).then(lrc => {
            dispatch({
                type: AppConstants.LYRYCS_LOAD_SUCCESS,
                lrc,
                artist,
                title
            });

        }).catch(() => {
            dispatch({
                type: AppConstants.LYRYCS_LOAD_FAIL,
                artist,
                title
            });

        });
    },

    setTime(time) {
        dispatch({
            type: AppConstants.TIME_CHANGE,
            time
        });
    },

    setPlayingState(playingState) {
        dispatch({
            type: AppConstants.PLAYING_STATE_CHANGE,
            playingState
        });
    }

};

//-------------------------------------------------

import {
    EventEmitter
} from 'events';

let Store = Object.assign({}, EventEmitter.prototype, {
    lrc: null,
    artist: null,
    title: null,
    playingState: false,
    time: 0,
    viewState: AppConstants.VIEW_STATE_REPOSE,

    emitChange() {
        this.emit(AppConstants.CHANGE_EVENT);
    },

    addChangeListener(callback) {
        this.on(AppConstants.CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(AppConstants.CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(dispatcherCallback);

function dispatcherCallback(payload) {
    console.log('dispatcherCallback');

    switch (payload.type) {
        case AppConstants.LYRYCS_LOAD_START:
            Store.artist = payload.artist;
            Store.title = payload.title;
            Store.viewState = AppConstants.VIEW_STATE_LOADING;
            break;

        case AppConstants.LYRYCS_LOAD_SUCCESS:
            Store.lrc = payload.lrc;
            Store.artist = payload.artist;
            Store.title = payload.title;
            Store.playingState = true;
            Store.time = 0;
            Store.viewState = AppConstants.VIEW_STATE_LYRICS;
            break;

        case AppConstants.LYRYCS_LOAD_FAIL:
            Store.lrc = null;
            Store.artist = payload.artist;
            Store.title = payload.title;
            Store.playingState = false;
            Store.time = 0;
            Store.viewState = AppConstants.VIEW_STATE_ERROR;
            break;

        case AppConstants.PLAYING_STATE_CHANGE:
            Store.playingState = payload.playingState;
            break;

        case AppConstants.TIME_CHANGE:
            Store.time = payload.time;
            break;

    }

    Store.emitChange();
    return true;
}


//-----------------

chrome.runtime.onMessage.addListener(VKState => {
    console.log('background onmessage: ');
    console.log(VKState);

    if (Store.time !== VKState.time)
        Actions.setTime(VKState.time);

    if (Store.artist !== VKState.artist || Store.title !== VKState.title)
        Actions.setNewLyrics(VKState.artist, VKState.title);
    
    if (Store.playingState !== VKState.playingState)
        Actions.setPlayingState(VKState.playingState);

});

window.AppDispatcher = AppDispatcher;
window.Store = Store;
window.Actions = Actions;
