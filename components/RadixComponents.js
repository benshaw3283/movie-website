import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import styles from "../styles/radixSign.module.css";
import * as Avatar from '@radix-ui/react-avatar';
import {useSession} from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';



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

const RadixSlider = (props) => {
let background;

if (props.rating > 0 && props.rating < 11) background = 'absolute h-full bg-red-700'
if (props.rating > 10 && props.rating < 21) background = 'absolute h-full bg-red-600'
if (props.rating > 20 && props.rating < 31) background = 'absolute h-full bg-red-500'
if (props.rating > 30 && props.rating < 41) background = 'absolute h-full bg-red-400'
if (props.rating > 40 && props.rating < 51) background = 'absolute h-full bg-orange-400'
if (props.rating > 50 && props.rating < 61) background = 'absolute h-full bg-yellow-500'
if (props.rating > 60 && props.rating < 71) background = 'absolute h-full bg-yellow-400'
if (props.rating > 70 && props.rating < 81) background = 'absolute h-full bg-green-400'
if (props.rating > 80 && props.rating < 91) background = 'absolute h-full bg-green-500'
if (props.rating > 90 && props.rating < 100) background = 'absolute h-full bg-green-600'
if (props.rating === 100)  background = 'absolute h-full bg-violet-700'

  return (
  <form>
    <Slider.Root {...props} className={styles.SliderRoot}>
      <Slider.Track className={styles.SliderTrack}>
        <Slider.Range  className={background} />
      </Slider.Track>
      <Slider.Thumb className={styles.SliderThumb} />
    </Slider.Root>
  </form>
  )
  };

export { RadixSlider };



 const AvatarIcon = () => {
  const {data: session} = useSession();

  return (
  <div className= {{display: 'flex', gap: 20}}>
  <Avatar.Root className={styles.AvatarRoot}>
    <Avatar.Image 
    className={styles.AvatarImage}
    src={session.user.image}
    alt='AvatarIcon'
    >

    </Avatar.Image>
    <Avatar.Fallback className={styles.AvatarFallback}/>
  </Avatar.Root>
  </div>
  )
 };

 export {AvatarIcon};


const Dropdown = () => (
  <DropdownMenu.Root >
    <DropdownMenu.Trigger>
      
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content>
        <DropdownMenu.Label />
        <DropdownMenu.Item />

  
  
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export {Dropdown}



