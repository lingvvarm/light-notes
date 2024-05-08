import { useEffect, useRef, useState } from "react";
import "./ColorPicker.scss";
import { ColorResult, TwitterPicker } from "react-color";

function ColorPicker({
  changeColor,
}: {
  changeColor: (color: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [curColor, setCurColor] = useState<ColorResult | undefined>();
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const handleExpand = function () {
    setIsExpanded(true);
  };

  const handleClose = function () {
    setIsExpanded(false);
  };

  const handleColorChange = function (color: ColorResult) {
    setCurColor(color);
    changeColor(color.hex);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    if (isExpanded) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <div className="color-picker" ref={colorPickerRef}>
        <button className="palette-btn" type="button" onClick={handleExpand}>
          <span className="material-symbols-outlined">palette</span>
        </button>
        {isExpanded && (
          <div className="palette">
            <TwitterPicker
              colors={[
                "#FF6900",
                "#FCB900",
                "#7BDCB5",
                "#00D084",
                "#8ED1FC",
                "#0693E3",
                "#ABB8C3",
                "#EB144C",
                "#F78DA7",
                "#FFFFFF",
              ]}
              // @ts-expect-error inner library types
              color={curColor}
              onChange={handleColorChange}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ColorPicker;
