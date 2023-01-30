import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import styles from "../styles/radixSign.module.css";

const CheckboxPassword = () => (
  <form>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1">
        <Checkbox.Indicator className="CheckboxIndicator">
          <EyeOpenIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="Label" htmlFor="c1"></label>
    </div>
  </form>
);

export { CheckboxPassword };

const RadixSlider = (props) => (
  <form>
    <Slider.Root {...props} className={styles.SliderRoot}>
      <Slider.Track className={styles.SliderTrack}>
        <Slider.Range className={styles.SliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.SliderThumb} />
    </Slider.Root>
  </form>
);

export { RadixSlider };
