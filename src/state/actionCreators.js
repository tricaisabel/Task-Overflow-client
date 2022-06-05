export const updateUserField=(field,value)=>{
    return(dispatch)=>{
        dispatch({
            type:"updateUserField",
            field:field,
            value:value
        })
    }
}
export const updateProjectField=(field,value)=>{
    return(dispatch)=>{
        dispatch({
            type:"updateProjectField",
            field:field,
            value:value
        })
    }
}
export const updateUser=(user)=>{
    return(dispatch)=>{
        dispatch({
            type:"updateUser",
            payload:user
        })
    }
}
export const updateProject=(project)=>{
    return(dispatch)=>{
        dispatch({
            type:"updateProject",
            payload:project
        })
    }
}
export const addProjects=(projects)=>{
    return(dispatch)=>{
        dispatch({
            type:"addProjects",
            payload:projects
        })
    }
}
export const addItems=(items)=>{
    return(dispatch)=>{
        dispatch({
            type:"addItems",
            payload:items
        })
    }
}

export const noProjects=()=>{
    return(dispatch)=>{
        dispatch({
            type:"noProjects"
        })
    }
}
