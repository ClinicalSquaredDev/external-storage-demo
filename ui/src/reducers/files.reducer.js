import producer from "immer";
import {
  GET_FILES_SUCCESS,
  GET_FILES_FAILURE,
  OPEN_UPLOAD_MODAL,
  CLOSE_UPLOAD_MODAL,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  GET_FILE_META_SUCCESS,
  GET_FILE_META_FAILURE,
  GET_FILES_REQUEST,
  UPLOAD_FILE_REQUEST,
  GET_FILE_META_REQUEST,
  SET_SELECTED_FILE,
  REMOVE_SELECTED_FILE,
  UPLOAD_FILE_VERSION_REQUEST,
  UPLOAD_FILE_VERSION_SUCCESS,
  UPLOAD_FILE_VERSION_FAILURE
} from "../actions/files.actions";

const initialState = {
  files: [],
  downloadUrl: null,
  isUploadModalOpen: false,
  fileMeta: null,
  file: null,
  error: null,
  isLoading: false,
  isFileUploading: false,
  isFileMetaLoading: false,
  selectedFile: null,
  versions: [],
  isUploadVersionLoading: false,
  isVersionUpload: false
};

const reducer = (state = initialState, action) => {
  return producer(state, draft => {
    switch (action.type) {
      case OPEN_UPLOAD_MODAL:
        draft.isUploadModalOpen = true;
        draft.isVersionUpload = action.isVersionUpload;
        break;
      case CLOSE_UPLOAD_MODAL:
        draft.selectedFile = null;
        draft.isUploadModalOpen = false;
        draft.isVersionUpload = false;
        break;
      case UPLOAD_FILE_REQUEST:
        draft.isFileUploading = true;
        break;
      case UPLOAD_FILE_SUCCESS:
        draft.file = action.file;
        draft.isFileUploading = false;
        break;
      case UPLOAD_FILE_FAILURE:
        draft.error = action.error;
        draft.isFileUploading = false;
        break;
      case GET_FILES_REQUEST:
        draft.isLoading = true;
        break;
      case GET_FILES_SUCCESS:
        draft.files = action.files;
        draft.isLoading = false;
        break;
      case GET_FILES_FAILURE:
        draft.files = [];
        draft.isLoading = false;
        break;
      case GET_FILE_META_REQUEST:
        draft.isFileMetaLoading = true;
        draft.fileMeta = null;
        break;
      case GET_FILE_META_SUCCESS:
        draft.isFileMetaLoading = false;
        draft.fileMeta = action.payload;
        break;
      case GET_FILE_META_FAILURE:
        draft.isFileMetaLoading = false;
        draft.error = action.error;
        break;
      case SET_SELECTED_FILE:
        draft.selectedFile = action.file;
        break;
      case REMOVE_SELECTED_FILE:
        draft.selectedFile = null;
        break;
      case UPLOAD_FILE_VERSION_REQUEST:
        draft.isUploadVersionLoading = true;
        break;
      case UPLOAD_FILE_VERSION_SUCCESS:
        draft.versions = action.versions;
        draft.isUploadVersionLoading = false;
        draft.isUploadModalOpen = false;
        draft.isVersionUpload = false;
        break;
      case UPLOAD_FILE_VERSION_FAILURE:
        draft.error = action.error;
        draft.isUploadVersionLoading = false;
        break;
      default:
        break;
    }
  });
};

export default reducer;
