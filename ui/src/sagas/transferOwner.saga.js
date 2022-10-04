import { call, takeLatest, put } from "redux-saga/effects";
import { apiUrl, HTTP_METHODS } from "../constants";
import {
  TRANSFER_OWNER_REQUEST,
  transferOwnerSuccess,
  transferOwnerFailure,
  closeTransferOwnerModal
} from "../actions/transferOwner.actions";
import { setUserMessage } from "../actions/userMessage.actions";
import { getFileMetaRequest } from "../actions/files.actions";

const transferUrl = `${apiUrl}/files/:id/transfer`;

export function transferOwnerCall(fileKey, member) {
  return fetch(transferUrl.replace(":id", fileKey), {
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

export function* transferOwner(action) {
  try {
    let response = yield call(transferOwnerCall, action.fileKey, action.member);

    if (response.success) {
      yield put(transferOwnerSuccess(response.data));
      yield put(setUserMessage("File ownership has been transferred", true));
      yield put(closeTransferOwnerModal());
      yield put(getFileMetaRequest(action.fileKey));
    } else {
      yield put(transferOwnerFailure(response.error.message));
      yield put(setUserMessage("Unable to transfer file ownership"));
    }
  } catch (err) {
    yield put(transferOwnerFailure(err));
  }
}

export default function*() {
  yield takeLatest(TRANSFER_OWNER_REQUEST, transferOwner);
}
