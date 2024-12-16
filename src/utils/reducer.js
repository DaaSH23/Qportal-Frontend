// State logic 

const reducer = ( state, action) => {
    switch (action.type){
        case "SET_STATE":
            return{
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
                _id: action.payload._id,
                role: action.payload.role,
                name: action.payload.name,
            };
        case "RESET_STATE":
            return action.payload;
        default:
            return state;
    }
};

export default reducer;