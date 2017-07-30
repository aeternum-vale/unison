export default {

    search(artist, title) {
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

                let searchUrl = `https://www.google.com/search?site=&q=${encodeURIComponent(query)}&oq=${encodeURIComponent(query)}`;
                request(searchUrl).then(responseText => {
                    //sandbox.innerHTML = responseText;
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
