import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useSelector} from 'react-redux';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import ItemMessages from './ItemMessages';
import MembersAuto from './MembersAuto';

export default function CreateProject(props) {
    
    const project=useSelector((state)=>state.project);
    const user=useSelector((state)=>state.user);
    const [team,setTeam]=React.useState(props.item.assignedTo);
    const [type,setType]=React.useState(props.item.type);
    const [name,setName]=React.useState(props.item.name);
    const [desc,setDesc]=React.useState(props.item.description);
    const [startDate,setStartDate]=React.useState(props.item.startDate);
    const [endDate,setEndDate]=React.useState(props.item.endDate);
    const [disabled]=React.useState(user.firstName+" "+user.lastName!==props.item.openedBy);

    async function addItem(){
        const newItem={
            name:name,
            description:desc,
            type:type,
            assignedTo:team,
            openedBy:user.firstName+" "+user.lastName,
            progress:0,
            startDate:startDate,
            endDate:endDate,
            projectId:project["_id"]
        };
        const response = await fetch(`http://localhost:3001/api/item/${props.item["_id"]}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
        });
        if (response.status === 200) {
            props.getItems();
            props.setCreate(false);
        }
        else{
            alert("Unfortunately something went wrong. Try again.");
        }
    }

    function handleSubmit(){
        addItem();
        props.getItems();
        props.setCreate(false);
    }

    return (
    <Dialog open={props.create} onClose={(e)=>props.setCreate(false)} fullWidth maxWidth='md'>
    <DialogTitle>Item Details</DialogTitle>
    <DialogContent>
        <Stack spacing={2} sx={{mt:3}}>
            <TextField 
                label="Item name" 
                variant="outlined" 
                required 
                InputProps={{
                    readOnly: disabled,
                }}
                defaultValue={props.item.name}
                onChange={(e) =>setName(e.target.value)}/>
            <TextField 
                label="Item description" 
                variant="outlined" 
                required 
                multiline 
                rows={4}
                 InputProps={{
                    readOnly: disabled,
                }}
                defaultValue={props.item.description}
                onChange={(e) =>setDesc(e.target.value)}/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Item type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Item type"
                     InputProps={{
                        readOnly: disabled,
                    }}
                    defaultValue={props.item.type}
                    onChange={(e)=>setType(e.target.value)}
                >
                    <MenuItem value={"task"}>Task</MenuItem>
                    <MenuItem value={"issue"}>Issue</MenuItem>
                    <MenuItem value={"bug"}>Bug</MenuItem>
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                renderInput={(params) => <TextField {...params} />}
                label="Start date"
                value={startDate}
                readOnly={disabled}
                onChange={(newValue) => {
                    setStartDate(newValue);
                }}
                minDateTime={new Date()}
                />            
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                renderInput={(params) => <TextField {...params} />}
                label="End date"
                value={endDate}
                readOnly={disabled}
                onChange={(newValue) => {
                    setEndDate(newValue);
                }}
                minDateTime={startDate}
                />
            </LocalizationProvider>
            <MembersAuto disabled={disabled} setValue={setTeam} multiple={true} title={"Assign a team"} team={props.item.assignedTo}/>
            <ItemMessages itemId={props.item["_id"]}/>
        </Stack>
        
    </DialogContent>
    <DialogActions>
        <Button onClick={(e)=>props.setCreate(false)}>Cancel</Button>
        {!disabled && <Button onClick={handleSubmit} variant="contained" size="large">Submit</Button>}
    </DialogActions>
    </Dialog>
    
  );
}
