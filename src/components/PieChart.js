import * as d3 from 'd3';
import {useEffect} from 'react';
import { Stack, Typography } from '@mui/material';
import Stop from '@mui/icons-material/Stop';
import './App.css';

export default function PieChart(props){
    function drawChart(){
        const svg=d3.select('#pieChart');
        svg.selectAll("*").remove();

        const initial=0;
        const total=props.data.reduce((prev,curr)=>prev+curr.count,initial);
        console.log(total);
        // Creating Pie generator
        var pie = d3.pie();
  
        // Creating arc
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(200);
  
        let g = svg.append("g")
            .attr("transform", `translate(250,200)`);
  
        // Grouping different arcs
        var arcs = g.selectAll("arc")
            .data(pie(props.data.map(each=>each.count)))
            .enter()
            .append("g");
  
        // Appending path 
        arcs.append("path")
            .attr("fill", (item,i)=>{
                return props.colorScheme[i];
            })
            .attr("d", arc)
            .append("title")
            .text((d) =>Math.round(d.value/total*100)+"%");

        // Adding data to each arc
        arcs.append("text")
            .attr("transform",(item)=>{ 
                    return `translate(${arc.centroid(item)})`; 
            })
            .text(function(item,i){
                if(item.data!==0)
                    return item.data; 
               });
            
    }

    useEffect(()=>{
        drawChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.title]);

    return(
        <>
        <Typography variant="h5">{props.title}</Typography>
        <Stack width="1" direction="row" alignContent="center">
            <svg id="pieChart" width="100vh" height="500px"></svg>
            <Stack width="0.5">
            {
                props.data.map((each,i)=>
                    <Stack direction="row" key={i}>
                        <Stop sx={{color:props.colorScheme[i]}}/>
                        <Typography variant="body1">{each.type}</Typography>
                    </Stack>
                )
            }
            </Stack>
        </Stack>
        </>
    );
}