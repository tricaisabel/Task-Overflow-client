import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TaskAlt from '@mui/icons-material/TaskAlt';
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';
import { useLocation } from 'react-router-dom';
import {useState} from 'react';
import EditProfile from './EditProfile';


const ResponsiveAppBar = () => {
  const user=useSelector((state)=>state.user);
  const [edit,setEdit]=useState(false);
  const dispatch=useDispatch();
  const {updateUserField}=bindActionCreators(actionCreators,dispatch);

  const navigate = useNavigate();
  const location = useLocation();
  
  function logOut(){
    updateUserField("logged",false);
    navigate("/");
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{justifyContent:"space-between"}}>
          <Stack
          sx={{ width: 'auto' }}
          direction="row" 
          justifyContent="end" 
          alignItems="center" 
          spacing={2}>         
            <TaskAlt color="white" sx={{ fontSize: 40, mr:1}} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Task Overflow
            </Typography>
          </Stack>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Task Overflow
          </Typography>
          {
            location.pathname!=="/" && 
            <>
            <Stack
              sx={{ width: '55%' }}
              direction="row" 
              justifyContent="end" 
              alignItems="center" 
              spacing={2}>
              <MenuItem onClick={()=>navigate("/overview")}>
                  <Typography textAlign="center">Your Projects</Typography>
              </MenuItem>
              <MenuItem onClick={()=>setEdit(true)}>
                  <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={logOut}>
                  <Typography textAlign="center">Log Out</Typography>
              </MenuItem>
            </Stack>

            <Stack
              sx={{ width: 'auto' }}
              direction="row" 
              justifyContent="end" 
              alignItems="center" 
              spacing={2}>
              <Typography variant="h6" textAlign="center">{user.firstName+" "+user.lastName}</Typography>
              <Avatar  children={user.firstName[0]+user.lastName[0]} sx={{bgcolor:user.color}}/>
            </Stack>
            </>
          }
        </Toolbar>
      </Container>
      <EditProfile edit={edit} setEdit={setEdit}/>
    </AppBar>
  );
};
export default ResponsiveAppBar;
