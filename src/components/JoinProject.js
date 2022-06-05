import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/material';
import {useState} from 'react';
import { Typography } from '@mui/material';
import {useSelector} from 'react-redux';

export default function JoinProject(props) {
  const [projectId,setProjectId]=useState("");
  const [projectPassword,setProjectPassword]=useState("");
  const [found,setFound]=useState("none");
  const [member,setMember]=useState("none");

  const user=useSelector((state)=>state.user);

  async function updateTeamProject(project,id){
    const response = await fetch(`http://localhost:3001/api/project/${id}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
      });
    if (response.status === 200) {
        document.location.reload();
        props.setOpen(false);
    }
    else{
        alert("not added");
    }
  }

  async function joinProject(){
    const body= { "_id":projectId, "password":projectPassword };
    const response = await fetch(`http://localhost:3001/api/existProject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (response.status === 200) {
        const userData=await response.json();
        const project=userData[0];
        if(project.team.includes(user.firstName+" "+user.lastName)){
          setMember("block");
        }
        project.team=[...project.team,user.firstName+" "+user.lastName];
        const id=project["_id"];
        delete project["_id"];
        delete project["__v"];
        updateTeamProject(project,id);            
    }
    else{
        setFound("block");
    }  
  }

  return (
    <Dialog open={props.open} onClose={(e)=>props.setOpen(false)} fullWidth maxWidth='sm'>
    <DialogTitle>Add a new project</DialogTitle>
    <DialogContent>
        <DialogContentText>

        </DialogContentText>
        <Stack spacing={1} sx={{mt:3}}>
            <TextField 
              label="Project ID" 
              variant="outlined" 
              required 
              autoFocus 
              onChange={(e)=>setProjectId(e.target.value)}/>
            <TextField 
              label="Project Password" 
              variant="outlined" 
              required 
              type="password"
              onChange={(e)=>setProjectPassword(e.target.value)}/>
            <Typography variant="body2" color="red" display={found}>Project name or password is incorrect</Typography>
            <Typography variant="body2" color="red" display={member}>You already are a part of this project</Typography>
        </Stack>
        
    </DialogContent>
    <DialogActions>
        <Button onClick={(e)=>props.setOpen(false)}>Cancel</Button>
        <Button onClick={joinProject} variant="contained" size="large">Submit</Button>
    </DialogActions>
    </Dialog>
    
  );
}
