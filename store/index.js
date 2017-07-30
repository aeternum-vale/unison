import {
    EventEmitter
} from 'events';

import AppDispatcher from '../dispatcher';
import AppConstants from '../constants';

const Store = Object.assign({}, EventEmitter.prototype, {
    lrc: null,
    artist: null,
    title: null,
    isPlaying: null,
    time: null,

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

AppDispatcher.register(function(payload) {
    switch (payload.type) {
        case AppConstants.LYRYCS_LOAD_SUCCESS:
            Store.lrc = payload.lrc;
            Store.artist = payload.artist;
            Store.title = payload.title;
            Store.isPlaying = true;
            Store.time = 0;
            Store.emitChange();
            break;

        case AppConstants.START_PLAYING:
            Store.isPlaying = true;
            Store.emitChange();
            break;

        case AppConstants.PAUSE_PLAYING:
            Store.isPlaying = false;
            Store.emitChange();
            break;


        case AppConstants.JUMP_TO_POSITION:
            Store.time = payload.time;
            Store.emitChange();
            break;
    }

    return true;
});

export default Store;
