let fields=["logged","_id","username","firstName","lastName","password","job","role","color","tab"];
let initialState={"logged":false,"tab":1};
fields.forEach(field=>initialState[field]="");

function changeState(state,field,value){
    let newState={...state};
    newState[field]=value;
    return newState;
}

export default function userReducer(state=initialState,action){   
    if(action.type==="updateUserField" && fields.includes(action.field)){
        state=changeState(state,action.field,action.value);
        return state; 
    }
    else if(action.type==="initialState"){
        state=initialState;
        return state;
    }
    else{
        return state;
    }
    
    
}
