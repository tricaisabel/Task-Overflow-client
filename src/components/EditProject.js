import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import {useSelector} from 'react-redux';
import MembersAuto from './MembersAuto';

export default function EditProject(props) {
    let user=useSelector((state)=>state.user);
    const [team, setTeam]=useState(props.edit.team);
    const [date,setDate]=useState(props.edit.deadline);
    const [project, setProject] = useState({
        name:props.edit.name,
        description:props.edit.description,
        password:props.edit.password,
        password2:props.edit.password,
        deadline:props.edit.deadline,
        progress:props.edit.progress,
        manager:{
            name:user.firstName+" "+user.lastName,
            color:user.color,
            job:user.job
        }
    });

    const [error,setError]=useState(false);

    const handleClose = () => {
        props.setEdit("")
    };

    function changeState(field,value){
        let newState={...project};
        newState[field]=value;
        setProject(newState);
    }

    const handleDate = (newDate) => {
        setDate(newDate);
        changeState("deadline",newDate);
    };

    async function saveProject(){
        if(error===false)
        {
            delete project.password2;
            project["team"]=team;
            const response = await fetch(`http://localhost:3001/api/project/${props.edit["_id"]}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
            });
            if (response.status === 200) {
                document.location.reload();
                props.setCreate(false);
                props.setEdit("");
            }
            else{
                alert("Unfortunately something went wrong. Try again.");
            }
        }
        else{
            alert("The 2 project passwords must match.");
        }
    }

    function handleSubmit(){
        saveProject();
    }

  return (
    <div>
      <Dialog open={props.edit!==""} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Edit Project - {props.edit.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{mt:3}}>
            <TextField 
                label="Project name" 
                variant="outlined" 
                required 
                autoFocus
                defaultValue={props.edit.name}
                onChange={(e) =>changeState("name",e.target.value)}/>
            <TextField 
                label="Project Password" 
                variant="outlined" 
                required 
                type="password"
                error={error}
                helperText="Passwords must match"
                defaultValue={props.edit.password}
                onChange={(e) =>{
                            changeState("password",e.target.value);
                            setError(project.password2!==e.target.value);
                        }
                    }/>
            <TextField 
                label="Repeat Password" 
                variant="outlined" 
                required 
                type="password"
                error={error}
                helperText="Passwords must match"
                defaultValue={props.edit.password}
                onChange={(e) =>{
                            changeState("password2",e.target.value);
                            setError(project.password!==e.target.value);
                        }
                    }/>
            <TextField 
                label="Enter a suggestive description for your new project" 
                variant="outlined" 
                required 
                multiline 
                rows={4}
                defaultValue={props.edit.description}
                onChange={(e) =>changeState("description",e.target.value)}/>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <DateTimePicker
                    label="Project deadline"
                    value={date}
                    onChange={handleDate}
                    renderInput={(params) => <TextField {...params} />}
                    minDateTime={new Date()}
                    />
            </LocalizationProvider>
            <MembersAuto setValue={setTeam} multiple={true} title="Project Members" team={props.edit.team}/>
        </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e)=>props.setEdit("")}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" size="large">Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
