import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, InputLabel, Stack, TextField, Typography } from "@mui/material"
import {useState, useEffect} from 'react'
import { useGetIdentity, useUpdate } from "@pankod/refine-core";
import { LordIcon } from "./lord-icon";

const EvaluationDialog = (props: { in: { show: boolean, submissionId: any }, onClose: () => void  }) => {
    const [showD, setShowD] = useState<boolean>(props.in.show)
    const {data: user} = useGetIdentity()
    const { mutate } = useUpdate()
    
    const [soumission, setSoumission] = useState({
        materiels: "",
        employes: "",
        qualTech: "",
    })

    useEffect(() => {
      setShowD(props.in.show);
      console.log(props.in.submissionId);
    }, [props.in.show]);
    
    const handleCloseShow = () => {
        props.onClose()
    };

    const handleSoum = () => {
      mutate({
        resource: `soumission/evaluate/`,
        id: props.in.submissionId,
        values: soumission
      },
      {
        onSuccess() {
          setSoumission({
            materiels: "",
            employes: "",
            qualTech: "",
          })
          handleCloseShow();
        }
      })
    }
    return (
    <Dialog open={showD} onClose={handleCloseShow}>
        <DialogTitle sx={{color: "primary.main", textAlign: "center"}} >
            <Stack direction={"row"} justifyContent={"center"}>
                <LordIcon
                    src="https://cdn.lordicon.com/wloilxuq.json"
                    trigger="hover"
                    colors={{primary: '#121331', secondary: "#08a88a"}}
                    size={40}
                />  
                <Typography variant="h4" color="primary.main">
                    Evaluation
                </Typography> 
            </Stack>
        </DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <Grid container justifyContent={"center"} spacing={1}>
              <Grid item xs={8}>               
                <TextField
                    autoFocus
                    margin="dense"
                    id="budget"
                    label="Evaluation de materiels"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={e =>setSoumission({...soumission, materiels: e.target.value})}
                  />
              </Grid>
              <Grid item xs={8}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Evaluation d'effectif"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={e => setSoumission({...soumission, employes: e.target.value})}
                  />
              </Grid>
              <Grid item xs={8}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Evaluation de qualité technique"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={e => setSoumission({...soumission, qualTech: e.target.value})}
                  />
              </Grid>
              

            </Grid>


          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseShow}>Annuler</Button>
            <Button disabled={(soumission.employes === "" || soumission.materiels === "" || soumission.qualTech === "" )} onClick={handleSoum}>Evaluer</Button>
          </DialogActions>
        </Dialog>
  )
}

export default EvaluationDialog