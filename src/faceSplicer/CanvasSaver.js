import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@mantine/core";
import { BiDownload } from "react-icons/bi";

export const CanvasSaver = ({ sourceCanvas, filename = "spliced-face" }) => {
  const onSave = () => {
    if (!sourceCanvas) return;
    sourceCanvas.toBlob(
      (blob) => {
        saveAs(blob, `${filename}.jpg`);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <Button
      onClick={onSave}
      leftIcon={<BiDownload size={14} />}
      variant="outline"
      color="dark"
      size="md"
      uppercase
      styles={{ root: { boxShadow: "var(--shadow-elevation-medium)" } }}
    >
      Download Image
    </Button>
  );
};
