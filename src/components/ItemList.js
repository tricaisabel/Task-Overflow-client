import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditItem from './EditItem';

const columns = [
  { field: 'type', headerName: 'Type',width:"70"},
  { field: 'name', headerName: 'Name',width:"200"},
  { field: 'description', headerName: 'Description',width:"300"},
  { field: 'openedBy', headerName: 'Opened By'},
  { field: 'assignedTo', headerName: 'Assigned To',width:"200"},
  { field: 'progress', headerName: 'Progress', type:'number'},
  { field: 'startDate', headerName: 'Start Date',width:"200"},
  { field: 'endDate', headerName: 'End Date',width:"200"}
];


export default function DataTable(props) {
    const [open,setOpen]=React.useState(false);
    const [selectedItem,setSelected]=React.useState({});

    return (
        <div style={{ height: 400, width: '100%'}} >
        <DataGrid
            rows={props.rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
            disableSelectionOnClick
            onRowClick={(params)=>{setOpen(true); setSelected(params.row)}}
        />
        {open && <EditItem create={open} setCreate={setOpen} item={selectedItem} getItems={props.getItems}/>}
        </div>
    );
}
