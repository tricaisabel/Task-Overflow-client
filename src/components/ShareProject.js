import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';

export default function ShareProject(props) {
  const [copiedText, setCopiedText] = React.useState();

  function getCopyText(){
    return "Project ID: "+props.share["_id"]+"\nProject Password: "+props.share["password"];
  }

  return (
    <div>
      <Dialog
        fullWidth maxWidth='sm'
        open={props.share!==""}
        onClose={()=>props.setShare("")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Share Project Credentials</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{mt:3}}>
          <DialogContentText id="alert-dialog-description">
           You can copy and share this information to anyone that you would like to join your project. 
           Once they create an account, they can press "Join Project", introduce the following credentials and they will get access to your project.
          </DialogContentText>
            <br/>
          <CopyToClipboard
            text={getCopyText()}
            onCopy={() => setCopiedText(getCopyText())}
            >
                <Tooltip
                    title={
                    copiedText === getCopyText()
                        ? "This was Copied!"
                        : "Click to copy me to Clipboard"
                    }
                    placement="top"
                >
                   <TextField
                    multiline
                    id="outlined-read-only-input"
                    label="Project Credentials"
                    defaultValue={getCopyText()}
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                </Tooltip>
            </CopyToClipboard>
            </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>props.setShare("")}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
