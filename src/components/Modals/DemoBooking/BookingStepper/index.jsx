import React from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";

let style = {
  fontSize: "13px",
  position: "sticky",
  padding: 0
};
const BookingStepper = props => {
  return (
    <Stepper style={style} activeStep={props.activeStep} alternativeLabel>
      {props.steps.map(label => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
export default React.memo(BookingStepper);
