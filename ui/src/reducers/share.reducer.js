import producer from "immer";
import {
  SHARE_REQUEST,
  SHARE_FAILURE,
  OPEN_SHARE_MODAL,
  CLOSE_SHARE_MODAL,
  SHARE_SUCCESS,
  REMOVE_REQUEST,
  REMOVE_SUCCESS,
  REMOVE_FAILURE
} from "../actions/share.actions";

const initialState = {
  fileKey: null,
  isModalOpen: false,
  isSharedSuccess: false,
  isLoading: false,
  error: null
};

const reducer = (state = initialState, action) => {
  return producer(state, draft => {
    switch (action.type) {
      case OPEN_SHARE_MODAL:
        draft.isModalOpen = true;
        draft.fileKey = action.fileKey;
        break;
      case CLOSE_SHARE_MODAL:
        draft.isModalOpen = false;
        break;
      case SHARE_REQUEST:
      case REMOVE_REQUEST:
        draft.isLoading = true;
        break;
      case SHARE_SUCCESS:
      case REMOVE_SUCCESS:
        draft.isLoading = false;
        draft.isSharedSuccess = action.success;
        break;
      case SHARE_FAILURE:
      case REMOVE_FAILURE:
        draft.isLoading = false;
        draft.error = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
