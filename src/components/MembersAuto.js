import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function MembersAuto(props){
    let usernames=[];

    async function getUsers(){
        const response = await fetch(`http://localhost:3001/api/users`);
        if(response.status===200){
            const data=await response.json();
            data.map((user)=>usernames.push(user.firstName+" "+user.lastName));
        }
    }

    getUsers();    

    return(
    <Autocomplete
                onChange={(e,v) =>props.setValue(v)}
                multiple={props.multiple}
                id="tags-outlined"
                options={usernames}
                getOptionLabel={(username) => username}
                defaultValue={props.team}
                readOnly={props.disabled}
                filterSelectedOptions
                renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.title}
                    placeholder={props.title}
                />
                )}
            />
    );
}