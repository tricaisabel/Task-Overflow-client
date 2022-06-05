
import { Chart } from "react-google-charts";
import {useSelector} from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useState,useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../state/actionCreators';
import { Typography, Stack } from "@mui/material";
import EditItem from './EditItem';

export default function Timeline(props){
    const items=useSelector((state)=>state.items);
    const project=useSelector((state)=>state.project);
    const user=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const {addItems}=bindActionCreators(actionCreators,dispatch);
    const [view,setView]=useState("all");
    const [open,setOpen]=useState(false);
    const [selectedItem,setSelected]=useState({});

    const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
    ];

    function transformDate(date){
        const year=parseInt(date.slice(0,4));
        const month=parseInt(date.slice(5,7));
        const day=parseInt(date.slice(8,10));
        return new Date(year,month,day);
}

    const rows=[];
    items.forEach(item=>{
        const row=[];
        row.push(item["_id"]);
        row.push(item["name"]);
        row.push(item["type"]);
        row.push(transformDate(item["startDate"]));
        row.push(transformDate(item["endDate"]));
        row.push(null);
        row.push(item["progress"]);
        row.push(null);
        rows.push(row);
    })

    const data = [columns, ...rows];

    const options = {
        height: 400,
        gantt: {
            trackHeight: 30,
            palette: [
                {
                    "color": "#64b5f6",
                    "dark": "#1e88e5",
                    "light": "#42a5f5"
                },
                {
                    "color": "#3f51b5",
                    "dark": "#1a237e",
                    "light": "#5c6bc0"
                },
                {
                    "color": "#26a69a",
                    "dark": "#00796b",
                    "light": "#4db6ac"
                },

            ]
        },
    };

    useEffect(()=>{
       getItems();
    },[view]);

    async function getItems(){
      let body= { "projectId":project["_id"]};
      switch(view){
          case "assigned":
              body.assignedTo=user.firstName+" "+user.lastName;
              break;
          case "unassigned":
              body.assignedTo="none";
              break;
          default:
              delete body.assignedTo;
              break;
      }
      const response = await fetch(`http://localhost:3001/api/existItems`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      });
      if (response.status === 200) {
         const data=await response.json(); 
            let rows=data;
            rows.forEach((item)=>{
                delete item["__v"];
                item.startDate=item.startDate.slice(0,16).replace("T","\t");
                item.endDate=item.endDate.slice(0,16).replace("T","\t");
            }) 
            addItems(rows);   
      }
      else{
          addItems([]);
      }
    }
  return (
      <Stack spacing={2}>
        <Typography variant="h4">Timeline</Typography>
        <Typography variant="body">Here are your items can be visualised in a Gantt Chart. You can select which type of items you want to include.</Typography>
        <FormControl >
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={view}
                onChange={(e)=>{setView(e.target.value)}}
                style={{maxWidth:"200px"}}
            >
                <MenuItem value={"all"}>All items</MenuItem>
                <MenuItem value={"assigned"}>Assigned to me</MenuItem>
                <MenuItem value={"unassigned"}>Unassigned items</MenuItem>
            </Select> 
        </FormControl>
        {
            items.length!==0 ?
            <Chart
                chartType="Gantt"
                width="100%"
                height="50%"
                data={data}
                options={options}
                chartEvents={[
                    {
                    eventName: "ready",
                    callback: ({ chartWrapper, google }) => {
                        const chart = chartWrapper.getChart();
                        google.visualization.events.addListener(chart, "select", e => {
                            const selections=chart.getSelection();
                            if(selections.length>0){
                                let row=selections[0].row;
                                setOpen(true);
                                setSelected(items[row]);
                            }
                        });
                    }
                    }
                ]}
            />  
            :
            <Typography variant="body2">Currently, there no unassigned items</Typography>
        }
        {open && <EditItem create={open} setCreate={setOpen} item={selectedItem} getItems={getItems}/>}
      </Stack>
  );
};
