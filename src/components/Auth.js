import {useState} from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import LogIn from './LogIn';
import SignIn from './SignIn';
import { grey } from '@mui/material/colors';
import NavBar from './Navbar'
import './App.css';

export default function SignUp() {

  const [tab, setTab] = useState('1');
  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
      <>
        <NavBar/>
        <Box sx={{ bgcolor: grey[300], width:1, p:0, display:'flex', flexDirection:'column', justifyContent: 'center', height:'91vh' }} >
          <Container maxWidth="sm">
            <Card variant="outlined">
              <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Log In" value="1" />
                    <Tab label="Create account" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <LogIn/>
                </TabPanel>
                <TabPanel value="2">
                  <SignIn/>
                </TabPanel>
              </TabContext>
            </Card>
          </Container>
        </Box>
      </>
      
      
  );
}
