import NavBar from './Navbar'
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import ListAlt from '@mui/icons-material/ListAlt';
import { Stack } from '@mui/material';
import Table from './Table';
import { Button } from '@mui/material';
import JoinProject from './JoinProject';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import * as React from 'react';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';
import ShareProject from './ShareProject';

export default function Overview(){
    const [open, setOpen] = React.useState(false);
    const [create, setCreate] = React.useState(false);
    const [edit,setEdit]=React.useState("");
    const [share,setShare]=React.useState("");

    let user=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const {addProjects,noProjects}=bindActionCreators(actionCreators,dispatch);

    async function getProjects(){
        const body= { "team":user.firstName+" "+user.lastName };
        const response = await fetch(`http://localhost:3001/api/existProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.status === 200) {
            const data=await response.json();
            addProjects(data);
        } 
        else if(response.status===404){
            noProjects();
        }     
    }
    useEffect(()=>{
        getProjects();
    },[]);

    return(
        <>
        <NavBar/>
        <Box sx={{ bgcolor: grey[300], width:1, p:0, display:'flex', flexDirection:'column', justifyContent: 'center', height:'91vh' }} >
            <Container maxWidth="xl">
                <Card variant="outlined">
                    <Stack justifyContent='center' flexDirection='row' alignItems='center' sx={{m:3}}>
                        <ListAlt color="primary" sx={{ fontSize: 30}}/>
                        <Typography variant="h5" sx={{fontWeight: 'medium',m:2, display:'inline'}}>Here are your projects, {user.firstName}</Typography>
                    </Stack>
                    <Table setEdit={setEdit} setShare={setShare}/>
                   <Button variant="contained" size="large" sx={{m:3}} startIcon={<Add />} onClick={(e)=>setOpen(true)}>Join a new project</Button>
                   {
                    user.role==="manager" && <Button variant="contained" size="large" sx={{m:3}} startIcon={<Edit />} onClick={(e)=>setCreate(true)}>Create a new project</Button>
                    }
                    {open && <JoinProject open={open} setOpen={setOpen}/>  }                   
                    {create && <CreateProject create={create} setCreate={setCreate}/> }  
                    {edit!=="" && <EditProject edit={edit} setEdit={setEdit}/>}  
                    {share!=="" && <ShareProject share={share} setShare={setShare}/>}                                  
                </Card>
            </Container>
        </Box>
        </>
    )
}