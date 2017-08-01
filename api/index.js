export default {

    trackHash: (artist, title) => `lrc: ${artist.toLowerCase()} - ${title.toLowerCase()}`,

    search(artist, title) {
        const GOOGLE_LAST_SEARCHING_DATE_ID = 'google_search_date';
        const GOOGLE_SEARCH_MIN_INTERVAL = 5000;


        let lrc = null;
        if (lrc = localStorage.getItem(this.trackHash(artist, title)))
            return Promise.resolve(lrc);

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
                function googleRequest() {
                    let searchUrl = `https://www.google.com/search?site=&q=${encodeURIComponent(query)}&oq=${encodeURIComponent(query)}`;
                    request(searchUrl).then(responseText => {
                        localStorage.setItem(GOOGLE_LAST_SEARCHING_DATE_ID, Date.now());

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
                }

                let lastSearchingDate = null;
                if ((lastSearchingDate = parseInt(localStorage.getItem(GOOGLE_LAST_SEARCHING_DATE_ID))) && Date.now() - lastSearchingDate < GOOGLE_SEARCH_MIN_INTERVAL) {
                    console.log('Google search delayed. Continue in ' + (GOOGLE_SEARCH_MIN_INTERVAL - (Date.now() - lastSearchingDate)));
                    setTimeout(googleRequest, GOOGLE_SEARCH_MIN_INTERVAL - (Date.now() - lastSearchingDate));
                } else
                    googleRequest();
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

};
