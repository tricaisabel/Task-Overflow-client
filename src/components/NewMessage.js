import TextField from '@mui/material/TextField';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import { Button } from '@mui/material';
import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';


export default function NewMessage(props){
    let user=useSelector((state)=>state.user);
    const [open,setOpen]=useState(false);
    const [message,setMessage]=useState({
        title:"",
        content:"",
        sender:user.firstName+" "+user.lastName,
        time:new Date(),
        color:user.color,
        parentId:props.parent
    });

    function changeState(field,value){
        let newState={...message};
        newState[field]=value;
        setMessage(newState);
    }

    async function handleSubmit(){
        const response = await fetch(`http://localhost:3001/api/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
        });
        if (response.status === 200) {
            props.getMessages();
            changeState("title","");
            changeState("content","");
        }
        else{
            alert("Unfortunately something went wrong. Try again.");
        }
    }

    return(
        <>
        <Button 
            style={{maxWidth:"150px"}}
             startIcon={<Add />} 
            onClick={()=>setOpen(!open)}>
            New {props.type}
        </Button>
        {open &&
        <Stack spacing={2} width="1">
            <TextField 
                label="Title" 
                variant="outlined"
                rows={4}
                width="100%"
                value={message.title}
                onChange={(e) =>changeState("title",e.target.value)}/>
            <TextField 
                label={props.type}
                variant="outlined"
                multiline 
                rows={4}
                width="100%"
                value={message.content}
                onChange={(e) =>changeState("content",e.target.value)}/>
            <Button style={{maxWidth:"150px"}} onClick={handleSubmit} variant="contained">Send {props.type}</Button>

        </Stack>
        }
        </>
    );
}