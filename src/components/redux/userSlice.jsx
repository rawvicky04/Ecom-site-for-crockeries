import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    surname: "",
    email: "",
    accessToken: "",
    uid: "",

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        userName: (state, action) => {
            state.name = action.payload.first_name;
            state.surname = action.payload.last_name;
            state.email = action.payload.email;
            state.accessToken = action.payload.accessToken;
            state.uid = action.payload.uid
        },
        userLogout: (state) => {
            state.name = "";
            state.surname = "";
            state.email = "";
            state.accessToken = "";
            state.uid = ""
        }
    }
})

export const { userName, userLogout } = userSlice.actions;
export default userSlice.reducer;