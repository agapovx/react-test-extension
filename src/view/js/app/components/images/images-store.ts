export interface imageObject {
  link: string;
  size: number;
  id: number;
}

export interface ISizeFinder {
  getSizeOfImage: (url: string) => Promise<number>;
}

export class ImagesStore {
  sizeFinder;

  constructor(sf: ISizeFinder) {
    this.sizeFinder = sf;
  }

  _getImages = async () => {
    const arrayOfImages: string[] = this._getArrayOfImages();
    const imageObjects = await this._getImagesWithWeight(arrayOfImages);
    return imageObjects.filter(image => image.size > 0);
  };

  private _getArrayOfImages = () => {
    const images = window.document.querySelectorAll("img");
    let setOfImages: string[] = [];
    images.forEach(image => {
      setOfImages.push(image.getAttribute("src")!);
    });
    return setOfImages.filter(
      (image, index) => setOfImages.indexOf(image) === index
    );
  };

  private _getImagesWithWeight = async (images: string[]) => {
    let sizes: imageObject[] = [];
    for (let i = 0; i < images.length; i++) {
      const size: number = await this.sizeFinder.getSizeOfImage(images[i]);
      sizes.push({
        link: images[i],
        size,
        id: i
      });
    }
    return sizes;
  };
}
