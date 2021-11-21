import React, { useEffect, useRef, useState } from "react";
import { Image as Img, Radio, RadioGroup, Select } from "@mantine/core";
import styles from "./faceSplicer.module.css";
import { fetchJsonData } from "../helpers/fetchJsonData";
import { CanvasSaver } from "./CanvasSaver";

const picDirectoryPath = "./img/face-splicer/";

export default function FaceSplicer() {
  const [numberOfSlices, setNumberOfSlices] = useState("2");
  const [photoData, setPhotoData] = useState([]);
  const [personOne, setPersonOne] = useState(null);
  const [personTwo, setPersonTwo] = useState(null);
  const [personThree, setPersonThree] = useState(null);
  const [imageOne, setImageOne] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const [imageThree, setImageThree] = useState(null);

  const splicedCanvasRef = useRef(null);

  // Set tab title and icon
  useEffect(() => {
    document.title = "Face Splicer";
    // document.getElementById("favicon").href = "./face-splicer.ico";
  }, []);

  useEffect(() => {
    fetchJsonData("/data/faceSplicer/data.xml", (data) => {
      setPhotoData(data.images);

      // reminder of values
      console.table(data.images[0]);

      // set default values
      setPersonOne(data.images[0].name);
      setPersonTwo(data.images[1].name);
      setPersonThree(data.images[3].name);
    });
  }, []);

  // set current source images
  useEffect(() => {
    if (!photoData) return;
    if (!personOne || !personTwo) return;

    const person1Data = photoData.find((p) => p.name === personOne);
    const person2Data = photoData.find((p) => p.name === personTwo);
    const person3Data = photoData.find((p) => p.name === personThree);

    if (!person1Data || !person2Data || !person3Data) return;

    // load image 1
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => setImageOne(image);
    image.src = picDirectoryPath + person1Data.fileName;

    // load image 2
    const image2 = new Image();
    image2.crossOrigin = "Anonymous";
    image2.onload = () => {
      setImageTwo(image2);
    };
    image2.src = picDirectoryPath + person2Data.fileName;

    // load image 2
    const image3 = new Image();
    image3.crossOrigin = "Anonymous";
    image3.onload = () => {
      setImageThree(image3);
    };
    image3.src = picDirectoryPath + person3Data.fileName;
  }, [photoData, personOne, personTwo, personThree]);

  // create spliced canvas
  useEffect(() => {
    if (!imageOne || !imageTwo || !imageThree) return;

    const sliceFrac1 = 0.5;
    const sliceFrac2 = 0.65;
    const image2Y = sliceFrac1 * imageOne.height;
    const image2SliceH = imageTwo.height - image2Y;
    const image3Y = sliceFrac2 * imageOne.height;
    const image3SliceH = imageThree.height - image3Y;

    const canvas = splicedCanvasRef.current;
    canvas.width = imageOne.width;
    canvas.height = imageOne.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageOne, 0, 0);
    ctx.drawImage(
      imageTwo,
      0,
      image2Y,
      imageTwo.width,
      image2SliceH,
      0,
      image2Y,
      imageTwo.width,
      image2SliceH
    );

    if (numberOfSlices === "3") {
      ctx.drawImage(
        imageThree,
        0,
        image3Y,
        imageThree.width,
        image3SliceH,
        0,
        image3Y,
        imageThree.width,
        image3SliceH
      );
    }
    //
  }, [imageOne, imageTwo, imageThree, numberOfSlices]);

  const names = photoData.map((person) => person.name);

  return (
    <div className={styles.faceSplicer}>
      <header>
        <h1>Face Splicer</h1>
        <p>Make a face, download it, share it. Make someone smile!</p>
      </header>
      <main>
        <div className={styles.selectors}>
          <RadioGroup
            style={{ marginBottom: 20 }}
            value={numberOfSlices}
            onChange={setNumberOfSlices}
            label="Number of Slices"
          >
            <Radio value="2">Two</Radio>
            <Radio value="3">Three</Radio>
          </RadioGroup>

          <PersonSelector
            label="Person 1"
            value={personOne}
            onChange={setPersonOne}
            data={names}
            img={imageOne}
          />

          <PersonSelector
            label="Person 2"
            value={personTwo}
            onChange={setPersonTwo}
            data={names}
            img={imageTwo}
          />

          {numberOfSlices === "3" && (
            <PersonSelector
              label="Person 3"
              value={personThree}
              onChange={setPersonThree}
              data={names}
              img={imageThree}
            />
          )}
        </div>

        <div className={styles.output}>
          <canvas ref={splicedCanvasRef} />
        </div>
      </main>
      <CanvasSaver sourceCanvas={splicedCanvasRef.current} />
    </div>
  );
}

const PersonSelector = ({ value, onChange, data, img, label }) => {
  return (
    <div className={styles.personSelector}>
      {img && (
        <Img
          style={{ marginRight: 10 }}
          width={60}
          radius="md"
          withPlaceholder
          src={img.src}
          alt=""
        />
      )}
      <Select
        label={label}
        placeholder="Pick one"
        searchable
        value={value}
        onChange={onChange}
        data={data}
      />
    </div>
  );
};
