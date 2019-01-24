import * as React from "react";
import { imageObject } from "./images-store";
import { ImageItem } from "./image-item";
import Button from "../../fragments/button";

interface ImagesListProps {
  images: imageObject[];
  sortByName: () => void;
  sortByWeight: () => void;
}

export class ImagesList extends React.Component<ImagesListProps, {}> {
  constructor(props: ImagesListProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="images-list">
        <header className="il_header">
          <div className="il_header-title">Sort By</div>
          <div className="il_header-buttons">
            <Button onClick={this.props.sortByName} extraClass="il_name">
              Name
            </Button>
            <Button onClick={this.props.sortByWeight} extraClass="il_size">
              Size
            </Button>
          </div>
        </header>
        <div className="il_content">{this._renderImages()}</div>
      </div>
    );
  }

  protected _renderImages = () => {
    return this.props.images.map((image: imageObject, key: number) => (
      <ImageItem image={image} countPosition={image.id} key={key} />
    ));
  };
}
