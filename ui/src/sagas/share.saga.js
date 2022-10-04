import { call, takeLatest, put } from "redux-saga/effects";
import { apiUrl, HTTP_METHODS } from "../constants";
import {
  SHARE_REQUEST,
  shareSuccess,
  shareFailure,
  closeShareModal,
  REMOVE_REQUEST
} from "../actions/share.actions";
import { setUserMessage } from "../actions/userMessage.actions";
import { getFileMetaRequest } from "../actions/files.actions";

const shareUrl = `${apiUrl}/files/:id/members`;
const removeUrl = `${apiUrl}/files/:id/members`;

export function shareCall(fileKey, member) {
  return fetch(shareUrl.replace(":id", fileKey), {
    method: HTTP_METHODS.POST,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ member })
  })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      throw error;
    });
}

export function removeCall(fileKey, member) {
  return fetch(removeUrl.replace(":id", fileKey), {
    method: HTTP_METHODS.DELETE,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ member })
  })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      throw error;
    });
}

export function* share(action) {
  try {
    let response = yield call(shareCall, action.fileKey, action.member);

    if (response.success) {
      yield put(shareSuccess(response.data));
      yield put(setUserMessage("Member added", true));
      yield put(closeShareModal());
      yield put(getFileMetaRequest(action.fileKey));
    } else {
      yield put(shareFailure(response.error.message));
      yield put(setUserMessage("Unable to add member"));
    }
  } catch (err) {
    yield put(shareFailure(err));
  }
}

export function* remove(action) {
  try {
    let response = yield call(removeCall, action.fileKey, action.member);

    if (response.success) {
      yield put(shareSuccess(response.data));
      yield put(setUserMessage("Member removed", true));
      yield put(closeShareModal());
      yield put(getFileMetaRequest(action.fileKey));
    } else {
      yield put(shareFailure(response.error.message));
      yield put(setUserMessage("Unable to remove member"));
    }
  } catch (err) {
    yield put(shareFailure(err));
  }
}

export default function*() {
  yield takeLatest(SHARE_REQUEST, share);
  yield takeLatest(REMOVE_REQUEST, remove);
}
