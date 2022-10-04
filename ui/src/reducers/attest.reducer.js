import producer from 'immer'
import {
  OPEN_ATTEST_MODAL,
  CLOSE_ATTEST_MODAL,
  ATTEST_SUCCESS,
  ATTEST_FAILURE,
  ATTEST_REQUEST
} from '../actions/attest.actions'

const initialState = {
  selectedVersion: null,
  fileKey: null,
  isAttestModalOpen: false,
  file: null,
  error: null,
  isAttestLoading: false
}

const reducer = (state = initialState, action) => {
  return producer(state, draft => {
    switch (action.type) {
      case OPEN_ATTEST_MODAL:
        draft.fileKey = action.fileKey
        draft.selectedVersion = action.selectedVersion
        draft.isAttestModalOpen = true
        break
      case CLOSE_ATTEST_MODAL:
        draft.isAttestModalOpen = false
        break
      case ATTEST_REQUEST:
        draft.isAttestLoading = true
        break
      case ATTEST_SUCCESS:
        draft.file = action.file
        draft.isAttestLoading = false
        break
      case ATTEST_FAILURE:
        draft.error = action.error
        draft.isAttestLoading = false
        break
      default:
        break
    }
  })
}

export default reducer