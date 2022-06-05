let fields=["_id","name","description","deadline","progress","password"];
let initialState={
    "manager":{
        "name":"",
        "color":"",
        "job":""
    },
    "team":[]
};
fields.forEach(field=>initialState[field]="");

function changeState(state,field,value){
    let newState={...state};
    newState[field]=value;
    return newState;
}

export default function projectReducer(state=initialState,action){ 
    if(action.type==="updateProjectField"){
        state=changeState(state,action.field,action.value);
        return state; 
    }
    else if(action.type==="updateProject"){
        state=action.payload;
        return state;
    }
    else{
        return state;
    }
    
    
}
