const LINK_LENGTH_CHECK = 9;

export class ImagesStore {
  constructor(sf) {
    this.sizeFinder = sf;
  }

  async _getImages() {
    const arrayOfImages = this._getArrayOfImages();
    const imageObjects = await this._getImagesWithWeight(arrayOfImages);
    const arrayOfValidImageObjects = this._performValidImageLinks(imageObjects);
    return arrayOfValidImageObjects.filter(
      img => img.link.length > LINK_LENGTH_CHECK
    );
  }

  _performValidImageLinks(images) {
    return images.map((image, key) =>
      this._checkValidHttpUrl(image.link)
        ? image
        : { link: `https:${image.link}`, size: image.size, id: key }
    );
  }

  _checkValidHttpUrl(url) {
    if (url.length < 4) return false;
    return url.slice(0, 4) === "http";
  }

  _getArrayOfImages() {
    const images = window.document.querySelectorAll("img");
    let arrayOfImages = [];
    images.forEach(image => {
      arrayOfImages.push(image.getAttribute("src"));
    });
    return [...new Set(arrayOfImages)];
  }

  async _getImagesWithWeight(images) {
    let sizes = [];
    for (let i = 0; i < images.length; i++) {
      const size = await this.sizeFinder.getSizeOfImage(images[i]);
      sizes.push({
        link: images[i],
        size,
        id: i
      });
    }
    return sizes;
  }
}
