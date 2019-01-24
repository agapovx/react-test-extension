export class SizeFinder {
  async getSizeOfImage(url) {
    let sizeInBytes = await this._getSizeInBytes(url);
    let sizeInMegaBytes = this._getSizeInMegaBytes(sizeInBytes);
    return sizeInMegaBytes;
  }

  _getSizeInMegaBytes(number) {
    return Math.round(((number / 1024) * 100) / 1024) / 100;
  }

  _getSizeInBytes(item) {
    return new Promise(function(resolve) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", item, true);
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (item.indexOf("data:image/gif;base64,") === -1) {
              resolve(xhr.getResponseHeader("Content-Length"));
            } else {
              let base64str = item
                .substr(item.indexOf("data:image/gif;base64,"))
                .substr(22);
              resolve(atob(base64str).length);
            }
          } else {
            resolve(0);
          }
        }
      };
    });
  }
}
