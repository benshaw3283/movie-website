import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { EyeOpenIcon } from "@radix-ui/react-icons";

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

