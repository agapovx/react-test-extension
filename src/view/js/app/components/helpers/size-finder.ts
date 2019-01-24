import { ISizeFinder } from "../images/images-store";

export class SizeFinder implements ISizeFinder {
  getSizeOfImage = async (url: string) => {
    let sizeInBytes = await this._getSizeInBytes(url);
    let sizeInMegaBytes = this._getSizeInMegaBytes(sizeInBytes);
    return sizeInMegaBytes;
  };

  private _getSizeInMegaBytes = (number): number => {
    return Math.round(((number / 1024) * 100) / 1024) / 100;
  };

  private _getSizeInBytes(item) {
    return new Promise<number>(resolve => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", item, true);
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (item.indexOf("data:image/gif;base64,") === -1) {
              const size: string | null = xhr.getResponseHeader(
                "Content-Length"
              );
              if (size) {
                resolve(Number(size));
              }
            } else {
              // let base64str = item
              //   .substr(item.indexOf("data:image/gif;base64,"))
              //   .substr(22);
              // resolve(atob(base64str).length);
            }
          } else {
            resolve(0);
          }
        }
      };
    });
  }
}
