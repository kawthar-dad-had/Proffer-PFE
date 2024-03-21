import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, InputLabel, TextField, Typography } from "@mui/material"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {useState, useEffect} from 'react'
import { useCreate, useGetIdentity } from "@pankod/refine-core";

const SoumissionDialog = (props: { in: { show: boolean, lotId: any }, onClose: () => void  }) => {
    const [showD, setShowD] = useState<boolean>(props.in.show)
    const {data: user} = useGetIdentity()
    const { mutate } = useCreate()
    
    const [soumission, setSoumission] = useState({
        materiels: {} as File,
        employes: {} as File,
        budget: "",
        delai: "",
        garantie: "",
        cahierDesCharges: {} as File,
        lotId: ""
    })

    useEffect(() => {
      setShowD(props.in.show);
    }, [props.in.show]);
    
    useEffect(() => {
      setSoumission({...soumission, lotId: props.in.lotId})
      console.log(soumission);
    }, [props.in.lotId])
    const handleCloseShow = () => {
        props.onClose()
    };

    const handleselectedFile1 = (event: any) => {
      setSoumission({...soumission, materiels: event.target.files[0]})
    };

    const handleselectedFile2 = (event: any) => {
      setSoumission({...soumission, employes: event.target.files[0]})
    };

    const handleselectedFile = (event: any) => {
      setSoumission({...soumission, cahierDesCharges: event.target.files[0]})
    };

    const handleSoum = () => {
      const formData = new FormData();

      Object.keys(soumission).forEach(key => {
        //@ts-ignore
          const value = soumission[key];
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, value);
        }
      })
      mutate({
        resource: "soumission/",
        values: formData
      },
      {
        onSuccess() {
          setSoumission({
            materiels: {} as File,
            employes: {} as File,
            budget: "",
            delai: "",
            garantie: "",
            cahierDesCharges: {} as File,
            lotId: ""
          })
          handleCloseShow();
        }
      })
    }
    return (
    <Dialog open={showD} onClose={handleCloseShow}>
        <DialogTitle sx={{color: "primary.main", textAlign: "center"}} >
             
        </DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <Grid container justifyContent={"center"} spacing={1}>
                         
              
              <Grid item xs={12}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Entreprise"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    defaultValue={user.inscription.nom}
                    InputLabelProps={{ shrink: true }}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Classificaton"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    defaultValue={user.inscription.classification}
                    InputLabelProps={{ shrink: true }}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Numéro de registre commercial"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    defaultValue={user.inscription.numRegistre}
                    InputLabelProps={{ shrink: true }}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="NIF"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    defaultValue={user.inscription.nif}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="NIS"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    defaultValue={user.inscription.nis}
                    InputLabelProps={{ shrink: true }}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid> 
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="CASNOS"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    defaultValue={user.inscription.casnos}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Cacobatph"
                    type="text"
                    disabled
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    defaultValue={user.inscription.cacobatph}
                    //onChange={e =>setLotObj({...lotObj, classificationLot: e.target.value})}
                  />
              </Grid>
              <Grid item xs={4}>               
                <TextField
                    autoFocus
                    margin="dense"
                    id="budget"
                    label="Budget"
                    type="number"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    onChange={e =>setSoumission({...soumission, budget: e.target.value})}
                  />
              </Grid>
              <Grid item xs={4}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Délai de réalisation (mois)"
                    type="number"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    onChange={e => setSoumission({...soumission, delai: e.target.value})}
                  />
              </Grid>              
              <Grid item xs={4}>               
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Garantie des équipements (mois)"
                    type="number"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    onChange={e =>setSoumission({...soumission, garantie: e.target.value})}
                  />
              </Grid>
              <Grid container justifyContent={"center"} item xs={4}>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <InputLabel>Le matériel et équipement	:</InputLabel>
                  <input hidden onChange={e => handleselectedFile1(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {soumission?.materiels?.name ?? ""}
                </span>
              </Grid>
              <Grid container justifyContent={"center"} item xs={4}>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <InputLabel>L'effectif:</InputLabel>
                  <input hidden onChange={e => handleselectedFile2(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {soumission?.employes?.name ?? ""}
                </span>
              </Grid>
              <Grid container justifyContent={"center"} item xs={4}>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <InputLabel>Cahier des charges:</InputLabel>
                  <input hidden onChange={e => handleselectedFile(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {soumission?.cahierDesCharges?.name ?? ""}
                </span>
              </Grid>

            </Grid>


          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseShow}>Annuler</Button>
            <Button disabled={(!soumission.cahierDesCharges.name || !soumission.employes.name || !soumission.materiels.name ||soumission.delai === "" || !soumission.lotId ||  soumission.budget === "" || soumission.garantie === "")} onClick={handleSoum}>Soumissionner</Button>
          </DialogActions>
        </Dialog>
  )
}

export default SoumissionDialog