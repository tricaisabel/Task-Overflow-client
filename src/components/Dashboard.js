import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import {useSelector} from 'react-redux';
import { LinearProgress } from '@mui/material'; 
import { Tooltip } from '@mui/material';
import Updates from './Updates';
import React from 'react';

export default function Dashboard(){
    const project=useSelector((state)=>state.project);
    const [progress,setProgress]=React.useState(0);
    const [team,setTeam]=React.useState([]);

    async function calcProjectProgress(){
      const body= { "projectId":project["_id"]};
      const response = await fetch(`http://localhost:3001/api/existItems`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      });
      if (response.status === 200) {
        const data=await response.json(); 
        var sum = 0;
        data.forEach(row=>{
            sum+=row.progress;
        });
        setProgress(Math.round(sum/data.length));
      }
    }

    async function getMembersInfo(){
        const response = await fetch(`http://localhost:3001/api/users`);
        if(response.status===200){
            const data=await response.json();
            const localTeam=[];
            data.forEach(user=>{
                if(project.team.includes(user.firstName+" "+user.lastName)){
                    localTeam.push(user);
                }
            })
            setTeam(localTeam);
        }
    }

    function stringAvatar(name) {
      return {
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
      };
    }

    React.useEffect(()=>{
        getMembersInfo();
        calcProjectProgress();
    },[project])

    return(
        <Stack direction="row" justifyContent="space-between">
        <Stack
            direction="column"
            justifyContent="flex-start"
            spacing={2}
            width="0.45"
        >
            <Typography variant="h4">
                {project.name}
                <Chip label={project["_id"]} sx={{ml:1}}/>
            </Typography>
            <Stack direction="row" alignItems="center">
                <LinearProgress variant="determinate" value={progress} sx={{borderRadius:5, width:"0.5", mr:2}}/>
                <Typography variant="body2">{progress}%</Typography>
            </Stack>
            <Typography variant="body">{project.description}</Typography>
            <Typography>Deadline: {project.deadline.slice(0,10)}</Typography>
            <Card sx={{ width: "fit-content" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'regular' }}>Project managed by:</Typography>
                    <Stack
                        direction="row" 
                        alignItems="center" 
                        spacing={2}>
                        <Avatar {...stringAvatar(project.manager.name)} sx={{bgcolor:project.manager.color}}/>
                        <Stack alignItems="flex-start">
                            <Typography variant="body1" textAlign="center">{project.manager.name}</Typography>
                            <Typography variant="body1" textAlign="center">{project.manager.job}</Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
            <Typography variant="h6" sx={{ fontWeight: 'regular' }}>Team members:</Typography>
            <Stack spacing={0.5} direction="row">
            {
                team.map((member,index)=>
                <Tooltip title={member.firstName+" "+member.lastName} placement="bottom" key={index}>
                    <Avatar sx={{bgcolor:member.color}} key={index} >{member.firstName[0]}{member.lastName[0]}</Avatar>
                </Tooltip>
                )
            }
            </Stack>
        </Stack>
        <Stack direction="column" width="0.5" spacing={2}>
            <Updates/>
        </Stack>
        </Stack>
    );
}