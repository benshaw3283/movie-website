import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { EyeOpenIcon } from "@radix-ui/react-icons";
import * as Slider from '@radix-ui/react-slider';
import styles from '../styles/radixSign.module.css'

const CheckboxPassword = () => 
 (
  <form>
    <div style={{ display:'flex', alignItems: 'center' }}>
      <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1">
        <Checkbox.Indicator className="CheckboxIndicator">
          <EyeOpenIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="Label" htmlFor="c1">
      </label>
    </div>
  </form>
);


export {CheckboxPassword};


const RadixSlider = () => (
  <form>
    <Slider.Root className="SliderRoot" defaultValue={[50]} max={100} step={1} aria-label="Volume">
      <Slider.Track className={styles.SliderTrack}>
        <Slider.Range className={styles.SliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.SliderThumb} />
    </Slider.Root>
  </form>
);

export {RadixSlider}
