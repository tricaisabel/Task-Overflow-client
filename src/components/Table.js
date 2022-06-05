import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import { LinearProgress } from '@mui/material'; 
import { Avatar } from '@mui/material';
import { Tooltip } from '@mui/material';
import {useSelector} from 'react-redux';
import {useState,useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import {useNavigate} from "react-router-dom";

export default function BasicTable(props) {
	const navigate = useNavigate();
  const [existProjects,setExistProjects]=useState("none");
  const projects=useSelector((state)=>state.userProjects);
  const user=useSelector((state)=>state.user);
  const tableHead=["Project Name", "Project Description","Deadline","Progress","Manager","View"];

  useEffect(()=>{
    if(projects.length>0)
      setExistProjects("block");
  },[projects]);

  function handleEdit(row){
    props.setEdit(row);
  }

  return (
    <>
    {
      
      <TableContainer component={Paper} sx={{m:3, width:'auto'}} display={existProjects}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            {
              tableHead.map((title,index)=><TableCell key={index}align="left">{title}</TableCell>)
            }
            {
              user.role==="manager" && <TableCell align="left">Edit</TableCell>
            }
            {
              user.role==="manager" && <TableCell align="left">Share</TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((row) => (
            <TableRow key={row.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left" component="th" scope="row">{row.name}</TableCell>
                <TableCell align="left">{row.description.slice(0,80)+"..."}</TableCell>
                <TableCell align="left">{row.deadline.slice(0,row.deadline.indexOf("T"))}</TableCell>
                <TableCell align="left" sx={{ width:"0.1"}}>
                    <LinearProgress variant="determinate" value={row.progress} sx={{borderRadius:5}}/>
                    <Typography variant="body2">{row.progress}%</Typography>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title={row.manager.name} placement="right">
                      <Avatar  children={row.manager.name.split(" ")[0][0]+row.manager.name.split(" ")[1][0]} sx={{bgcolor:row.manager.color}}/>
                    </Tooltip>
                </TableCell>
                <TableCell align="left">
                    <Button variant="contained" onClick={()=>navigate(`/project/${row["_id"]}`)}>Open</Button>
                </TableCell>
                {
                  row.manager.name===user.firstName+" "+user.lastName && 
                  <TableCell align="left">
                    <Button variant="outlined" onClick={()=>handleEdit(row)}>Edit</Button>
                  </TableCell>
                }
                {
                  row.manager.name===user.firstName+" "+user.lastName &&
                  <TableCell align="left" sx={{width:"auto", py:0}}>
                    <IconButton aria-label="share" color="primary" onClick={()=>props.setShare(row)}>
                      <ShareIcon/>
                    </IconButton>
                  </TableCell>
                }
        </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    }
    </>
  );
}
