export const OPEN_UPLOAD_MODAL = "OPEN_UPLOAD_MODAL";
export const CLOSE_UPLOAD_MODAL = "CLOSE_UPLOAD_MODAL";
export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_FILE_FAILURE = "UPLOAD_FILE_FAILURE";
export const GET_FILES_REQUEST = "GET_FILES_REQUEST";
export const GET_FILES_SUCCESS = "GET_FILES_SUCCESS";
export const GET_FILES_FAILURE = "GET_FILES_FAILURE";
export const GET_FILE_META_REQUEST = "GET_FILE_META_REQUEST";
export const GET_FILE_META_SUCCESS = "GET_FILE_META_SUCCESS";
export const GET_FILE_META_FAILURE = "GET_FILE_META_FAILURE";
export const SET_SELECTED_FILE = "SET_SELECTED_FILE";
export const REMOVE_SELECTED_FILE = "REMOVE_SELECTED_FILE";
export const UPLOAD_FILE_VERSION_REQUEST = "UPLOAD_FILE_VERSION_REQUEST";
export const UPLOAD_FILE_VERSION_SUCCESS = "UPLOAD_FILE_VERSION_SUCCESS";
export const UPLOAD_FILE_VERSION_FAILURE = "UPLOAD_FILE_VERSION_FAILURE";

export const openUploadModal = (isVersionUpload = false) => {
  return {
    type: OPEN_UPLOAD_MODAL,
    isVersionUpload
  };
};

export const closeUploadModal = () => {
  return {
    type: CLOSE_UPLOAD_MODAL
  };
};

export const uploadFileRequest = (file, fileDescription, comments) => {
  return {
    type: UPLOAD_FILE_REQUEST,
    file,
    fileDescription,
    comments
  };
};

export const uploadFileSuccess = file => {
  return {
    type: UPLOAD_FILE_SUCCESS,
    file
  };
};

export const uploadFileFailure = error => {
  return {
    type: UPLOAD_FILE_FAILURE,
    error
  };
};

export const getFilesRequest = (limit, offset) => {
  return {
    type: GET_FILES_REQUEST,
    limit,
    offset
  };
};

export const getFilesSuccess = files => {
  return {
    type: GET_FILES_SUCCESS,
    files
  };
};

export const getFilesFailure = () => {
  return {
    type: GET_FILES_FAILURE
  };
};

export const getFileMetaRequest = fileKey => {
  return {
    type: GET_FILE_META_REQUEST,
    fileKey
  };
};

export const getFileMetaSuccess = payload => {
  return {
    type: GET_FILE_META_SUCCESS,
    payload
  };
};

export const getFileMetaFailure = error => {
  return {
    type: GET_FILE_META_FAILURE,
    error
  };
};

export const setFileForUploadModal = file => {
  return {
    type: SET_SELECTED_FILE,
    file
  };
};

export const removeFileForUploadModal = () => {
  return {
    type: REMOVE_SELECTED_FILE
  };
};

export const uploadFileVersionRequest = (fileKey, file, comments) => {
  return {
    type: UPLOAD_FILE_VERSION_REQUEST,
    fileKey,
    file,
    comments
  };
};

export const uploadFileVersionSuccess = versions => {
  return {
    type: UPLOAD_FILE_VERSION_SUCCESS,
    versions
  };
};

export const uploadFileVersionFailure = error => {
  return {
    type: UPLOAD_FILE_VERSION_FAILURE,
    error
  };
};
