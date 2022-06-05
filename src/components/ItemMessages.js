import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useSelector} from 'react-redux';
import { Stack } from '@mui/material';
import NewMessage from './NewMessage';

export default function ItemMessages(props) {
    const [messages,setMessages]=React.useState([]);
    let project=useSelector((state)=>state.project);

    async function getMessages(){
      const body= { "parentId":props.itemId};
      const response = await fetch(`http://localhost:3001/api/existMessage`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      });
      if (response.status === 200) {
          const data=await response.json();
          setMessages(data.reverse());
      } 
      else{
          setMessages([]);
      }
    }

    function stringAvatar(name) {
      return {
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
      };
    }

    React.useEffect(() => {              
      getMessages(); 
    }, [project]);
    
  return (
    <Stack>
      <Typography variant="h6" sx={{ fontWeight: 'regular' }}>Messages</Typography>
      <List sx={{ 
        width: '1',
         bgcolor: 'background.paper', 
         overflow: 'auto',
         maxHeight: 300,
         '& ul': { padding: 0 },}}>
      {
      messages.map((message,index)=>
      <div key={index}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar  {...stringAvatar(message.sender)} sx={{bgcolor:message.color }}/>
          </ListItemAvatar>
          <Stack direction="column"  width="100%">
            <ListItemText
              primary={message.title}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {message.sender+":\t"}
                  </Typography>
                  {message.content}
                </React.Fragment>
              }
            />
            <Typography 
              alignSelf="flex-end"
              variant="caption">
              {message.time.slice(0,16).replace("T","\t")}
            </Typography>
          </Stack>
        </ListItem>
      </div>
      )}
      {
        messages.length===0 && 
        <Typography variant="body2">Currently, there are no messages for this item</Typography>
      }
      </List>        
          <NewMessage parent={props.itemId} getMessages={getMessages} type="Message"/>
    </Stack>
    
  );
}
