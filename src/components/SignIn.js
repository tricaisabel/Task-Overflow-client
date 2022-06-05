import TabPanel from '@mui/lab/TabPanel';
import { TextField, Typography,Button,MenuItem,Select,InputLabel ,FormControl,Stack} from '@mui/material';
import Security from '@mui/icons-material/Security';
import { Box } from '@mui/system';
import { useState } from 'react'; 
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';

export default function SignIn(){
    const dispatch=useDispatch();
    const {updateUserField}=bindActionCreators(actionCreators,dispatch);

    const [role, setRole] = useState("");
    const [error, setError] = useState(false);
    const [password2, setPassword2] = useState("");

    const [newUser,setUser]=useState({});

    function generateBody(){
        const color="#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        const username=newUser.firstName+newUser.lastName;
        
        const body={
            ...newUser,
            color:color,
            username:username
        };

        return body;
    }

    async function addUser(){
        if(error===false){
            const body=generateBody();
            const response = await fetch(`http://localhost:3001/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
            });

            if (response.status === 200) {
                alert(`Your username is: ${body.username}. \n You can now log in.`);
                updateUserField("logged",true);
                Object.keys(body).forEach(key=>{
                    updateUserField(key,body[key]);
                });
            }
            else{
                alert("The was something wrong. Please try again");
            }
        }
        else{
            alert("Your passwords must match in order to register.");
        }
    }

    function handleRole(e){
        setUser({...newUser,"role":e.target.value})
        setRole(e.target.value);
    }

    return(
        <TabPanel value="2">
            <Stack alignItems="center" spacing={2}>
                <Security color="primary" sx={{ fontSize: 60}} />
                <Typography variant="h5"  sx={{ m: 5}} >Create an account</Typography>
            </Stack>
            <Box sx={{ flexWrap: 'wrap', mt:3}}>
                <TextField 
                    label="First name" 
                    variant="outlined" 
                    required 
                    sx={{m:1}}
                    onChange={(e)=>setUser({...newUser,"firstName":e.target.value})}/>
                <TextField 
                    label="Last name" 
                    variant="outlined" 
                    required 
                    sx={{m:1}}
                    onChange={(e)=>setUser({...newUser,"lastName":e.target.value})}/>
                <TextField 
                    label="Password" 
                    variant="outlined" 
                    required 
                    type="password" 
                    sx={{m:1}}
                    onChange={(e)=>{
                        setUser({...newUser,"password":e.target.value});
                        setError(password2!==e.target.value);
                        }
                    }/>
                <TextField 
                    label="Repeat password" 
                    variant="outlined" 
                    required 
                    type="password" 
                    sx={{m:1}}
                    error={error}
                    helperText="Passwords must match"
                    onChange={(e)=>
                        {
                            setPassword2(e.target.value);
                            setError(newUser.password!==e.target.value);
                        }
                    }
                    />
                <TextField 
                    label="Job title" 
                    variant="outlined" 
                    required 
                    sx={{m:1}}
                    onChange={(e)=>setUser({...newUser,"job":e.target.value})}/>

                <FormControl sx={{ m: 1, minWidth: 120 }} required>
                    <InputLabel>Role</InputLabel>
                    <Select
                    value={role}
                    label="Role"
                    onChange={(e)=>handleRole(e)}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                        <MenuItem value={"manager"}>Manager</MenuItem>
                        <MenuItem value={"member"}>Member</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Stack spacing={2} sx={{mt:3}}>
                <Button 
                    variant="contained"
                    onClick={addUser}>
                    REGISTER
                </Button>
            </Stack>
        </TabPanel>
    )
}