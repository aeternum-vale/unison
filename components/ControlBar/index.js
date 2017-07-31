import  React, { Component } from 'react';
import './style.less';
let Actions = chrome.extension.getBackgroundPage().Actions;


export default class ControlBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className='control-bar'>
            </div>
        );
    }
}
