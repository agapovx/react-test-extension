import { ImagesStore } from "./images-store";
import { SizeFinder } from "./size-finder";

class ContentController {
  constructor() {
    this._initMessageListener();
    this._startExtension();
    this._initializeImagesStore();
  }

  async _initializeImagesStore() {
    this._sf = new SizeFinder();
    this._is = new ImagesStore(this._sf);

    this.images = await this._is._getImages();
  }

  _startExtension() {
    chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.action == "open_extension") {
        let extensionOrigin = "chrome-extension://" + chrome.runtime.id;
        if (!location.ancestorOrigins.contains(extensionOrigin)) {
          if (document.querySelector("#downLoadImagesExtension")) {
            return;
          } else {
            this._initializeIframeWithData();
          }
        }
      }
    });
  }

  _initializeIframeWithData() {
    this.iframe = document.createElement("iframe");
    this.iframe.src = chrome.runtime.getURL("../view/view.html");
    this.iframe.id = "downLoadImagesExtension";
    this.iframe.style.backgroundColor = "#fff";
    this.iframe.style.borderRadius = "5px";
    this.iframe.style.border = "1px solid #19d793";
    this.iframe.style.position = "fixed";
    this.iframe.style.top = "5vh";
    this.iframe.style.left = "0";
    this.iframe.style.right = "0";
    this.iframe.style.margin = "0 auto";
    this.iframe.style.minHeight = "550px";
    this.iframe.style.maxHeight = "90vh";
    this.iframe.style.display = "flex";
    this.iframe.style.justifyContent = "center";
    this.iframe.style.alignItems = "center";
    this.iframe.style.width = "100%";
    this.iframe.style.maxWidth = "560px";
    this.iframe.style.zIndex = "99999999";
    document.body.appendChild(this.iframe);

    this._sendImagesDataToIframe();
  }

  _sendImagesDataToIframe() {
    setTimeout(() => {
      chrome.runtime.sendMessage(
        { action: "get_images", data: this.images },
        function() {}
      );
    }, 2000);
  }

  _initMessageListener() {
    window.addEventListener("message", event => {
      switch (event.data.message) {
        case "closeExtension":
          return this._closeExtension();
        default:
          return;
      }
    });
  }

  _closeExtension() {
    const iframe = document.querySelector("#downLoadImagesExtension");
    document.body.removeChild(iframe);
  }
}

(() => {
  new ContentController();
})();
