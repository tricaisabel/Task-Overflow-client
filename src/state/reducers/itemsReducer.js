let initialState=[];

export default function itemsReducer(state=initialState,action){  
    if(action.type==="addItems"){
        state=action.payload;
        return state; 
    }
    else if(action.type==="noItems"){
        state=initialState;
        return state;
    }
    else{
        return state;
    }
    
    
}
