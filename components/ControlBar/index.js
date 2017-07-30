import  React, { Component } from 'react';
import './style.less';
import Actions from '../../actions';


export default class ControlBar extends Component {

    constructor(props) {
        super(props);
        this._onSearchButtonClick = this._onSearchButtonClick.bind(this);
    }

    _onSearchButtonClick() {
        Actions.setNewLyrics(this.artistInput.value, this.titleInput.value);
    }

    _onPlayButtonClick() {
        Actions.startPlaying();
    }

    _onPauseButtonClick() {
        Actions.pausePlaying();
    }

    render() {

        return (
            <div className='control-bar'>
                <form>
                    artist: <input type='text' name='artist' defaultValue='the beatles' ref={input => { this.artistInput = input; }}/>
                    title: <input type='text' name='title' defaultValue='all you need is love' ref={input => { this.titleInput = input; }} />
                    <input type='button' value='search' onClick={ this._onSearchButtonClick }/>
                    <br />
                    <input type='button' value='play' onClick={ this._onPlayButtonClick }/>
                    <input type='button' value='pause' onClick={ this._onPauseButtonClick }/>

                </form>
            </div>
        );
    }
}
