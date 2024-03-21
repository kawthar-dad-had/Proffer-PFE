import { Alert, Autocomplete, Box, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, Chip, Collapse, DataGrid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, IconButtonProps, InputLabel, Snackbar, TextField, Typography, emphasize, frFR, styled } from '@pankod/refine-mui'
import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Swal from 'sweetalert2';
import { useCreate, useDelete, useList } from '@pankod/refine-core';
import { useNavigate } from '@pankod/refine-react-router-v6';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { domaines, villes } from 'contexts';
import { type } from 'os';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CreateOffre = () => {
  const {mutate} = useCreate()
  const {mutate: mutateDelete} = useDelete()
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = React.useState(-1);


  const handleExpandClick = (i: number) => {
    setExpandedId(expandedId === i ? -1 : i);
  };
  const [openSnack, setOpenSnack] = useState(false);

  const [arr, setArr] = useState<any>([]);
  const [lot, setLot] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [dDay, setDDay] = useState("")
  const [description, setDescription] = useState("")
  const [ville, setVille] = useState("")
  const [evaluateur, setEvaluateur] = useState("")
  const [cahierDesCharges, setCahierDesCharges] = useState<File>()
  const [selectedFileName, setSelectedFileName] = useState("")
  const {data: evaluateurs} = useList({
    resource: 'auth/users/evaluateurs'
  })

  const [lotObj, setLotObj] = useState({
    name: "",
    domaine: "",
    materiels: "",
    employes: "",
    delai: "",
    budget: "",
    garantie: "",
    qualTech: ""
  })

  const disabled = (lotObj.name === "" || lotObj.delai === "" || lotObj.budget === "" 
                || lotObj.garantie === "" || lotObj.materiels === "" || lotObj.employes === "" 
                || lotObj.domaine === "" || lotObj.qualTech === "")
  
  const handleselectedFile = (event: any) => {
    setSelectedFileName(event.target.files[0].name)
    setCahierDesCharges(event.target.files[0])
  };

  const handleRemoveLot = (index: number) => {
    Swal.fire({
      title: 'Voulez vous supprimez ce lot?',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (index > -1) {
          const newArr = [...arr] // Create a copy of the arr array
          newArr.splice(index, 1) // Remove the item at the specified index
          setArr(newArr)
        }
        setOpenSnack(true)
      }
    })
  } 

  const handleOpenLot = () => {
    setLot(true)
  }

  const handleCloseLot = () => {
    setLot(false)
  };
  const handleLotAjouter = () => {
    setOpen(true)
    setLot(false)
    console.log(lotObj);
    setArr([...arr, lotObj])
    setLotObj({
      name: "",
      domaine: "",
      materiels: "",
      employes: "",
      delai: "",
      budget: "",
      garantie: "",
      qualTech: ""
    })
  }
  const handleSubmit = () => {
    const obj = {
      name: name,
      dDay: dDay,
      ville: ville,
      description: description,
      evaluateurId: evaluateur,
      cahierDesCharges: cahierDesCharges,
      lots: JSON.stringify(arr)
    }

    const formData = new FormData();

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj.hasOwnProperty(key)) {
          //@ts-ignore
          if (typeof obj[key] === 'object' && obj[key] instanceof File) {
            // Handle file separately
            //@ts-ignore
            formData.append(key, obj[key], obj[key].name);
          } else {
            //@ts-ignore
            formData.append(key, obj[key]);
          }
        }
      }
    }
    console.log(obj)
    
    mutate({
      resource: 'offre/offres/',
      values: formData,
      metaData: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }, {
      onError: (error, variables, context) => {
          // An error occurred!
          console.log(error)
      },
      onSuccess: async(data, variables, context) => {
        navigate("/offre")
      },
    })
  }

  const handleShowFile = (pdf: any) => {
    const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    URL.revokeObjectURL(pdfUrl);
  }

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  }) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
  
  function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  return (
    <Box sx={{ height: "auto", width: '100%' }}>
    <Card sx={{bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
          <Grid container mb={"20px"}   >
              <Grid container item xs={12} >
              <Grid item xs={12}>
                    <div role="presentation" onClick={handleClick}>
                      <Breadcrumbs aria-label="breadcrumb">
                        <StyledBreadcrumb
                          component="a"
                          href="#"
                          onClick={() => { navigate("/offre")}}
                          label="Offres"
                          icon={<BusinessCenterIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb 
                          component="a" 
                          href="#" 
                          onClick={() => { navigate("/offre/create")}}
                          label="Créer une offre" 
                          icon={<AddCardIcon fontSize="small" />}
                          />
                          
                      </Breadcrumbs>
                    </div>
                  </Grid>
                <Grid item mr={1} mt={1}>
                  <AddCardIcon fontSize='large'/>
                </Grid>
                <Grid container item xs={10} mb={"20px"} mt={1}>
                  <Typography variant="h4">Créer une offre</Typography>
                </Grid>
              </Grid>
          </Grid>
          <FormControl fullWidth>
              <Grid container spacing={1}>
                <Grid item xs={6} mb={1}>
                  <TextField
                      required
                      fullWidth
                      placeholder='Nom'
                      id="outlined-required"
                      label="Offre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} mb={1}>
                  <TextField
                        required
                        fullWidth
                        placeholder='Dernier délai'
                        id="outlined-required"
                        label="Dernier délai"
                        InputLabelProps={{ shrink: true }}
                        type='date'
                        value={dDay}
                        onChange={(e) => setDDay(e.target.value)}
                      />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    id="combo-box-demo"
                    //@ts-ignore
                    options={evaluateurs?.data?.rows?.map(row => ({
                      label: `${row.first_name} ${row.last_name}`,
                      id: row.id
                    })) ?? []}
                    getOptionLabel={(option: any) => option.label}
                    onChange={(event, newValue) => {
                      setEvaluateur(newValue?.id ?? null);
                    }}
                    renderInput={(params) => <TextField {...params} label="Evaluateur" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    id="combo-box-demo"
                    options={villes}
                    onChange={(event, newValue) => {
                      //@ts-ignore
                      setVille(newValue?.label ?? null);
                    }}
                    renderInput={(params) => <TextField {...params} label="Ville" />}
                  />
                </Grid>

                <Grid item xs={12} mt={1}>
                  <TextField onChange={(e) => setDescription(e.target.value)} fullWidth sx={{marginBottom: "20px"}} required id="outlined-basic" label="Description" multiline rows={3} variant="outlined" />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <IconButton  sx={{color: "#FFAF22"}} aria-label="upload picture" component="label">
                  <label>Cahier des charges:</label>
                  <input hidden onChange={e => handleselectedFile(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {selectedFileName}
                </span>
              </Grid>
            <Grid container justifyContent={"right"}>
              <Button type='submit' disabled={(name === "" || dDay === "" || description === "" || evaluateur === "" || ville === "")} onClick={handleOpenLot} sx={{ color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }} >Ajouter un Lot</Button>
            </Grid>
          </FormControl>
          {open ? 
          <div>

          <Grid container spacing={1}>
          {//@ts-ignore
            arr.map((item, i) => {
              return (
                <Grid key={i} container justifyContent={"center"} alignItems={"flex-start"} item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{
                    height: 'fit-content', 
                    minWidth: 'auto' ,
                    marginTop: "10px",
                    bgcolor: 'success.main',
                    borderRadius: "20px",
                    '&:hover': {
                      boxShadow: 20,
                    },
                  }}>
                    <CardHeader
                      avatar={
                          <IconButton  aria-label="add to favorites">
                            <LocalOfferOutlinedIcon fontSize='medium' />
                          </IconButton>
                      }
                      title={item.name}
                      titleTypographyProps={{variant:'h6' }}
                      
                      
                    />
                    <CardContent >
                      <Typography variant='body1'>Domaine :</Typography>
                      <Typography variant='body2' color="text.secondary" >{item.domaine}</Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton onClick={() => {handleRemoveLot(i)}} color='primary' aria-label="add to favorites">
                          <DeleteIcon />
                        </IconButton>
                      <ExpandMore
                        expand={expandedId === i}
                        onClick={() => handleExpandClick(i)}
                        aria-expanded={expandedId === i}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    <Collapse in={expandedId === i} timeout="auto" unmountOnExit>
                      <CardHeader
                        title= {"Information"}
                      />
                      <CardContent>
                        <Typography paragraph variant='body2'>Evaluation financière: {item.budget} points</Typography>
                        <Typography paragraph variant='body2'>Délai de réalisation: {item.delai} points</Typography>
                        <Typography paragraph variant='body2'>Garantie des équipements: {item.garantie} points</Typography>
                        <Typography paragraph variant='body2'>Caractéristiques qualitatives des équipements: {item.qualTech} points</Typography>
                        <Typography paragraph variant='body2'>Le matériel et équipement: {item.materiels} points</Typography>
                        <Typography paragraph variant='body2'>L'effectif: {item.employes} points</Typography>
                        
                      </CardContent>
                    </Collapse>
                    
                  </Card>
                </Grid>
                


              );
            })}
          </Grid>         
          </div>
          : null}




        <Dialog open={lot} fullWidth={true} maxWidth={"lg"} >
          <DialogTitle sx={{color: "primary.main", textAlign: "center"}} >
              <Grid container justifyContent={"center"}>
                    <BusinessCenterIcon fontSize='large'/>
                    <Typography variant="h4">Créer un lot</Typography>
              </Grid>
              </DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <Grid container justifyContent={"center"} spacing={1}>
              <Grid item xs={12}>
                <TextField
                margin="dense"
                id="name"
                label="Nom"
                type="text"
                fullWidth
                variant="standard"
                //InputLabelProps={{ shrink: true }}
                onChange={e =>setLotObj({...lotObj, name: e.target.value})}
                />

              </Grid>
              <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    id="combo-box-demo"
                    options={domaines}
                    onChange={(event, newValue) => {
                      //@ts-ignore
                      setLotObj({...lotObj, domaine: newValue?.label ?? null});
                    }}
                    renderInput={(params) => <TextField variant='standard' margin="dense" {...params} label="Domaine" />}
                  />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Partie d'evaluation:</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Evaluation financière"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setLotObj({...lotObj, budget: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Délai de réalisation"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setLotObj({...lotObj, delai: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Garantie des équipements"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setLotObj({...lotObj, garantie: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Caractéristiques qualitatives des équipements"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setLotObj({...lotObj, qualTech: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Le matériel et équipement"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setLotObj({...lotObj, materiels: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="L'effectif"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setLotObj({...lotObj, employes: e.target.value})}
                />
              </Grid>
              
            </Grid>


          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLot}>Annuler</Button>
            <Button disabled={disabled} onClick={handleLotAjouter}>Ajouter</Button>
          </DialogActions>
        </Dialog>

        {arr.length > 0 ? 
          <Grid container justifyContent={"right"} sx={{marginTop: "20px"}}>
              <Button onClick={()=> navigate("/offre")}  sx={{ color: 'white',marginRight: "10px",borderRadius: "10px", backgroundColor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }} >Annuler</Button>
              <Button onClick={handleSubmit} disabled={(name === "" || dDay === "" || description === "" || evaluateur === "" || ville === "" || selectedFileName === "" || arr.length === 0)} sx={{ color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }} >Valider</Button>
          </Grid>: null}     
      </Card>
      <Snackbar open={openSnack} autoHideDuration={10000} anchorOrigin={{ horizontal:'right', vertical:'top' }} onClose={() => setOpenSnack(false)} >
        <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpenSnack(false)}>
          Lot supprimé
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default CreateOffre