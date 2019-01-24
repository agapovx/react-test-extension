import * as React from "react";
import { Images } from "./app/components/images/images";
import Button from "./app/fragments/button";

export const App = () => {
  const closeExtension = () => {
    window.parent.postMessage({ message: "closeExtension" }, "*");
  };

  return (
    <div className="main-app">
      <div className="ma_images">
        <img
          className="ma_image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/1200px-Pac_Man.svg.png"
          alt="images"
        />
        <img
          className="ma_image"
          src="https://3c1703fe8d.site.internapcdn.net/newman/gfx/news/hires/2018/pacman.jpg"
          alt="images"
        />
        <img
          className="ma_image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Pac_Man.svg/1200px-Pac_Man.svg.png"
          alt="images"
        />
        <img
          className="ma_image"
          src="https://habrastorage.org/webt/cn/5o/dx/cn5odxj0tvmrhaf4jstaz7ptars.png"
          alt="images"
        />
        <img
          className="ma_image"
          src="https://habrastorage.org/webt/rl/he/2w/rlhe2wjgxij3ej65fi5t8lverts.jpeg"
          alt="images"
        />
        <img
          className="ma_image"
          src="https://habrastorage.org/webt/fq/et/je/fqetjemayjaeb_vhexffrugagtk.jpeg"
          alt="images"
        />
      </div>
      <div className="ma_content-wrapper">
        <div className="ma_header">
          <Button onClick={closeExtension} extraClass="ma_close-extension">
            Close Extension
          </Button>
        </div>
        <Images />
      </div>
    </div>
  );
};
