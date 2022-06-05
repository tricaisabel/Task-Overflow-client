import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {useEffect,useState} from 'react';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';
import { styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogOutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Settings from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import NavBar from './Navbar';
import {useNavigate} from "react-router-dom";
import Dashboard from './Dashboard';
import Items from './Items';
import ShareProject from './ShareProject';
import EditProject from './EditProject';
import Analytics from './Analytics';
import Timeline from "./Timeline";

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));

export default function Project(){
    const navigate = useNavigate();
    const {id}=useParams();
    let project=useSelector((state)=>state.project);
    let user=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const {updateProject}=bindActionCreators(actionCreators,dispatch);
    const [tab,setTab]=useState(1);
    const [edit,setEdit]=useState("");
    const [share,setShare]=useState("");

    const tabs=[
        {icon:<HomeIcon/>, name:"Dashboard"},
        {icon:<AddTaskIcon/>, name:"Items"},
        {icon:<EventNoteIcon/>, name:"Timeline"},
        {icon:<GroupIcon/>, name:"Analytics"}
    ]

    async function getProject(){
        const response = await fetch(`http://localhost:3001/api/project/${id}`);
        if(response.status===200){
            let newProject={};
            const data=await response.json(); 
            Object.keys(data).forEach(key=>{
              newProject[key]=data[key];
            });    
            updateProject(newProject);       
        }
        else{
          updateProject({});
        }
    }

    async function deleteProject(){
        if (window.confirm('The project will be permanently deleted. Are you sure?'))
        {
            const response = await fetch(`http://localhost:3001/api/project/${project["_id"]}`, {method: 'DELETE'});
            if (response.status === 200) {
                alert("The project has been permanently deleted");
                navigate("/overview");
            }
        }        
    }

    useEffect(()=>{
        getProject();
    },[]);
    
    return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar open={true} position="fixed">
        <NavBar/>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <DrawerHeader>
          <Typography variant={"body"} sx={{ fontWeight: 'medium' }}>{project.name}</Typography>
        </DrawerHeader>
        <Divider />
        <List>
            {
            tabs.map((tab,index)=>
            <ListItem button onClick={()=>setTab(index+1)} key={index}>
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText primary={tab.name} />
            </ListItem>)
            }            
        </List>
        <List>
            {
              user.firstName+" "+user.lastName===project.manager.name &&
              <>
              <Divider />
              <ListItem button onClick={deleteProject}> 
                <ListItemIcon><DeleteOutline/></ListItemIcon>
                <ListItemText primary={"Delete project"} />
              </ListItem>
              <ListItem button onClick={()=>setEdit(project)}> 
                <ListItemIcon><Settings/></ListItemIcon>
                <ListItemText primary={"Edit project"} />
              </ListItem>
              <ListItem button onClick={()=>setShare(project)}> 
                <ListItemIcon><ShareIcon/></ListItemIcon>
                <ListItemText primary={"Share project"} />
              </ListItem>
              </>
            }
        </List>
        <Divider />
        <List>
            <ListItem button onClick={()=>navigate("/")}> 
              <ListItemIcon><LogOutIcon/></ListItemIcon>
              <ListItemText primary={"Log out"} />
            </ListItem>
        </List>
      </Drawer>
      <Main open={true}>
        <DrawerHeader />
        {{
            1:<Dashboard/>,
            2:<Items/>,
            3:<Timeline/>,
            4:<Analytics/>
        }[tab]}
      </Main>
      {edit!=="" && <EditProject edit={edit} setEdit={setEdit}/>}  
      {share!=="" && <ShareProject share={share} setShare={setShare}/>}    
    </Box>
  );
}