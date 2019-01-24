import * as React from "react";
import { imageObject } from "./images-store";
import Button from "../../fragments/button";

interface ImageItemProps {
  image: imageObject;
  countPosition: number;
}

export class ImageItem extends React.Component<ImageItemProps, {}> {
  render() {
    return (
      <div className="image-item">
        <div className="ii_count-position">
          <a href={this.props.image.link} target="_blank">{`Image №${
            this.props.countPosition
          }`}</a>
        </div>
        <div className="ii_right-flex">
          <div className="ii_size">{`${this.props.image.size} Mb`}</div>
          <Button
            onClick={this._downloadImage}
            extraClass="ii_download-image"
          />
        </div>
      </div>
    );
  }

  private _downloadImage = () => {
    chrome.downloads.download({ url: this.props.image.link });
  };
}
