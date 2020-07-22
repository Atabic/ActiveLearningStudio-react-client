import axios from 'axios';
import {
  SHOW_CREATE_RESOURCE_MODAL,
  HIDE_CREATE_RESOURCE_MODAL,
  SHOW_RESOURCE_ACTIVITY_TYPE,
  SHOW_RESOURCE_SELECT_ACTIVITY,
  SHOW_RESOURCE_ACTIVITY_BUILD,
  CREATE_RESOURCE,
  PREVIEW_RESOURCE,
  HIDE_PREVIEW_PLAYLIST_MODAL,
  LOAD_RESOURCE,
  DELETE_RESOURCE,
  SHOW_RESOURCE_DESCRIBE_ACTIVITY,
  SELECT_ACTIVITY_TYPE,
  SELECT_ACTIVITY,
  DESCRIBE_ACTIVITY,
  UPLOAD_RESOURCE_THUMBNAIL,
  EDIT_RESOURCE,
  RESOURCE_VALIDATION_ERRORS,
  RESOURCE_THUMBNAIL_PROGRESS,
  HIDE_RESOURCE_ACTIVITY_BUILD,
  SAVE_GENERIC_RESOURCE,
} from '../actionTypes';

export const saveGenericResource = () => ({
  type: SAVE_GENERIC_RESOURCE,
});

export const hideCreateResourceModal = () => ({
  type: HIDE_CREATE_RESOURCE_MODAL,
});

export const saveGenericResourceAction = (resourceData) => async (dispatch) => {
  const { token } = JSON.parse(localStorage.getItem('auth'));
  const response = await axios.post(
    `${global.config.laravelAPIUrl}/activity`,
    resourceData,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (response.data.status === 'success') {
    dispatch(saveGenericResource());
    dispatch(hideCreateResourceModal());
  }
};

export const loadResource = (resource, previous, next) => ({
  type: LOAD_RESOURCE,
  resource,
  previousResourceId: previous,
  nextResourceId: next,
});

// Returns the requested resource along the next and previous one in the playlist
export const loadResourceAction = (resourceId) => async (dispatch) => {
  const { token } = JSON.parse(localStorage.getItem('auth'));
  const response = await axios.post(
    '/api/load-resource',
    { resourceId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (response.data.status === 'success') {
    const { data } = response.data;
    dispatch(
      loadResource(
        data.resource,
        data.previousResourceId,
        data.nextResourceId,
      ),
    );
  }
};

export const showCreateResourceModal = (id) => ({
  type: SHOW_CREATE_RESOURCE_MODAL,
  id,
});

export const showCreateResourceModalAction = (id) => async (dispatch) => {
  try {
    dispatch(showCreateResourceModal(id));
  } catch (e) {
    throw new Error(e);
  }
};

export const hideCreateResourceModalAction = () => async (dispatch) => {
  try {
    dispatch(hideCreateResourceModal());
  } catch (e) {
    throw new Error(e);
  }
};

export const showCreateResourceActivity = () => ({
  type: SHOW_RESOURCE_ACTIVITY_TYPE,
});

export const showCreateResourceActivityAction = () => async (dispatch) => {
  try {
    dispatch(showCreateResourceActivity());
  } catch (e) {
    throw new Error(e);
  }
};

export const showSelectActivity = (activityType) => ({
  type: SHOW_RESOURCE_SELECT_ACTIVITY,
  activityType,
});

export const showSelectActivityAction = (activityType) => async (dispatch) => {
  try {
    dispatch(showSelectActivity(activityType));
  } catch (e) {
    throw new Error(e);
  }
};

export const showBuildActivity = (editor, editorType, params) => ({
  type: SHOW_RESOURCE_ACTIVITY_BUILD,
  editor,
  editorType,
  params,
});

export const hideBuildActivity = () => ({
  type: HIDE_RESOURCE_ACTIVITY_BUILD,
});

export const showBuildActivityAction = (
  editor = null,
  editorType = null,
  activityId = null,
) => async (dispatch) => {
  try {
    if (activityId) {
      const response = await axios.get(
        `${global.config.laravelAPIUrl}/activity/${activityId}`,
      );

      const { data } = response.data;
      const lib = `${data.library_name} ${data.major_version}.${data.minor_version}`;

      dispatch(showBuildActivity(lib, data.type, data.h5p));
    } else {
      dispatch(showBuildActivity(editor, editorType, ''));
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const showDescribeActivity = (activity, metadata = null) => ({
  type: SHOW_RESOURCE_DESCRIBE_ACTIVITY,
  activity,
  metadata,
});

export const showDescribeActivityAction = (activity, activityId = null) => async (dispatch) => {
  try {
    if (activityId) {
      const response = await axios.get(
        `${global.config.laravelAPIUrl}/activity/${activityId}`,
      );
      let metadata = {
        title: '',
        subjectId: '',
        educationLevelId: '',
      };
      if (response.data.data.metadata != null) {
        metadata = response.data.data.metadata;
      }
      dispatch(showDescribeActivity(activity, metadata));
    } else {
      dispatch(showDescribeActivity(activity));
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const editResource = (playlistId, resource, editor, editorType) => ({
  type: EDIT_RESOURCE,
  playlistId,
  resource,
  editor,
  editorType,
});

export const editResourceAction = (
  playlistId,
  editor,
  editorType,
  activityId,
  metadata,
) => async (dispatch) => {
  try {
    const { token } = JSON.parse(localStorage.getItem('auth'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // h5peditorCopy to be taken from h5papi/storage/h5p/laravel-h5p/js/laravel-h5p.js
    const data = {
      library: window.h5peditorCopy.getLibrary(),
      parameters: JSON.stringify(window.h5peditorCopy.getParams()),
      action: 'create',
    };

    const response = await axios.put(
      `${global.config.laravelAPIUrl}/activity/${activityId}`,
      {
        playlistId,
        metadata,
        action: 'create',
        data,
      },
      {
        headers,
      },
    );

    const resource = {};
    resource.id = response.data.data._id;

    dispatch(editResource(playlistId, resource, editor, editorType));
  } catch (e) {
    throw new Error(e);
  }
};

export const validationErrorsResource = () => ({
  type: RESOURCE_VALIDATION_ERRORS,
});

export const createResource = (playlistId, resource, editor, editorType) => ({
  type: CREATE_RESOURCE,
  playlistId,
  resource,
  editor,
  editorType,
});

export const createResourceAction = (
  playlistId,
  editor,
  editorType,
  metadata,
) => async (dispatch) => {
  try {
    const { token } = JSON.parse(localStorage.getItem('auth'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // h5peditorCopy to be taken from h5papi/storage/h5p/laravel-h5p/js/laravel-h5p.js
    const data = {
      playlistId,
      library: window.h5peditorCopy.getLibrary(),
      parameters: JSON.stringify(window.h5peditorCopy.getParams()),
      action: 'create',
    };

    const insertedH5pResource = await axios.post(
      `${global.config.h5pAjaxUrl}/api/h5p/?api_token=test`,
      data,
      {
        headers,
      },
    );

    if (!insertedH5pResource.data.fail) {
      const resource = insertedH5pResource.data;

      // insert into mongodb
      const insertedResource = await axios.post(
        `${global.config.laravelAPIUrl}/activity`,
        {
          mysqlId: resource.id,
          playlistId,
          metadata,
          action: 'create',
        },
        {
          headers,
        },
      );

      resource.id = insertedResource.data.data._id;
      resource.mysqlId = insertedResource.data.data.mysqlId;

      dispatch(createResource(playlistId, resource, editor, editorType));
    } else {
      dispatch(validationErrorsResource());
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const createResourceByH5PUploadAction = (
  playlistId,
  editor,
  editorType,
  payload,
  metadata,
) => async (dispatch) => {
  try {
    const { token } = JSON.parse(localStorage.getItem('auth'));
    const formData = new FormData();
    formData.append('h5p_file', payload.h5pFile);
    formData.append('action', 'upload');
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const responseUpload = await axios.post(
      `${global.config.h5pAjaxUrl}/api/h5p`,
      formData,
      config,
    );

    const dataUpload = { ...responseUpload.data };
    if (dataUpload instanceof Object && 'id' in dataUpload) {
      // insert into mongodb
      const responseActivity = await axios.post(
        `${global.config.laravelAPIUrl}/activity`,
        {
          mysqlId: dataUpload.id,
          playlistId,
          metadata,
          action: 'create',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const resource = { ...responseActivity.data.data };
      resource.id = responseActivity.data.data._id;
      resource.mysqlId = responseActivity.data.data.mysqlId;

      dispatch(createResource(playlistId, resource, editor, editorType));
    } else {
      throw new Error();
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const previewResource = (id) => ({
  type: PREVIEW_RESOURCE,
  id,
});

export const previewResourceAction = (id) => async (dispatch) => {
  try {
    dispatch(previewResource(id));
  } catch (e) {
    throw new Error(e);
  }
};

export const hidePreviewResourceModal = () => ({
  type: HIDE_PREVIEW_PLAYLIST_MODAL,
});

export const hidePreviewResourceModalAction = () => async (dispatch) => {
  try {
    dispatch(hidePreviewResourceModal());
  } catch (e) {
    throw new Error(e);
  }
};

// runs delete resource ajax
export const deleteResource = (resourceId) => ({
  type: DELETE_RESOURCE,
  resourceId,
});

export const deleteResourceAction = (resourceId) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `/api/activity/${resourceId}`,
      { resourceId },
    );

    if (response.data.status === 'success') {
      dispatch(deleteResource(resourceId));
    }
  } catch (e) {
    throw new Error(e);
  }
};

// handles the actions when some activity type is switched inside activity type wizard
export const onChangeActivityType = (activityTypeId) => ({
  type: SELECT_ACTIVITY_TYPE,
  activityTypeId,
});

export const onChangeActivityTypeAction = (activityTypeId) => (dispatch) => {
  try {
    // let activityTypeId = activityTypeId;
    dispatch(onChangeActivityType(activityTypeId));
  } catch (e) {
    throw new Error(e);
  }
};

// handles the actions when some activity switched inside select activity wizard
export const onChangeActivity = (activity) => ({
  type: SELECT_ACTIVITY,
  activity,
});

export const onChangeActivityAction = (activity) => (dispatch) => {
  try {
    dispatch(onChangeActivity(activity));
  } catch (e) {
    console.log(e);
  }
};

// Metadata saving inside state when metadata form is submitted
export const onSubmitDescribeActivity = (metadata, activityId) => ({
  type: DESCRIBE_ACTIVITY,
  metadata,
  activityId,
});

export const onSubmitDescribeActivityAction = (metadata, activityId = null) => (dispatch) => {
  try {
    dispatch(onSubmitDescribeActivity(metadata, activityId));
  } catch (e) {
    console.log(e);
  }
};

// uploads the thumbnail of resource
export const uploadResourceThumbnail = (thumbUrl) => ({
  type: UPLOAD_RESOURCE_THUMBNAIL,
  thumbUrl,
});

export const resourceThumbnailProgress = (progress) => ({
  type: RESOURCE_THUMBNAIL_PROGRESS,
  progress,
});

export const uploadResourceThumbnailAction = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        dispatch(
          resourceThumbnailProgress(
            `Uploaded progress: ${
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            }%`,
          ),
        );
      },
    };

    return axios
      .post(
        `${global.config.laravelAPIUrl}/post-upload-image`,
        formData,
        config,
      )
      .then((response) => {
        dispatch(uploadResourceThumbnail(response.data.data.guid));
      });
  } catch (e) {
    throw new Error(e);
  }
};