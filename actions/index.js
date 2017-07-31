let AppDispatcher = chrome.extension.getBackgroundPage().AppDispatcher;

let dispatch = payload => AppDispatcher.dispatch(payload);


import AppConstants from '../constants';
import api from '../api';

export default {
    setNewLyrics(artist, title) {
        console.log('setNewLyrics: ' + artist + ' ' + title)
        api.search(artist, title).then(lrc => {
            dispatch({
                type: AppConstants.LYRYCS_LOAD_SUCCESS,
                lrc,
                artist,
                title
            });

        }).catch(() => {
            dispatch({
                type: AppConstants.LYRYCS_LOAD_FAIL
            });

        });
    },

    startPlaying() {
        dispatch({
            type: AppConstants.START_PLAYING
        });
    },

    pausePlaying() {
        dispatch({
            type: AppConstants.PAUSE_PLAYING
        });
    },

    setTime(time) {
        dispatch({
            type: AppConstants.SET_TIME,
            time
        });
    }

};
