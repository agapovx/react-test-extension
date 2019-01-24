import * as React from "react";
import { ImagesStore, imageObject } from "./images-store";
import { SizeFinder } from "../helpers/size-finder";
import { ImagesList } from "./images-list";
import Button from "../../fragments/button";
import Preloader from "../../fragments/preloader";
import { FieldInput } from "../../fragments/field-input";

const DEFAULT_ROWS_COUNT: number = 5;

export enum imageSorts {
  id = "name",
  idReverse = "name-reverse",
  weight = "weight",
  weightReverse = "weight-reverse"
}

interface ImagesState {
  images: imageObject[] | null;
  rowsCount: number;
  maxRowsCount: number;
  sortType: string;
}

const getSavedRowsCount = (): number | null => {
  const storageRowsCount: string | null = localStorage.getItem("rowsCount");
  if (storageRowsCount) {
    return Number(JSON.parse(storageRowsCount));
  }
  return null;
};

const saveRowsCountToStorage = (rowsCount: number) => {
  localStorage.setItem("rowsCount", JSON.stringify(rowsCount));
};

export class Images extends React.Component<{}, ImagesState> {
  private _is: ImagesStore;
  private _sf: SizeFinder;

  constructor(props) {
    super(props);
    this._sf = new SizeFinder();

    this._is = new ImagesStore(this._sf);

    const savedRowsCount = getSavedRowsCount();

    this.state = {
      images: null,
      rowsCount: savedRowsCount ? savedRowsCount : DEFAULT_ROWS_COUNT,
      maxRowsCount: 0,
      sortType: imageSorts.weightReverse
    };
  }

  componentDidMount() {
    // this._getImagesList();
    this._initImages();
    this._saveRowsCountToStorage();
  }

  render() {
    if (!this.state.images) return <Preloader />;
    return <div className="images">{this._renderContent()}</div>;
  }

  protected _renderContent = () => {
    return this.state.images!.length > 0
      ? this._renderImagesContent()
      : this._renderNotFound();
  };

  protected _renderImagesContent = () => {
    return (
      <>
        <header className="i_header">
          <Button onClick={this._downloadAllImages} extraClass="i_download-all">
            Download all images
          </Button>
          <FieldInput
            type="number"
            value={this.state.rowsCount > 0 ? this.state.rowsCount : ""}
            title="Rows Count"
            onChange={this._onRowsChange}
          />
        </header>
        <div className="i_content">
          <ImagesList
            sortByName={this._nameSort}
            sortByWeight={this._weightSort}
            images={this._getImagesToRender()}
          />
        </div>
      </>
    );
  };

  protected _renderNotFound = () => {
    return (
      <div className="i_not-found">
        <h1>Не найдено картинок на данном сайте.</h1>
      </div>
    );
  };

  private _saveRowsCountToStorage = () => {
    saveRowsCountToStorage(this.state.rowsCount);
  };

  private _nameSort = () => {
    this.setState({
      sortType:
        this.state.sortType === imageSorts.id
          ? imageSorts.idReverse
          : imageSorts.id
    });
  };

  private _weightSort = () => {
    this.setState({
      sortType:
        this.state.sortType === imageSorts.weight
          ? imageSorts.weightReverse
          : imageSorts.weight
    });
  };

  private _getImagesToRender = () => {
    const imagesByRowCount: imageObject[] = this._getImagesByRowCount();
    return this._getSortedBanks(imagesByRowCount);
  };

  private _getImagesByRowCount = () => {
    return this.state.images!.slice(0, this.state.rowsCount);
  };

  private _getSortedBanks = (images: imageObject[]) => {
    return images.sort(this._sortBanks);
  };

  private _sortBanks = (a: imageObject, b: imageObject) => {
    switch (this.state.sortType) {
      case imageSorts.id:
        return Number(a.id) - Number(b.id);
      case imageSorts.idReverse:
        return Number(b.id) - Number(a.id);
      case imageSorts.weight:
        return a.size > b.size ? 1 : -1;
      case imageSorts.weightReverse:
        return a.size > b.size ? -1 : 1;
      default:
        return a.id - b.id;
    }
  };

  private _onRowsChange = e => {
    if (validateNumField(e.target.value)) {
      console.log("empty after validation: ", e.target.value);
      const targetValue: number = Number(e.target.value);
      console.log("target value: ", targetValue);

      this.setState(
        {
          rowsCount:
            targetValue > this.state.maxRowsCount
              ? this.state.maxRowsCount
              : targetValue
        },
        () => {
          this._saveRowsCountToStorage();
        }
      );
    }
  };

  private _downloadAllImages = () => {
    if (!this.state.images) return;
    for (let i = 0; i < this.state.rowsCount; i++) {
      chrome.downloads.download({ url: this.state.images[i].link });
    }
  };

  private _setImages = (images: imageObject[]) => {
    this.setState({
      images,
      maxRowsCount: images.length,
      rowsCount:
        this.state.rowsCount > images.length
          ? images.length
          : this.state.rowsCount
    });
  };

  private _initImages = () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "get_images") {
        this._setImages(request.data);
      }
    });
  };

  //only for local tests in development
  private _getImagesList = async () => {
    const images = await this._is._getImages();
    this.setState({
      images,
      maxRowsCount: images.length,
      rowsCount:
        this.state.rowsCount > images.length
          ? images.length
          : this.state.rowsCount
    });
  };
}

function validateNumField(value: string): boolean {
  if (value.match(/^\d+$/) || value.length === 0) return true;
  return false;
}
