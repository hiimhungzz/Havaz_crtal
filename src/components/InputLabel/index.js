import React, { memo } from "react";
import { Input } from 'antd';

const InputLabel = memo((props) => {
  return (
    <div>
      {
        props.label && (
          <div className="labelInput">{props.label}</div>
        )
      }
      <Input
        {...props}
      />
    </div>
  );
});

export default InputLabel;