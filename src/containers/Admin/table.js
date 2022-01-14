/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import adminService from 'services/admin.service';

import * as actionTypes from 'store/actionTypes';
import { toggleProjectShareAction, toggleProjectShareRemovedAction, visibilityTypes, updateProjectAction, getElastic, getIndexed } from 'store/actions/project';
import { deleteUserFromOrganization, getOrganization, clearOrganizationState, removeUserFromOrganization, getRoles, updatePageNumber } from 'store/actions/organization';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';

import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Dropdown } from 'react-bootstrap';
import { forgetSpecificFailedJob, retrySpecificFailedJob, setActiveAdminForm, setActiveTab, setCurrentProject, setCurrentUser } from 'store/actions/admin';
// import { deleteActivityItem, deleteActivityType, getActivityItems, loadResourceTypesAction, selectActivityItem, selectActivityType } from 'store/actions/resource';

import AdminDropdown from './adminDropdown';
import AdminPagination from './pagination';
import { faCheckCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';
function Table(props) {
  const {
    tableHead,
    sortCol,
    handleSort,
    history,
    data,
    type,
    jobType,
    subTypeState,
    activePage,
    setActivePage,
    searchAlertToggler,
    searchAlertTogglerStats,
    subType,
    setCurrentTab,
    setChangeIndexValue,
    changeIndexValue,
    setAllProjectIndexTab,
    changeProjectFromorg,
    setAllProjectTab,
    setModalShow,
    setrowData,
    setActivePageNumber,
  } = props;

  const organization = useSelector((state) => state.organization);
  const auth = useSelector((state) => state.auth);
  const [visibilityTypeArray, setVisibilityTypeArray] = useState([]);
  const { newlyCreated, newlyEdit } = useSelector((state) => state.admin);
  const project = useSelector((state) => state.project);
  const { paginations } = useSelector((state) => state.ui);
  const { activeOrganization, allSuborgList, permission } = organization;
  const allState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [localStateData, setLocalStateData] = useState([]);
  const [localOrganizationList, setLocalOrganizationList] = useState(null);
  const [localstatePagination, setLocalStatePagination] = useState();
  const indexingArray = [
    { indexing: 0, indexing_text: 'NOT REQUESTED' },
    { indexing: 1, indexing_text: 'REQUESTED' },
    { indexing: 3, indexing_text: 'APPROVED' },
    { indexing: 2, indexing_text: 'REJECTED' },
  ];
  useEffect(() => {
    (async () => {
      if (project?.visibilityTypes.length === 0) {
        const { data } = await dispatch(visibilityTypes());
        setVisibilityTypeArray(data.data);
      } else {
        setVisibilityTypeArray(project?.visibilityTypes?.data);
      }
    })();
  }, [project?.visibilityTypes]);
  useEffect(() => {
    if (allSuborgList?.data) {
      setLocalOrganizationList(allSuborgList);
    }
  }, [allSuborgList]);
  //update table after crud
  useEffect(() => {
    if (type === 'LMS') {
      if (newlyCreated) {
        setLocalStateData([newlyCreated, ...data?.data]);
      } else if (newlyEdit) {
        setLocalStateData(
          data?.data.map((lms) => {
            if (lms.id === newlyEdit?.id) {
              return newlyEdit;
            } else {
              return lms;
            }
          })
        );
      }
    }
    dispatch({
      type: actionTypes.NEWLY_EDIT_RESOURCE,
      payload: null,
    });
    dispatch({
      type: actionTypes.NEWLY_CREATED_RESOURCE,
      payload: null,
    });
  }, [newlyCreated, newlyEdit]);

  //update table after search and first time
  useEffect(() => {
    if (type === 'LMS' || type === 'Projects' || type === 'DefaultSso') {
      if (data?.data) {
        setLocalStateData(data?.data);
      } else {
        setLocalStateData(data);
      }
      setLocalStatePagination(data);
    }
  }, [data]);
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: 'Are you sure you want to delete this User?',
      text: 'This action is Irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#084892',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Do you want to preserve user data?',
          showCancelButton: true,
          confirmButtonColor: '#084892',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        }).then((result) => {
          const response = dispatch(deleteUserFromOrganization(user?.id, result.isConfirmed ? true : false));
          response
            .then(() => {
              // dispatch(getOrgUsers(organization?.activeOrganization?.id, organization?.activePage, organization?.size, organization?.activeRole));
            })
            .catch((e) => {
              console.log(e);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User Deletion failed, kindly try again.',
              });
            });
        });
      }
    });
  };
  const handleRemoveUser = (user) => {
    Swal.fire({
      title: 'Are you sure you want to remove this User?',
      text: 'This action is Irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#084892',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Do you want to preserve user data?',
          showCancelButton: true,
          confirmButtonColor: '#084892',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        }).then((result) => {
          const response = dispatch(removeUserFromOrganization(user?.id, result.isConfirmed ? true : false));
          response
            .then(() => {
              //     dispatch(getOrgUsers(organization?.activeOrganization?.id, organization?.activePage, organization?.size, organization?.activeRole));
            })
            .catch((e) => {
              console.log(e);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User Remove failed, kindly try again.',
              });
            });
        });
      }
    });
  };
  //const history = useHistory();
  return (
    <div className="table-data">
      {((data?.data?.length > 0 && data?.meta) || (localOrganizationList?.data?.length > 0 && localOrganizationList?.meta)) && (
        <AdminPagination
          setCurrentTab={setCurrentTab}
          subType={subType}
          subTypeState={subTypeState}
          type={type}
          data={data}
          activePage={activePage}
          setActivePage={setActivePage}
          updatePageNumber={updatePageNumber}
          localstatePagination={localstatePagination}
        />
      )}
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              {tableHead?.map((head, keyid) => {
                let checkSolCol = sortCol != '' && sortCol.includes(head) ? true : false;
                return head === 'Users' && permission?.Organization?.includes('organization:view-user') ? (
                  <th key={keyid}> {head} </th>
                ) : head !== 'Users' ? (
                  <th onClick={checkSolCol ? () => handleSort(head, typeof subType != 'undefined' ? subType : type) : ''} className={checkSolCol ? 'sorting-icon' : ''}>
                    {head}
                  </th>
                ) : null;
              })}
            </tr>
          </thead>
          <tbody>
            {type === 'Stats' &&
              subTypeState === 'Report' &&
              (data?.data?.length > 0 ? (
                data?.data?.map((row, keyid) => (
                  <tr key={keyid}>
                    <td>{row.first_name}</td>
                    <td>{row.last_name}</td>
                    <td>{row.email}</td>
                    <td>{row.projects_count}</td>
                    <td>{row.playlists_count}</td>
                    <td>{row.activities_count}</td>
                  </tr>
                ))
              ) : data?.data?.length === 0 || searchAlertTogglerStats === 0 ? (
                <tr>
                  <td colSpan="6">
                    <Alert variant="warning">No Reports Found</Alert>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'Stats' &&
              subTypeState === 'Queues: Jobs' &&
              (data?.data?.length > 0 ? (
                data?.data.map((job) => (
                  <tr>
                    <td>{job.id}</td>
                    <td>{job.queue}</td>
                    <td>{job.payload}</td>
                    <td>{job.exception}</td>
                    <td>{job.time}</td>
                    {jobType.value === 2 ? (
                      <td>
                        <div className="links">
                          <Link
                            onClick={() => {
                              dispatch(retrySpecificFailedJob(job.id));
                            }}
                          >
                            Retry
                          </Link>
                          <Link
                            onClick={() => {
                              dispatch(forgetSpecificFailedJob(job.id));
                            }}
                          >
                            Forget
                          </Link>
                        </div>
                      </td>
                    ) : (
                      <td>{job.action ? job.action : 'N/A'}</td>
                    )}
                  </tr>
                ))
              ) : data?.data?.length === 0 || searchAlertTogglerStats === 0 ? (
                <tr>
                  <td colSpan="6">
                    <Alert variant="warning">No Queue: Jobs Found</Alert>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'Stats' &&
              subTypeState === 'Queues: Logs' &&
              (data?.data?.length > 0 ? (
                data?.data.map((job) => (
                  <tr>
                    <td>{job.name}</td>
                    <td>
                      {job.is_finished && job.failed && <Alert variant="danger">Failed</Alert>}
                      {!job.is_finished && !job.failed && <Alert variant="primary">Running</Alert>}
                      {job.is_finished && !job.failed && <Alert variant="success">Success</Alert>}
                    </td>
                    <td>{job.started_at}</td>
                    <td>
                      Queue: {job.queue} Attempt: {job.attempt}
                    </td>
                    <td>{job.time_elapsed}</td>
                    <td>{job.exception_message}</td>
                  </tr>
                ))
              ) : data?.data?.length === 0 || searchAlertTogglerStats === 0 ? (
                <tr>
                  <td colSpan="6">
                    <Alert variant="warning">No Queue: Logs Found</Alert>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="6">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'LMS' &&
              subType === 'All settings' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData?.map((row) => (
                    <tr key={row} className="admin-panel-rows">
                      <td>{row.lms_url}</td>
                      <td>{row.lms_name}</td>
                      <td>{row.user?.first_name + ' ' + row.user?.last_name}</td>
                      <td>{row?.user?.email}</td>
                      <td>{row?.site_name}</td>
                      <td>
                        <div className="admin-panel-dropdown">
                          {row?.description}
                          <div>
                            <AdminDropdown type={type} subType="All settings" row={row} activePage={activePage} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No integration found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="11">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'LMS' &&
              subType === 'BrightCove' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData?.map((row) => (
                    <tr key={row} className="admin-panel-rows">
                      <td>{row.organization?.id}</td>
                      <td>{row.account_id}</td>
                      <td>{row.account_email}</td>
                      <td>{row.account_name}</td>
                      <td>{row.description}</td>
                      <td>{row.client_id}</td>
                      <td>{row.client_secret}</td>
                      <td>
                        <div className="admin-panel-dropdown">
                          {row.css_path ? (
                            <a download href={global.config.resourceUrl + row.css_path} target="_blank">
                              download
                            </a>
                          ) : (
                            'Not Available'
                          )}
                          <div>
                            <AdminDropdown type={type} subType="BrightCove" row={row} activePage={activePage} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No integration found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="11">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'Users' &&
              (data?.data?.length > 0 ? (
                data?.data.map((user) => (
                  <tr className="admin-panel-rows">
                    <td>{user.organization_joined_at ? user.organization_joined_at : 'NA'}</td>
                    <td>{user.first_name ? user.first_name : 'NA'}</td>
                    <td>{user.last_name ? user.last_name : 'NA'}</td>
                    <td>{user.email ? user.email : 'NA'}</td>
                    <td>{activeOrganization?.name ? activeOrganization?.name : 'NA'}</td>
                    <td>{user.organization_type ? user.organization_type : 'NA'}</td>
                    <td>
                      <div className="admin-panel-dropdown">
                        {user.organization_role ? user.organization_role : 'NA'}
                        <div>
                          <AdminDropdown type={type} user={user} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : searchAlertToggler === 0 || data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <Alert variant="warning">No User Found</Alert>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="8">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'Organization' &&
              (localOrganizationList ? (
                localOrganizationList?.data?.length > 0 ? (
                  localOrganizationList?.data?.map((row) => (
                    <tr key={row} className="admin-panel-rows">
                      <td>
                        <div className="admin-name-img">
                          <div
                            style={{
                              backgroundImage: `url(${global.config.resourceUrl + row.image})`,
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: 'cover',
                            }}
                            className="admin-img"
                          >
                            {/* <img src={global.config.resourceUrl + row.image} alt="" /> */}
                          </div>

                          <Link
                            className="admin-name"
                            to="#"
                            onClick={async () => {
                              Swal.fire({
                                title: 'Please Wait !',
                                html: 'Updating View ...',
                                allowOutsideClick: false,
                                onBeforeOpen: () => {
                                  Swal.showLoading();
                                },
                              });
                              if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                              Swal.close();
                              dispatch({
                                type: actionTypes.UPDATE_PAGINATION,
                                payload: [...paginations, row],
                              });
                              if (row.projects_count > 0) {
                                if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                                dispatch(clearOrganizationState());
                                dispatch(getRoles());
                                // dispatch(setActiveTab('Project'));
                                // dispatch(clearOrganizationState());
                                // dispatch(getRoles());
                              }
                            }}
                          >
                            {row.name}
                          </Link>
                        </div>
                      </td>
                      <td>{row.domain}</td>
                      <td>
                        {row.projects_count > 0 ? (
                          <div
                            className="view-all"
                            onClick={async () => {
                              Swal.fire({
                                title: 'Please Wait !',
                                html: 'Updating View ...',
                                allowOutsideClick: false,
                                onBeforeOpen: () => {
                                  Swal.showLoading();
                                },
                              });
                              if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                              Swal.close();
                              dispatch({
                                type: actionTypes.UPDATE_PAGINATION,
                                payload: [...paginations, row],
                              });
                              if (row.projects_count > 0) {
                                if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                                dispatch(clearOrganizationState());
                                dispatch(getRoles());
                                dispatch(setActiveTab('Projects'));
                              }
                            }}
                          >
                            {row.projects_count}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {row.suborganization_count > 0 ? (
                          <Link
                            className="view-all"
                            onClick={async () => {
                              if (row.suborganization_count > 0) {
                                Swal.fire({
                                  title: 'Please Wait !',
                                  html: 'Updating View ...',
                                  allowOutsideClick: false,
                                  onBeforeOpen: () => {
                                    Swal.showLoading();
                                  },
                                });

                                if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                                Swal.close();
                                dispatch({
                                  type: actionTypes.UPDATE_PAGINATION,
                                  payload: [...paginations, row],
                                });
                                dispatch(clearOrganizationState());
                                dispatch(getRoles());
                              }
                            }}
                          >
                            {row.suborganization_count || 0}
                          </Link>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      {permission?.Organization?.includes('organization:view-user') && (
                        <td>
                          {row.users_count > 0 ? (
                            <Link
                              className="view-all"
                              onClick={async () => {
                                if (row.users_count > 0) {
                                  Swal.fire({
                                    title: 'Please Wait !',
                                    html: 'Updating View ...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                      Swal.showLoading();
                                    },
                                  });
                                  if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                                  Swal.close();
                                  dispatch({
                                    type: actionTypes.UPDATE_PAGINATION,
                                    payload: [...paginations, row],
                                  });
                                  dispatch(clearOrganizationState());
                                  dispatch(getRoles());
                                  dispatch(setActiveTab('Users'));
                                }
                              }}
                            >
                              {row.users_count}
                            </Link>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      )}
                      {/* <td>
                    {row.groups_count > 0 ? (
                      <Link
                        to={`/org/${allState?.organization?.currentOrganization?.domain}/groups`}
                        className="view-all"
                        onClick={
                          async () => {
                            if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                            dispatch(clearOrganizationState());
                            dispatch(getRoles());
                          }
                        }
                      >
                        {row.groups_count}
                      </Link>
                    ) : 'N/A'}
                  </td> */}
                      <td>
                        <div className="admin-panel-dropdown">
                          {row.teams_count > 0 ? (
                            <Link
                              to={`/org/${allState?.organization?.currentOrganization?.domain}/teams`}
                              className="view-all"
                              onClick={async () => {
                                if (permission?.Organization?.includes('organization:view')) await dispatch(getOrganization(row.id));
                                dispatch(clearOrganizationState());
                                dispatch(getRoles());
                              }}
                            >
                              {row.teams_count}
                            </Link>
                          ) : (
                            'N/A'
                          )}
                          <div>
                            <AdminDropdown type={type} row={row} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center' }}>
                      <Alert variant="warning"> No sub-organization available</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="9">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'Projects' &&
              subType === 'All Projects' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData.map((row) => {
                    const createNew = new Date(row.created_at);
                    const updateNew = new Date(row.updated_at);
                    return (
                      <tr className="admin-panel-rows">
                        <td>
                          <div className="admin-name-img">
                            <div
                              style={{
                                backgroundImage: row.thumb_url.includes('pexels.com') ? `url(${row.thumb_url})` : `url(${global.config.resourceUrl}${row.thumb_url})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                              }}
                              className="admin-img"
                            ></div>

                            <Link className="admin-name" to={`/org/${organization?.currentOrganization?.domain}/project/${row.id}/preview`}>
                              {row.name}
                            </Link>
                          </div>
                        </td>
                        <td>{new Date(createNew.toDateString()).toLocaleDateString('en-US')}</td>

                        <td>
                          <div className="admin-description">{row.description}</div>
                        </td>

                        <td>{row.id}</td>
                        <td>{row.users?.[0]?.name}</td>
                        <td>
                          <div className="filter-dropdown-table">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                {row.indexing_text === 'NOT REQUESTED' ? '' : row.indexing_text}
                                <FontAwesomeIcon icon="chevron-down" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {indexingArray.map((element) => (
                                  <Dropdown.Item
                                    onClick={async () => {
                                      const result = await adminService.updateIndex(row.id, element.indexing);
                                      if (result?.message) {
                                        const editRow = {
                                          ...row,
                                          indexing: element.indexing,
                                          indexing_text: element.indexing_text,
                                        };
                                        setLocalStateData(localStateData.map((indexing) => (indexing.id === row.id ? editRow : indexing)));
                                        Swal.fire({
                                          icon: 'success',
                                          text: result.message,
                                        });
                                      } else {
                                        Swal.fire({
                                          icon: 'error',
                                          text: 'Error',
                                        });
                                      }
                                    }}
                                  >
                                    {element.indexing_text}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                        <td>
                          <div className="filter-dropdown-table">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                {visibilityTypeArray?.filter((element) => element.id === row.organization_visibility_type_id)[0]?.display_name}
                                <FontAwesomeIcon icon="chevron-down" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {visibilityTypeArray?.map((element) => (
                                  <Dropdown.Item
                                    onClick={async () => {
                                      Swal.showLoading();
                                      const result = await dispatch(updateProjectAction(row.id, { ...row, organization_visibility_type_id: element.id }));
                                      if (result) {
                                        setLocalStateData(localStateData.map((element1) => (element1.id === row.id ? result : element1)));
                                      }
                                      await dispatch(getIndexed(row.id));
                                      await dispatch(getElastic(row.id));
                                      Swal.close();
                                    }}
                                  >
                                    {element.display_name}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                        <td>
                          <div className="filter-dropdown-table">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                {row.shared ? 'Enabled' : 'Disabled'}
                                <FontAwesomeIcon icon="chevron-down" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={async () => {
                                    if (!row.shared) {
                                      const result = await dispatch(toggleProjectShareAction(row.id, row.name, true));
                                      if (result) {
                                        setLocalStateData(localStateData.map((element) => (element.id === row.id ? result : element)));
                                      }
                                    }
                                  }}
                                >
                                  Enable
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={async () => {
                                    if (row.shared) {
                                      const result = await dispatch(toggleProjectShareRemovedAction(row.id, row.name, true));
                                      if (result) {
                                        setLocalStateData(localStateData.map((element) => (element.id === row.id ? result : element)));
                                      }
                                    }
                                  }}
                                >
                                  Disable
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                        {/* <td>{String(row.starter_project)}</td> */}
                        {/* <td>{row.status_text}</td> */}
                        <td>
                          <div className="admin-panel-dropdown">
                            {new Date(updateNew.toDateString()).toLocaleDateString('en-US')}
                            <div>
                              <AdminDropdown
                                activePage={activePage}
                                setAllProjectTab={setAllProjectTab}
                                setLocalStateData={setLocalStateData}
                                localStateData={localStateData}
                                type={type}
                                row={row}
                                setModalShow={setModalShow}
                                setrowData={setrowData}
                                setActivePageNumber={setActivePageNumber}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No result found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="13">
                    <Alert variant="primary">Loading data...</Alert>
                  </td>
                </tr>
              ))}

            {type === 'Projects' &&
              subType === 'Exported Projects' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData?.map((row) => {
                    return (
                      <tr className="org-rows">
                        <td>{row.project}</td>
                        <td>{row.created_at}</td>
                        <td>{row.will_expire_on}</td>
                        <td>
                          <a href={row.link} target="_blank">
                            Download
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No result found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="13">
                    <Alert variant="primary">Loading data...</Alert>
                  </td>
                </tr>
              ))}

            {/* {type === 'Projects' &&
              subType === 'Library requests' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData.map((row) => {
                    const createNew = new Date(row.created_at);
                    const updateNew = new Date(row.updated_at);
                    return (
                      <tr className="admin-panel-rows">
                        <td>
                          <div className="admin-name-img">
                            <div
                              style={{
                                backgroundImage: row.thumb_url.includes('pexels.com') ? `url(${row.thumb_url})` : `url(${global.config.resourceUrl}${row.thumb_url})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                              }}
                              className="admin-img"
                            ></div>

                            <Link className="admin-name" target="_blank" to={`/org/${organization?.currentOrganization?.domain}/project/${row.id}/preview`}>
                              {row.name}
                            </Link>
                          </div>
                        </td>
                        <td>{new Date(createNew.toDateString()).toLocaleDateString('en-US')}</td>
                        <td>{row.id}</td>
                        <td>{row.users?.[0]?.email}</td>
                        <td>{row.indexing_text}</td>
                        <td>
                          {row.shared ? (
                            <Link className="shared-link-enable">Enabled</Link>
                          ) : (
                            <>
                              <Link className="shared-link-disable">Disabled</Link>
                            </>
                          )}
                        </td>
                        <td>{new Date(updateNew.toDateString()).toLocaleDateString('en-US')}</td>
                        <td>
                          <div className="links">
                            {(row.indexing === 1 || row.indexing === 2) && (
                              <Link
                                style={{ padding: '4px 0' }}
                                className="approve-label"
                                onClick={async () => {
                                  Swal.fire({
                                    title: 'Please Wait !',
                                    html: 'Approving Project ...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                      Swal.showLoading();
                                    },
                                  });
                                  const result = await adminService.updateIndex(row.id, 3);
                                  if (result?.message) {
                                    if (changeIndexValue !== 0) {
                                      setLocalStateData(localStateData.filter((indexing) => indexing.id !== row.id));
                                    } else {
                                      const editRow = {
                                        ...row,
                                        indexing: 3,
                                        indexing_text: 'APPROVED',
                                      };
                                      setLocalStateData(localStateData.map((indexing) => (indexing.id == row.id ? editRow : indexing)));
                                    }
                                    Swal.fire({
                                      icon: 'success',
                                      text: result.message,
                                    });
                                  } else {
                                    Swal.fire({
                                      icon: 'error',
                                      text: 'Error',
                                    });
                                  }
                                }}
                              >
                                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '4px' }} />
                                Approve&nbsp;&nbsp;
                              </Link>
                            )}
                            {(row.indexing === 1 || row.indexing === 3) && (
                              <Link
                                style={{ padding: '4px 0' }}
                                className="reject-label"
                                onClick={async () => {
                                  Swal.fire({
                                    title: 'Please Wait !',
                                    html: 'Rejecting Project ...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                      Swal.showLoading();
                                    },
                                  });
                                  const result = await adminService.updateIndex(row.id, 2);
                                  if (result?.message) {
                                    if (changeIndexValue !== 0) {
                                      setLocalStateData(localStateData.filter((indexing) => indexing.id !== row.id));
                                    } else {
                                      const editRow = {
                                        ...row,
                                        indexing: 2,
                                        indexing_text: 'REJECT',
                                      };
                                      setLocalStateData(localStateData.map((indexing) => (indexing.id == row.id ? editRow : indexing)));
                                    }
                                    Swal.fire({
                                      icon: 'success',
                                      text: result.message,
                                    });
                                  } else {
                                    Swal.fire({
                                      icon: 'error',
                                      text: 'Error',
                                    });
                                  }
                                }}
                              >
                                <FontAwesomeIcon icon={faStopCircle} style={{ marginRight: '4px' }} />
                                Reject
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No result found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="13">
                    <Alert variant="primary">Loading data...</Alert>
                  </td>
                </tr>
              ))} */}
            {type === 'Activities' &&
              subType === 'Activity Types' &&
              (data ? (
                data?.map((type1) => (
                  <tr key={type1} className="admin-panel-rows">
                    <td>
                      <div className="admin-name-img">
                        <div
                          style={{
                            backgroundImage: `url(${global.config.resourceUrl + type1.image})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                          }}
                          className="image-size"
                        ></div>
                        <Link className="admin-name">{type1.title}</Link>
                      </div>
                    </td>
                    <td>{type1.order}</td>
                    <td>
                      <div className="admin-panel-dropdown">
                        <div className="admin-description2 ">
                          {type1.activityItems.map((item) => (
                            <div>{item.title + ','}</div>
                          ))}
                        </div>
                        <div>
                          <AdminDropdown type={type} type1={type1} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <Alert variant="warning">No activity type found</Alert>
              ))}
            {type === 'Activities' &&
              subType === 'Activity Items' &&
              (data?.data ? (
                data?.data?.length > 0 ? (
                  data?.data.map((item) => (
                    <tr key={item} className="admin-panel-rows">
                      <td>
                        <div className="admin-name-img">
                          <div
                            style={{
                              backgroundImage: `url(${global.config.resourceUrl + item.image})`,
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: 'contain',
                            }}
                            className="image-size"
                          ></div>

                          <Link className="admin-name"> {item.title}</Link>
                        </div>
                      </td>
                      <td>{item.order}</td>
                      <td>
                        <div className="admin-panel-dropdown">
                          <div className="">
                            <div className="d-flex">
                              <h6 className="m-0 admin-mata-heading">Activity Type:</h6>
                              <span>{item?.activityType?.title}</span>
                            </div>
                            <div className="d-flex">
                              <h6 className="m-0 admin-mata-heading">Item Type:</h6>
                              <span>{item.type}</span>
                            </div>
                            <div className="d-flex">
                              <h6 className="m-0 admin-mata-heading">Activity Item Value:</h6>
                              <span>{item.h5pLib}</span>
                            </div>
                          </div>

                          <div>
                            <AdminDropdown type1={item} type={type} subType={subType} />
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <div className="links">
                          <Link
                            onClick={() => {
                              dispatch(selectActivityItem(item));
                              dispatch(setActiveAdminForm('edit_activity_item'));
                            }}
                          >
                            &nbsp;&nbsp;Edit&nbsp;&nbsp;
                          </Link>
                          <Link
                            onClick={() => {
                              Swal.fire({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#084892',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes, delete it!',
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  Swal.showLoading();
                                  const resultDel = await dispatch(deleteActivityItem(item.id));
                                  if (resultDel) {
                                    Swal.fire({
                                      text: 'You have successfully deleted the activity item',
                                      icon: 'success',
                                      showCancelButton: false,
                                      confirmButtonColor: '#084892',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'OK',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        dispatch(getActivityItems('', 1));
                                      }
                                    });
                                  }
                                }
                              });
                            }}
                          >
                            Delete
                          </Link>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <Alert variant="warning"> No activity item found</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="5">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}

            {type === 'DefaultSso' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData?.map((row) => (
                    <tr key={row} className="admin-panel-rows">
                      <td>{row?.site_name}</td>
                      <td>{row.lms_url}</td>
                      <td>{row.lms_name}</td>
                      <td>{row.lti_client_id}</td>
                      <td>
                        <div className="admin-panel-dropdown">
                          <div>{row?.description}</div>
                          <div>
                            <AdminDropdown type={type} row={row} activePage={activePage} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No Default SSO integration found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="11">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
            {type === 'LMS' &&
              subType === 'LTI Tools' &&
              (localStateData ? (
                localStateData?.length > 0 ? (
                  localStateData?.map((row) => (
                    <tr key={row} className="admin-panel-rows">
                      <td>{row.tool_name}</td>
                      <td>{row.tool_url}</td>
                      <td>{row.tool_description}</td>
                      <td>
                        <div className="admin-panel-dropdown">
                          {row.lti_version}
                          <div>
                            <AdminDropdown type={type} subType="LTI Tools" row={row} activePage={activePage} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">
                      <Alert variant="warning">No LTI Tool found.</Alert>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="11">
                    <Alert variant="primary">Loading...</Alert>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {((data?.data?.length > 0 && data?.meta) || (localOrganizationList?.data?.length > 0 && localOrganizationList?.meta)) && (
        <AdminPagination
          setCurrentTab={setCurrentTab}
          subType={subType}
          subTypeState={subTypeState}
          type={type}
          data={data}
          activePage={activePage}
          setActivePage={setActivePage}
          updatePageNumber={updatePageNumber}
          localstatePagination={localstatePagination}
        />
      )}
    </div>
  );
}

Table.propTypes = {
  headers: PropTypes.array,
  data: PropTypes.object,
};

export default withRouter(Table);
