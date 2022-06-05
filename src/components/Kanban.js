import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import {useSelector} from 'react-redux';
import { Stack } from '@mui/material';
import TaskAlt from '@mui/icons-material/TaskAlt';
import BugReport from '@mui/icons-material/BugReport';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import ReportGmailerrorred from '@mui/icons-material/ReportGmailerrorred';
import { Button } from '@mui/material';
import EditItem from './EditItem';

export default function AlignItemsList(props) {
    const items=useSelector((state)=>state.items);
    const user=useSelector((state)=>state.user);
    const project=useSelector((state)=>state.project);
    const [open,setOpen]=React.useState(false);
    const [selectedItem,setSelected]=React.useState({});
    const cards=[
        {bg:'text.disabled',text:'To Do',value:0},
        {bg:'#42a5f5',text:'In Progress',value:50},
        {bg:'#1976d2',text:'Done',min:60,value:100}
    ];

    async function moveItem(direction,item){
        let body={...item};
        const sign=direction==="right"?1:-1;
        body.progress=item.progress+sign*50;
        const response = await fetch(`http://localhost:3001/api/item/${item["_id"]}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
        });
        if (response.status === 200) {
            props.getItems();
        }
    }
    async function assignYourself(item){
        let body={...item};
        body.assignedTo=user.firstName+" "+user.lastName;
        const response = await fetch(`http://localhost:3001/api/item/${item["_id"]}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
        });
        if (response.status === 200) {
            props.getItems();
        }
    }

    function daysDifference(date) {
        const time_diff = new Date(date).getTime() - new Date().getTime();
        const days_diff = time_diff / (1000 * 3600 * 24);
        return Math.round(days_diff);
    }
    
    const getDateColor=(date)=>{
        const difference=daysDifference(date);
        switch(true){
            case difference>0 && difference <=3:
                return "#ff9800";
            case difference<=0:
                return "#f44336";
            default:
                return "green";
        }
    }

    function getRights(item){
        const availableTo=[item.assignedTo,item.openedBy,project.manager.name];
        return !availableTo.includes(user.firstName+" "+user.lastName);        
    }

    async function deleteItem(item){
        if (window.confirm('The item will be permanently deleted. Are you sure?'))
        {
            const response = await fetch(`http://localhost:3001/api/item/${item["_id"]}`, {method: 'DELETE'});
            if (response.status === 200) {
                props.getItems();
            }
        }        
    }
    
  return (
    <Stack
    direction="row"
    justifyContent="center"
    alignItems="flex-start"
    spacing={2}>
        {
        cards.map((card,i)=>
        <Stack width="0.33" key={i}>
            <Typography variant="h6" sx={{ fontWeight: 'regular', bgcolor: card.bg, color:'white',borderRadius: 2,textAlign: 'center'}}>{card.text}</Typography>
            <List sx={{ 
                bgcolor: 'background.paper', 
                overflow: 'auto',
                maxHeight: "440px",
                '& ul': { padding: 0 },}}>
            {
            items.map((item,j)=>
            item.progress===card.value &&
            <div key={j}>
                <ListItemButton 
                    onClick={(e)=>{setOpen(true); setSelected(item)}}
                    alignItems="flex-start">
                    <ListItemAvatar>
                        {
                            {
                                "task":<TaskAlt sx={{ color: card.bg}} variant="rounded"/>,
                                "bug":<BugReport sx={{ color: card.bg}} variant="rounded"/>,
                                "issue":<ErrorOutline sx={{ color: card.bg}} variant="rounded"/>
                            }[item.type] 
                        }
                    </ListItemAvatar>
                    <Stack direction="column"  width="100%">
                        <ListItemText
                        primary={item.name}
                        secondary={
                            <React.Fragment>
                            {item.description.slice(0,80)+"..."}
                            </React.Fragment>
                        }
                        />
                        <Typography variant="caption"> Opened by: {item.openedBy}</Typography>
                        <Typography variant="caption"> Assigned to: {item.assignedTo.includes(user.firstName+" "+user.lastName)? "You":item.assignedTo.join(",")}</Typography>
                        
                        <Stack direction="row" alignItems="center">
                        <Typography variant="caption">
                            Start date: {item.startDate} ({daysDifference(item.startDate)>=0?daysDifference(item.startDate)+" days left":daysDifference(item.startDate)*(-1)+" days ago"})
                        </Typography>        
                        </Stack>

                        <Stack direction="row" alignItems="center">
                        {daysDifference(item.endDate)<=3 && <ReportGmailerrorred sx={{color:getDateColor(item.endDate)}}/>}
                        <Typography variant="caption">
                            End date: {item.endDate} ({daysDifference(item.endDate)>=0?daysDifference(item.endDate)+" days left":daysDifference(item.endDate)*(-1)+" days ago"})
                        </Typography>   
                        </Stack>
                        
                                        
                    </Stack>
                    <Stack>
                    {    
                        i!==2 &&
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={(e)=>{e.stopPropagation();moveItem("right",item)}}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                    }
                    {
                        i!==0 &&
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={(e)=>{e.stopPropagation();moveItem("left",item)}}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                    }
                    {
                        item.assignedTo==="none" &&
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={(e)=>{e.stopPropagation(); assignYourself(item)}}
                            aria-label="move selected left"
                        >
                            +
                        </Button>
                    }
                    {
                        !getRights(item) && i===2 &&
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={(e)=>{e.stopPropagation(); deleteItem(item)}}
                            aria-label="move selected left"
                        >
                            delete
                        </Button>
                    }
                    </Stack>
                </ListItemButton>
            </div>
            )}
            {
                items.length===0 && 
                <Typography variant="body2">Currently, there are no items</Typography>
            }
            </List>
        </Stack>
        )}
        {open && <EditItem create={open} setCreate={setOpen} item={selectedItem} getItems={props.getItems}/>}
    </Stack>    
  );
}
