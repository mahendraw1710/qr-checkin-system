"use client";

import Webcam from "react-webcam";
import { useRef } from "react";

type Props = {
  onCapture: (imageSrc: string) => void;
};

export default function PhotoCapture({
  onCapture,
}: Props) {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc =
      webcamRef.current?.getScreenshot();

    if (imageSrc) {
      onCapture(imageSrc);
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded border"
      />

      <button
        className="border px-4 py-2 rounded mt-4"
        onClick={capture}
      >
        Take Photo
      </button>
    </div>
  );
}