import { call, takeLatest, put } from "redux-saga/effects";
import { apiUrl, HTTP_METHODS } from "../constants";
import {
  ATTEST_REQUEST,
  attestFailure,
  attestSuccess,
  closeAttestModal
} from "../actions/attest.actions";
import { setUserMessage } from "../actions/userMessage.actions";
import { getFileMetaRequest } from "../actions/files.actions";

const attestUrl = `${apiUrl}/files/:id/versions/:version/attest `;

export function attestFileApiCall(id, version, file) {
  let formData = new FormData();
  formData.append("fileUpload", file);

  return fetch(attestUrl.replace(":id", id).replace(':version', version), {
    method: HTTP_METHODS.POST,
    body: formData
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      throw error;
    });
}

export function* attestFile(action) {
  try {
    let response = yield call(attestFileApiCall, action.fileKey, action.version, action.file);

    if (response.success) {
      yield put(attestSuccess(response));
      yield put(closeAttestModal());
      yield put(setUserMessage("The file has been verified", true));
      yield put(getFileMetaRequest(action.fileKey));
    } else {
      yield put(attestFailure(response.error));
      yield put(setUserMessage("Unable to verify file"));
    }
  } catch (err) {
    yield put(attestFailure(err));
  }
}

export default function* () {
  yield takeLatest(ATTEST_REQUEST, attestFile);
}
