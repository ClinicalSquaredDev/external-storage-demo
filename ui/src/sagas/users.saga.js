import { call, takeLatest, put } from "redux-saga/effects";
import { apiUrl, HTTP_METHODS } from "../constants";
import { GET_USERS_REQUEST, getUsersSuccess, getUsersFailure } from "../actions/users.actions";

const usersUrl = `${apiUrl}/users`;

function fetchUsers() {
  return fetch(usersUrl, { method: HTTP_METHODS.GET })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      throw err;
    });
}

function* getUsers() {
  try {
    const response = yield call(fetchUsers);
    if (response.success) {
      yield put(getUsersSuccess(response.data));
    } else {
      yield put(getUsersFailure(response.error.message));
    }
  } catch (err) {
    yield put(getUsersFailure(err));
  }
}

export default function* () {
  yield takeLatest(GET_USERS_REQUEST, getUsers);
}
