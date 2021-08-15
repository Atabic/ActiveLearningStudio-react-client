/* eslint-disable */
import React, { useState } from "react";
import HeadingTwo from "utils/HeadingTwo/headingtwo";
import FrameImage1 from "assets/images/Frame 869.png";
import FrameImage2 from "assets/images/Frame 870.png";
import HeadingThree from "utils/HeadingThree/headingthree";
import HeadingText from "utils/HeadingText/headingtext";
import Buttons from "utils/Buttons/buttons";
import ActivityLayout from "./activitylayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const NewActivity = () => {
  const [layout, setLayout] = useState("");
  const [activityLayout, setActivityLayout] = useState(false);

  const activityHandler = () => {
    setActivityLayout(!activityLayout);
  };

  return (
    <>
      {activityLayout && (
        <div className="form-new-popup-activity">
          <FontAwesomeIcon
            icon="times"
            className="cross-all-pop"
            onClick={activityHandler}
          />
          <div className="inner-form-content">
            <ActivityLayout />
          </div>
        </div>
      )}
      <div className="create-form-activity">
        <div className="activityHeading">
          <HeadingTwo
            text="Start creating!"
            color="#084892"
            className="headingText"
          />
        </div>
        <div className="createActivity-layoutCard">
          <div
            className={
              layout == "layout" ? "layoutCard layoutCard-active" : "layoutCard"
            }
            onClick={() => setLayout("layout")}
          >
            <img src={FrameImage1} alt="" className="mb-16" />
            <HeadingThree text="LAYOUT" color="#515151" />
            <HeadingText
              text="Add multiple activities into a Layout to create an awesome content."
              color="#515151"
            />
          </div>
          <div
            className={
              layout == "singleactivity"
                ? "layoutCard ml-40 layoutCard-active"
                : "layoutCard ml-40"
            }
            onClick={() => setLayout("singleactivity")}
          >
            <img src={FrameImage2} alt="" className="mb-16" />
            <HeadingThree text="SINGLE ACTIVITY" color="#515151" />
            <HeadingText
              text="Select from 50 learning activity types to create an amazing activity."
              color="#515151"
            />
          </div>
        </div>
        <div className="createActivity-btns">
          <Buttons text="Cancel" secondary={true} width="111px" height="36px" />
          <Buttons
            text="Next"
            defaultgrey={layout ? false : true}
            width="96px"
            height="36px"
            onClick={activityHandler}
          />
        </div>
      </div>
    </>
  );
};

export default NewActivity;
