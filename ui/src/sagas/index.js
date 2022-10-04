
import {
  fork,
  all
} from 'redux-saga/effects';
import watchAuthActions from './authentication.saga';
import watchFilesActions from './files.saga';
import watchUsersActions from './users.saga';
import watchTransferOwnerActions from './transferOwner.saga';
import shareActions from './share.saga';
import attestActions from './attest.saga';

const rootSaga = function* () {
  yield all([
    fork(watchAuthActions),
    fork(watchFilesActions),
    fork(watchUsersActions),
    fork(watchTransferOwnerActions),
    fork(shareActions),
    fork(attestActions)
  ])
}

export default rootSaga