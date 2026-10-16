import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_MEMBER } from '../../data/initialData';

const getSavedMember = () => {
  try {
    const saved = localStorage.getItem('lib_redux_member');
    return saved ? JSON.parse(saved) : INITIAL_MEMBER;
  } catch {
    return INITIAL_MEMBER;
  }
};

const initialState = {
  memberInfo: getSavedMember()
};

export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    updateMemberProfile: (state, action) => {
      state.memberInfo = { ...state.memberInfo, ...action.payload };
    },
    setMemberInfo: (state, action) => {
      state.memberInfo = action.payload;
    }
  }
});

export const { updateMemberProfile, setMemberInfo } = memberSlice.actions;

export const selectMemberInfo = (state) => state.member.memberInfo;

export default memberSlice.reducer;
