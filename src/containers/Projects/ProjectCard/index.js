import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { getProjectId, googleShare } from 'store/actions/gapi';
import { cloneProject } from 'store/actions/search';
import { getProjectCourseFromLMS } from 'store/actions/project';
import { lmsPlaylist } from 'store/actions/playlist';

import SharePreviewPopup from 'components/SharePreviewPopup';
import ProjectPreviewModal from '../ProjectPreviewModal';

import './style.scss';

const ProjectCard = (props) => {
  const {
    showPreview,
    project,
    showDeletePopup,
    handleShow,
    setProjectId,
    activeFilter,
  } = props;

  const dispatch = useDispatch();
  const AllLms = useSelector((state) => state.share);
  const [allLms, setAllLms] = useState([]);
  useEffect(() => {
    setAllLms(AllLms);
  }, [AllLms]);

  return (
    <div className="col-md-3 check" id={activeFilter}>
      <div className="program-tile">
        <div className="program-thumb">
          <Link to={`/project/${project.id}/preview`}>
            {project.thumb_url && (
              <div
                className="project-thumb"
                style={{
                  backgroundImage: project.thumb_url.includes('pexels.com')
                    ? `url(${project.thumb_url})`
                    : `url(${global.config.resourceUrl}${project.thumb_url})`,
                }}
              />
            )}
          </Link>
        </div>

        <div className="program-content">
          <div>
            <div className="row">
              <div className="col-md-10">
                <h3 className="program-title">
                  <Link to={`/project/${project.id}`}>{project.name}</Link>
                </h3>
              </div>

              <div className="col-md-2">
                <Dropdown className="project-dropdown check d-flex justify-content-center align-items-center">
                  <Dropdown.Toggle className="project-dropdown-btn project d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon icon="ellipsis-v" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/project/${project.id}/preview`}
                    >
                      <FontAwesomeIcon icon="eye" className="mr-2" />
                      Preview
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to={`/project/${project.id}/edit`}>
                      <FontAwesomeIcon icon="pen" className="mr-2" />
                      Edit
                    </Dropdown.Item>

                    <Dropdown.Item
                      to="#"
                      onClick={() => {
                        Swal.showLoading();
                        cloneProject(project.id);
                      }}
                    >
                      <FontAwesomeIcon icon="clone" className="mr-2" />
                      Duplicate
                    </Dropdown.Item>

                    <li className="dropdown-submenu send">
                      <a tabIndex="-1">
                        <FontAwesomeIcon icon="newspaper" className="mr-2" />
                        Publish
                      </a>
                      <ul className="dropdown-menu check">
                        <li
                          onClick={() => {
                            handleShow();
                            getProjectId(project.id);
                            setProjectId(props.project.id);
                            dispatch(googleShare(false));
                          }}
                        >
                          <a>Google Classroom</a>
                        </li>

                        {allLms.shareVendors
                          && allLms.shareVendors.map((data) => (
                            <li>
                              <a
                                onClick={async () => {
                                  const allPlaylist = await dispatch(lmsPlaylist(project.id));
                                  if (allPlaylist) {
                                    dispatch(
                                      getProjectCourseFromLMS(
                                        data.lms_name.toLowerCase(),
                                        data.id,
                                        project.id,
                                        allPlaylist.playlists,
                                        data.lms_url,
                                      ),
                                    );
                                  }
                                }}
                              >
                                {data.site_name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </li>

                    {project.shared && (
                      <Dropdown.Item
                        to="#"
                        onClick={() => {
                          const protocol = `${window.location.href.split('/')[0]}//`;
                          const url = `${protocol + window.location.host}/project/${project.id}/shared`;
                          SharePreviewPopup(url, project.name);
                        }}
                      >
                        <FontAwesomeIcon icon="share" className="mr-2" />
                        Share
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item
                      to="#"
                      onClick={() => showDeletePopup(project.id, project.name, 'Project')}
                    >
                      <FontAwesomeIcon icon="times-circle" className="mr-2" />
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="lessons-duration">
              <div className="row">
                <div className="col-md-12">
                  {activeFilter === 'small-grid' ? (
                    <p>
                      {project.description && project.description.length > 80
                        ? `${project.description.substring(0, 80)} ...`
                        : project.description}
                    </p>
                  ) : (
                    <p>
                      {project.description && project.description.length > 130
                        ? `${project.description.substring(0, 130)} ...`
                        : project.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="button-bottom">
            <Link to={`/project/${project.id}/preview`}>
              <FontAwesomeIcon icon="eye" className="mr-2" />
              Preview
            </Link>

            <Link to={`/project/${project.id}`}>
              <FontAwesomeIcon icon="cubes" className="mr-2" />
              Build
            </Link>

            <Link to={`/project/${project.id}/edit`}>
              <FontAwesomeIcon icon="pen" className="mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {showPreview && (
        <ProjectPreviewModal key={project.id} project={project} />
      )}
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  showPreview: PropTypes.bool,
  showDeletePopup: PropTypes.func.isRequired,
  handleShow: PropTypes.func.isRequired,
  setProjectId: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
};

ProjectCard.defaultProps = {
  showPreview: false,
};

export default ProjectCard;
