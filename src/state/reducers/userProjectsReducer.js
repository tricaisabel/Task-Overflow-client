let initialState=[];

export default function userProjectsReducer(state=initialState,action){  
    if(action.type==="addProjects"){
        state=action.payload;
        return state; 
    }
    else if(action.type==="noProjects"){
        state=initialState;
        return state;
    }
    else{
        return state;
    }
    
    
}
