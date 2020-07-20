import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import logo from "../../images/loginlogo.png";
import { Formik } from "formik";
import { GoogleLogin } from "react-google-login";
import { googleClassRoomLoginAction, googleClassRoomLoginFailureAction } from "../../actions/gapi";

const GoogleModel = ({ show, onHide, googleClassRoomLoginAction, googleClassRoomLoginFailureAction }) => {
  const [showForm, setShowForm] = useState(false);
  const [rooms, setRooms] = useState(["a", "b", "c"]);
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="model-box-google model-box-view"
    >
      <Modal.Header closeButton>
        <img src={logo} alt="" />
      </Modal.Header>
      <Modal.Body>
        <div className="sign-in-google">
          {!showForm ? (
            <div className="content-authorization">
              <p>
                With CurrikiStudio you can publish your Project as a new Google
                Classroom course.
              </p>
              <p>To start, please log into your Google account.</p>
              <div
                onClick={() => {
                  setShowForm(true);
                }}
              >
                <GoogleLogin
                  clientId={'8299142860-f5jl83fapof5ohs5vjstso5pll87uoor.apps.googleusercontent.com'}
                  onSuccess={googleClassRoomLoginAction}
                  onFailure={googleClassRoomLoginFailureAction}
                  scope="https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.topics https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students"
                >
                  <span> Login with Google</span>
                </GoogleLogin>
              </div>
            </div>
          ) : (
            <div className="classroom-form">
              <div>
                <h1>Please fill in the course details</h1>
                <Formik
                  initialValues={{
                    course: "",
                    heading: "",
                    description: "",
                    room: "",
                  }}
                  validate={(values) => {
                    const errors = {};

                    if (!values.course) {
                      errors.course = " Course Required";
                    }
                    if (!values.heading) {
                      errors.heading = "Heading Required";
                    }
                    if (!values.description) {
                      errors.description = " Description Required";
                    }
                    if (!values.room) {
                      errors.room = " Room Required";
                    }
                    if (values.room === "Select your room") {
                      errors.room = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      alert(JSON.stringify(values, null, 2));
                      setSubmitting(false);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit}>
                      {/* <input
                        type="text"
                        name="course"
                        class="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.course}
                        placeholder="Course Name"
                      /> */}

                      {/* {errors.course && touched.course && (
                        <div className="form-error"> {errors.course} </div>
                      )} */}

                      {/* <select
                        class="form-control"
                        name="room"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.room}
                        placeholder="Course Name"
                      >
                        <option>Select your room</option>
                        {rooms.map((data) => {
                          return <option>{data}</option>;
                        })}
                      </select> */}

                      {/* {errors.room && touched.room && (
                        <div className="form-error">{errors.room}</div>
                      )} */}

                      {/* <input
                        type="text"
                        name="heading"
                        class="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.heading}
                        placeholder="Heading"
                      /> */}

                      {/* {errors.heading && touched.heading && (
                        <div className="form-error">{errors.heading}</div>
                      )} */}

                      {/* <textarea
                        class="form-control"
                        rows="5"
                        type="text"
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        placeholder="Description"
                      /> */}

                      {/* {errors.description && touched.description && (
                        <div className="form-error">{errors.description}</div>
                      )} */}
                      <p>Are you sure you want to share this Project to Google Classroom?</p>
                      <button type="submit">Confirm</button>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}



const mapDispatchToProps = (dispatch) => ({
  googleClassRoomLoginAction: (response) => dispatch(googleClassRoomLoginAction(response)),
  googleClassRoomLoginFailureAction: (response) => dispatch(googleClassRoomLoginFailureAction(response))
});

const mapStateToProps = (state) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GoogleModel)
);
