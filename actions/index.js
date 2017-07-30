import AppDispatcher from '../dispatcher';
import AppConstants from '../constants';
import api from '../api';

export default {
    setNewLyrics(artist, title) {
        api.search(artist, title).then(lrc => {

            AppDispatcher.dispatch({
                type: AppConstants.LYRYCS_LOAD_SUCCESS,
                lrc,
                artist,
                title
            });

        }).catch(() => {

            AppDispatcher.dispatch({
                type: AppConstants.LYRYCS_LOAD_FAIL
            });

        });
    },

    startPlaying() {
        AppDispatcher.dispatch({
            type: AppConstants.START_PLAYING
        });
    },

    pausePlaying() {
        AppDispatcher.dispatch({
            type: AppConstants.PAUSE_PLAYING
        });
    },

    jumpToPosition(time) {
        AppDispatcher.dispatch({
            type: AppConstants.JUMP_TO_POSITION,
            time
        });
    }

};
