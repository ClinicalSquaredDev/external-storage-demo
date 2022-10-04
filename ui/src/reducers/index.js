import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import authReducer from './authentication.reducer';
import filesReducer from './files.reducer';
import usersReducer from './users.reducers';
import transferOwnerReducer from './transferOwner.reducer';
import shareReducer from './share.reducer';
import attestReducer from './attest.reducer';
import userMessageReducer from './userMessage.reducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  authentication: authReducer,
  files: filesReducer,
  users: usersReducer,
  transferOwner: transferOwnerReducer,
  share: shareReducer,
  attest: attestReducer,
  userMessage: userMessageReducer,
});