import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography } from '@mui/material';
import InputColor from 'react-input-color';
import {useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';

export default function EditProfile(props) {
    const [color, setColor] = React.useState({});
    const user=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const {updateUserField}=bindActionCreators(actionCreators,dispatch);
    const [newUser, setNewUser] = React.useState({
        username:user.username,
        password:user.password,
        role:user.role,
        job:user.job,
        firstName:user.firstName,
        lastName:user.lastName,
        color:user.color
    });

    const handleClose = () => {
        props.setEdit(false);
    };

    function changeState(field,value){
        let newState={...newUser};
        newState[field]=value;
        setNewUser(newState);
    }

    async function saveProject(){
        newUser.color=color.hex;
        console.log(user);
        const response = await fetch(`http://localhost:3001/api/user/${user["_id"]}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
        });
        if (response.status === 200) {
            Object.keys(newUser).forEach((key)=>{
                updateUserField(key,newUser[key]);
            })
            alert("saved");
        }
        else{
            alert("not saved");
        }
    }
    

    function handleSubmit(){
        saveProject();
        props.setEdit(false);
    }

  return (
    <div>
      <Dialog open={props.edit} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Edit Current User - {user.firstName+" "+user.lastName}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{mt:3}}>
            <TextField 
                label="Username" 
                variant="outlined" 
                required 
                autoFocus
                defaultValue={user.username}
                onChange={(e) =>changeState("username",e.target.value)}/>
            <TextField 
                label="Job" 
                variant="outlined" 
                required 
                autoFocus
                defaultValue={user.job}
                onChange={(e) =>changeState("job",e.target.value)}/>
            <TextField 
                label="First Name" 
                variant="outlined" 
                required 
                autoFocus
                defaultValue={user.firstName}
                onChange={(e) =>changeState("firstName",e.target.value)}/>
            <TextField 
                label="Last Name" 
                variant="outlined" 
                required 
                autoFocus
                defaultValue={user.lastName}
                onChange={(e) =>changeState("lastName",e.target.value)}/>
            <TextField 
                label="Password" 
                variant="outlined" 
                required 
                type="password"
                defaultValue={user.password}
                onChange={(e) =>changeState("password",e.target.value)}/>
            <Typography variant="body">Change profile color</Typography>
            <InputColor
                initialValue={user.color}
                onChange={setColor}
                placement="right"
            />         
        </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e)=>props.setEdit(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" size="large">Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
