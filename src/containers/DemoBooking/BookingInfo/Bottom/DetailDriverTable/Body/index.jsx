import React, { memo } from "react";
import _ from "lodash";
import { Map } from "immutable";
import DetailDriverTableRow from "./Row";
import { checkMoment } from "helpers/utility";

const defaultMap = Map();

const DetailDriverTableBody = memo(
  ({
    tripId,
    grid,
    errors,
    setBottomDetailDataSource,
    handleChangeTime,
    handleChangeIsOneWay,
    handleChangeAffectAmount,
    handleChangeStewardess,
    handleAddNewGuide,
    handleDeleteGuide,
    handleChangeGuideInfo,
    handleCopyNextGuideInfo,
    handleCopyAllGuideInfo,
    handleChangeRestInput,
    handleChangeLocationPickup,
    handleChangeTimeArray
  }) => {
    return (
      <tbody>
        {grid.entrySeq().map(([recordKey, record], stt) => {
          return (
            <DetailDriverTableRow
              key={record.get("key")}
              stt={stt}
              record={record}
              tripId={tripId}
              errors={errors.get(recordKey) || defaultMap}
              setBottomDetailDataSource={setBottomDetailDataSource}
              handleChangeIsOneWay={handleChangeIsOneWay}
              handleChangeTime={handleChangeTime}
              handleChangeTimeArray={handleChangeTimeArray}
              handleChangeAffectAmount={handleChangeAffectAmount}
              handleChangeStewardess={handleChangeStewardess}
              handleAddNewGuide={handleAddNewGuide}
              handleDeleteGuide={handleDeleteGuide}
              handleChangeGuideInfo={handleChangeGuideInfo}
              handleCopyNextGuideInfo={handleCopyNextGuideInfo}
              handleCopyAllGuideInfo={handleCopyAllGuideInfo}
              handleChangeRestInput={handleChangeRestInput}
              handleChangeLocationPickup={handleChangeLocationPickup}
            />
          );
        })}
      </tbody>
    );
  }
);
export default DetailDriverTableBody;
