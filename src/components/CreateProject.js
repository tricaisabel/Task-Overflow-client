import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import {useSelector} from 'react-redux';
import MembersAuto from './MembersAuto';

export default function CreateProject(props) {
    
    let user=useSelector((state)=>state.user);
    const [team, setTeam]=useState([]);
    const [date,setDate]=useState(new Date());
    const [project, setProject] = useState({
        name:"",
        description:"",
        password:"",
        password2:"",
        deadline:"",
        progress:0,
        manager:{
            name:user.firstName+" "+user.lastName,
            color:user.color,
            job:user.job
        }
    });

    const [error,setError]=useState(false);

    async function addProject(){
        if(error===false)
        {
            delete project.password2;
            team.push(user.firstName+" "+user.lastName);
            project["team"]=team;
            const response = await fetch(`http://localhost:3001/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
            });
            if (response.status === 200) {
                document.location.reload();
                props.setCreate(false);
                alert("The new project was successfully added");
            }
            else{
                alert("Unfortunately something went wrong. Try again.");
            }
        }
        else{
            alert("The 2 project passwords must match.");
        }
    }
    
    function changeState(field,value){
        let newState={...project};
        newState[field]=value;
        setProject(newState);
    }

    const handleDate = (newDate) => {
        let ISODate=newDate.toISOString();
        ISODate=ISODate.slice(0,ISODate.indexOf("T"))
        setDate(newDate);
        changeState("deadline",ISODate);
    };

    function handleSubmit(){
        addProject();
        props.setCreate(false);
    }

    return (
    <Dialog open={props.create} onClose={(e)=>props.setCreate(false)} fullWidth maxWidth='md'>
    <DialogTitle>Create a new project</DialogTitle>
    <DialogContent>
        <Stack spacing={2} sx={{mt:3}}>
            <DialogTitle>Project Details</DialogTitle>
            <TextField 
                label="Project name" 
                variant="outlined" 
                required 
                autoFocus
                onChange={(e) =>changeState("name",e.target.value)}/>
            <TextField 
                label="Project Password" 
                variant="outlined" 
                required 
                type="password"
                error={error}
                helperText="Passwords must match"
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
            <DialogTitle>Project participants</DialogTitle>
            <DialogContentText>
                Add your project participants manually from the autocomplete list below (they must already have an account). You can later add more members manually or you can share the project info and they can join your project.
            </DialogContentText>
            <MembersAuto setValue={setTeam} multiple={true} title={"Project participants"}/>
        </Stack>
        
    </DialogContent>
    <DialogActions>
        <Button onClick={(e)=>props.setCreate(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" size="large">Submit</Button>
    </DialogActions>
    </Dialog>
    
  );
}
