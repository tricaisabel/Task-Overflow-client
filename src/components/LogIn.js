import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import TaskAlt from '@mui/icons-material/TaskAlt';
import {useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';
import {useNavigate} from "react-router-dom";
import {useState} from 'react';

export default function LogIn(){
    const navigate = useNavigate();
    const user=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const {updateUserField}=bindActionCreators(actionCreators,dispatch);
    const [found,setFound]=useState("none");

    async function authUser(){
        const body= { "username":user.username, "password":user.password };
        const response = await fetch(`http://localhost:3001/api/existUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.status === 200) {
            updateUserField("logged",true);
            const userData=await response.json();
            Object.keys(userData[0]).forEach((key)=>{
                updateUserField(key,userData[0][key]);
            })
            console.log(user);
            navigate("/overview");
        }
        else{
            setFound("block");
        }
        
    }

    return(
        <TabPanel value="1">
            <Stack spacing={2}>
                <Stack alignItems="center" spacing={2} sx={{mb:3}}>
                    <TaskAlt color="primary" sx={{ fontSize: 60}} />
                    <Typography variant="h5" sx={{ my: 5}}>Log In</Typography>
                </Stack>
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    required 
                    onChange={(e)=>updateUserField("username",e.target.value)}/>
                <TextField 
                    label="Password" 
                    variant="outlined" 
                    required type="password" 
                    onChange={(e)=>updateUserField("password",e.target.value)}/>
                <Typography variant="body2" color="red" display={found}>Username or password is incorrect</Typography>
                <Button 
                    variant="contained" 
                    onClick={authUser}>
                    LOG In
                </Button>
            </Stack>
        </TabPanel>
    )
}