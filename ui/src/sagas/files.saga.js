import { call, takeLatest, put } from "redux-saga/effects";
import { apiUrl, HTTP_METHODS, PAGINATION } from "../constants";
import {
  GET_FILES_REQUEST,
  getFilesFailure,
  getFilesSuccess,
  UPLOAD_FILE_REQUEST,
  uploadFileSuccess,
  uploadFileFailure,
  GET_FILE_META_REQUEST,
  getFileMetaSuccess,
  getFileMetaFailure,
  closeUploadModal,
  getFilesRequest,
  removeFileForUploadModal,
  UPLOAD_FILE_VERSION_REQUEST,
  uploadFileVersionSuccess,
  uploadFileVersionFailure,
  getFileMetaRequest
} from "../actions/files.actions";
import { setUserMessage } from "../actions/userMessage.actions";

const filesUrl = `${apiUrl}/files`;
const fileMetaUrl = `${apiUrl}/files/:id`;
const uploadVersionUrl = `${apiUrl}/files/:id/versions`;

function fetchFiles(limit, offset) {
  return fetch(`${filesUrl}?limit=${limit}&offset=${offset}`, {
    method: HTTP_METHODS.GET
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      throw err;
    });
}

export function uploadFileApiCall(file, fileDescription, comments) {
  let formData = new FormData();
  formData.append("fileUpload", file);
  formData.append("fileDescription", fileDescription);
  formData.append("comments", comments);

  return fetch(filesUrl, {
    method: HTTP_METHODS.POST,
    body: formData
  })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      throw error;
    });
}

function fileMetaApiCall(fileKey) {
  return fetch(fileMetaUrl.replace(":id", fileKey), {
    method: HTTP_METHODS.GET
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      throw err;
    });
}

function uploadFileVersionAPI(id, file, comments) {
  let formData = new FormData();
  formData.append("fileUpload", file);
  formData.append("comments", comments);

  return fetch(uploadVersionUrl.replace(":id", id), {
    method: HTTP_METHODS.POST,
    body: formData
  })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      throw error;
    });
}

function* filesRequest(action) {
  try {
    const response = yield call(fetchFiles, action.limit, action.offset);
    if (response.success) {
      yield put(getFilesSuccess(response.data));
    } else {
      yield put(getFilesFailure(response.error.loginUrl));
    }
  } catch (err) {
    yield put(getFilesFailure(err));
  }
}

export function* uploadFile(action) {
  try {
    let response = yield call(
      uploadFileApiCall,
      action.file,
      action.fileDescription,
      action.comments
    );
    if (response.success) {
      yield put(uploadFileSuccess(response.data));
      yield put(closeUploadModal());
      yield put(removeFileForUploadModal());
      yield put(setUserMessage("The file has been uploaded", true));
      yield put(getFilesRequest(PAGINATION.LIMIT, PAGINATION.OFFSET));
    } else {
      yield put(setUserMessage("Unable to upload file"));
      yield put(uploadFileFailure(response.error.message));
    }
  } catch (err) {
    yield put(uploadFileFailure(err));
  }
}

export function* fileMeta(action) {
  try {
    let response = yield call(fileMetaApiCall, action.fileKey);

    if (response.success) {
      yield put(getFileMetaSuccess(response.data));
    } else {
      yield put(getFileMetaFailure(response.error.message));
    }
  } catch (err) {
    yield put(getFileMetaFailure(err));
  }
}

function* uploadFileVersion(action) {
  try {
    const response = yield call(
      uploadFileVersionAPI,
      action.fileKey,
      action.file,
      action.comments
    );
    if (response.success) {
      yield put(uploadFileVersionSuccess(response.data));
      yield put(closeUploadModal());
      yield put(setUserMessage("The version has been uploaded", true));
      yield put(getFileMetaRequest(action.fileKey));
    } else {
      yield put(uploadFileVersionFailure(response.error.message));
    }
  } catch (err) {
    yield put(uploadFileVersionFailure(err));
  }
}

export default function*() {
  yield takeLatest(GET_FILES_REQUEST, filesRequest);
  yield takeLatest(UPLOAD_FILE_REQUEST, uploadFile);
  yield takeLatest(GET_FILE_META_REQUEST, fileMeta);
  yield takeLatest(UPLOAD_FILE_VERSION_REQUEST, uploadFileVersion);
}
