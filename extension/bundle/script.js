/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

var testButton = document.getElementById('test');
var sandbox = document.getElementById('sandbox');

chrome.webRequest.onHeadersReceived.addListener(function (data) {
    data.responseHeaders.push({
        name: 'Access-Control-Allow-Origin',
        value: '*'
    });

    return {
        responseHeaders: data.responseHeaders
    };
}, {
    urls: ["<all_urls>"]
}, ["blocking", "responseHeaders"]);

// let xhr = new XMLHttpRequest();
// xhr.open('GET', 'http://www.lyricslrc.com/song476668/system_of_a_down_-_lonely_day?__VIEWSTATE=%2FwEPDwUKMTQyNTY4OTA5MGRkqbCCFLSPOtiTDSGMOEFjZrRFCFkQDsNUdRtCl6jLYrc%3D&__EVENTVALIDATION=%2FwEdAAL%2BOgribgzGGhWRmKMXo7jQWtMXX3%2BdPLuV1%2BH0GVcECHiubBn7NW%2BHm3rfGoVmNludXm26YcHVSzb9FeIgVfh8&btnDnlLrc=Download', true);
//
// xhr.onreadystatechange = function() {
//     if (this.readyState != 4) return;
//     console.log(this.responseText);
// }
// xhr.send();


function search(artist, title) {
    function request(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            var data = '';
            xhr.onreadystatechange = function () {
                if (this.readyState != 4) return;
                if (this.status != 200) return reject();
                resolve(this.responseText);
            };
            xhr.send();
        });
    }

    function googleSearch(query) {
        return new Promise(function (resolve, reject) {

            var searchUrl = 'https://www.google.com/search?site=&q=' + encodeURIComponent(query) + '&oq=' + encodeURIComponent(query);
            request(searchUrl).then(function (responseText) {
                //sandbox.innerHTML = responseText;
                var firstH3Value = '<h3 class="r">';
                var linkBeginValue = 'href="';
                var linkEndValue = '"';

                var firstH3Pos = responseText.indexOf(firstH3Value);
                var linkBeginPos = responseText.indexOf(linkBeginValue, firstH3Pos + firstH3Value.length);
                var linkEndPos = responseText.indexOf(linkEndValue, linkBeginPos + linkBeginValue.length);
                var firstLink = responseText.substring(linkBeginPos + linkBeginValue.length, linkEndPos);

                if (firstLink && ~firstH3Pos && ~linkBeginPos && ~linkEndPos) resolve(firstLink);else reject();
            }).catch(function () {
                reject();
            });
        });
    }

    function lrcRequest(link) {
        var url = link + '?__VIEWSTATE=%2FwEPDwUKMTQyNTY4OTA5MGRkqbCCFLSPOtiTDSGMOEFjZrRFCFkQDsNUdRtCl6jLYrc%3D&__EVENTVALIDATION=%2FwEdAAL%2BOgribgzGGhWRmKMXo7jQWtMXX3%2BdPLuV1%2BH0GVcECHiubBn7NW%2BHm3rfGoVmNludXm26YcHVSzb9FeIgVfh8&btnDnlLrc=Download';
        return request(url);
    }

    var query = 'site:lyricslrc.com ' + artist + ' ' + title;
    return googleSearch(query).then(function (link) {
        return lrcRequest(link);
    });
}

search('red hot chili peppers', 'cant\'t stop').then(function (lrc) {
    console.log(lrc);
}).catch(function (err) {
    console.log('Uknown error');
});;

/***/ })
/******/ ]);