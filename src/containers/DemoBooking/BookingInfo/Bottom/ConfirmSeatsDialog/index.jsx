import React from "react";
import _ from "lodash";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

const ConfirmSeatsDialog = ({ open, validateSeats, onConfirm, onDisagree }) => {
  if (!open) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={onDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Lịch trình được khởi tạo chưa đủ số ghế theo số khách yêu cầu. Xác nhận
        tiếp tục ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <h5>Thông tin lịch trình</h5>
          <List dense={false}>
            {_.map(
              validateSeats.filter(x => x.get("notEnoughSeat")).toJS(),
              item => (
                <ListItem>
                  <ListItemText
                    primary={
                      <div className="kt-font-bolder">
                        Ngày {item.date}:
                        <span className="ml-1 kt-font-danger font-italic">
                          {`${item.current} ghế / ${item.target} khách`}
                        </span>
                      </div>
                    }
                  />
                </ListItem>
              )
            )}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDisagree} color="primary">
          Không
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default React.memo(ConfirmSeatsDialog);
