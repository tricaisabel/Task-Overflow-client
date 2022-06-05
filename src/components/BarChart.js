import * as d3 from 'd3';
import {useEffect} from 'react';
import { Stack, Typography } from '@mui/material';
import Stop from '@mui/icons-material/Stop';
import './App.css';

export default function BarChart(props){
    function drawChart(){
    d3.select("#barChart").selectAll("*").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 250, bottom: 20, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    // List of subgroups 
    var subgroups = Object.keys(props.data[0]).slice(1);

    // List of groups (x-axis)
    var groups = props.data.map(d=>d.group);

      // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 10])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#64b5f6","#3f51b5","#26a69a"])

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (props.data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.data.group); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
        .append("title")
        .text((d,i) =>{
            console.log(i);
            return (d[1]-d[0]).toString();
        })
    }

    useEffect(()=>{
        drawChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.title]);

    return(
         <>
        <Typography variant="h5">{props.title}</Typography>
        <Stack width="1" direction="row" alignContent="center">
            <svg id="barChart" width="80vh" height="500px"></svg>
            <Stack width="0.3">
            {
                ["Tasks","Bugs","Issues"].map((each,i)=>
                    <Stack direction="row" key={i}>
                        <Stop sx={{color:props.colorScheme[i]}}/>
                        <Typography variant="body1">{each}</Typography>
                    </Stack>
                )
            }
            </Stack>
        </Stack>
        </>
    );
}