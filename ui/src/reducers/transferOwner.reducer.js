import producer from "immer";
import {
  OPEN_TRANSFER_OWNER_MODAL,
  CLOSE_TRANSFER_OWNER_MODAL,
  TRANSFER_OWNER_SUCCESS,
  TRANSFER_OWNER_FAILURE,
  TRANSFER_OWNER_REQUEST
} from "../actions/transferOwner.actions";

const initialState = {
  fileKey: null,
  isModalOpen: false,
  isOwnerTransferred: false,
  isLoading: false,
  error: null
};

const reducer = (state = initialState, action) => {
  return producer(state, draft => {
    switch (action.type) {
      case OPEN_TRANSFER_OWNER_MODAL:
        draft.isModalOpen = true;
        draft.fileKey = action.fileKey;
        break;
      case CLOSE_TRANSFER_OWNER_MODAL:
        draft.isModalOpen = false;
        break;
      case TRANSFER_OWNER_REQUEST:
        draft.isLoading = true;
        break;
      case TRANSFER_OWNER_SUCCESS:
        draft.isLoading = false;
        draft.isOwnerTransferred = action.success;
        break;
      case TRANSFER_OWNER_FAILURE:
        draft.isLoading = false;
        draft.error = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
