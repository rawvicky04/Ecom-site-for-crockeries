import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: [],
}

export const cartProductSlice = createSlice({
    name: 'cartProduct',
    initialState,
    reducers:{
        cart:(state, action) => {
            state.product.push(action.payload)
        },
    },
})

export const { cart } = cartProductSlice.actions

export default cartProductSlice.reducer