import { InputAdornment, Autocomplete, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Link, Paper, Stack, TextField, Typography, styled, Select, MenuItem, Divider } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SearchOutlined } from '@mui/icons-material';
import { useTable } from '@pankod/refine-core';
import { Masonry } from '@mui/lab';
import { domaines, villes } from 'contexts';
import { axiosInstance } from 'App';
import ResultNotFound from 'components/common/ResultNotFound';
import { useNavigate } from '@pankod/refine-react-router-v6';
import ClearIcon from '@mui/icons-material/Clear';
import { LordIcon } from 'components/common/lord-icon';
import moment from 'moment';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Favoris = () => {
  const navigate = useNavigate()
  const [options, setOptions] = useState([])
  
  useEffect(() => {
    const fetchOptions = async () => {
      const response = await axiosInstance.get("/soumission/offres/auto/complete/offres")
      setOptions(response.data.map((option:any)=> option.name))
    }
  
    fetchOptions()
  }, [])



  const {tableQueryResult: {data, isLoading, isError, refetch}, 
    current, setCurrent, 
    setPageSize, 
    pageCount, 
    sorter, setSorter,
    filters, setFilters,
  } = useTable({
    resource: "soumission/favoris/",
  })
  
  const offres = data?.data ?? []
  

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) =>
        "field" in item ? item : [],
    );
    return {
      nom:
        logicalFilters.find((item) => item.field === "nom")?.value || "",
      domaine:
        logicalFilters.find((item) => item.field === "domaine")?.value || "",
      ville:
        logicalFilters.find((item) => item.field === "ville")?.value || "",
    };
}, [filters]);
  
  const [chipData, setChipData] = React.useState<string[]>([]);

  const handleDelete = (chipToDelete: any) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  useEffect(() => {
    setFilters([
      {
        field: "domaine",
        operator: "in",
        value: chipData.length > 0 ? chipData : undefined,
      }
    ])
  }, [chipData])

  const handleRemoveFav = (id: number) => {
    axiosInstance.delete(`/soumission/favoris/${id}`).then(() => {
      let offre=offres.find(l => l.id === id)
      offre ? offre.favorite = false : offre = undefined

      refetch()
    })
  }

  useEffect(() => {
    refetch()
  }, [offres])

  useEffect(() => {
    window.addEventListener('error', e => {
        if (e.message === 'ResizeObserver loop limit exceeded') {
            const resizeObserverErrDiv = document.getElementById(
                'webpack-dev-server-client-overlay-div'
            );
            const resizeObserverErr = document.getElementById(
                'webpack-dev-server-client-overlay'
            );
            if (resizeObserverErr) {
                resizeObserverErr.setAttribute('style', 'display: none');
            }
            if (resizeObserverErrDiv) {
                resizeObserverErrDiv.setAttribute('style', 'display: none');
            }
        }
    });
  }, []);
  
  if(isLoading) return <Typography>Loading...</Typography>
  if(isError) return <Typography>Error...</Typography>

  return (
    <Box sx={{ width: '100%'  }}>
        <Grid container spacing={2} >
          {/*
          <Grid alignItems={"flex-start"} container item display={{xs: "flex", sm: "none"}} xs={12} >
          <Card sx={{bgcolor: "success.main", padding: '10px' , borderRadius: 5}} >
            <Grid container item xs={12}  >

              <Typography variant='h5' sx={{fontWeight: "bold"}} mt={1}>Filtrage</Typography>
              <Grid item xs={12}  mt={5}>
                <Autocomplete
                  disablePortal
                  sx={{height: 'fit-content'}}
                  fullWidth
                  size="small"
                  id="combo-box-demo"
                  options={villes}
                  onChange={(event: any, newValue: any) => {
                    setFilters([
                      {
                          field: "ville",
                          operator: "contains",
                          value: newValue.label ? newValue.label : "",
                      },
                    ]);
                  }}            
                  renderInput={(params) => 
                    <TextField 
                      sx={{"& .MuiInputBase-root": {height: 'fit-content'}}}  
                      {...params} 
                      label="Ville"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {currentFilterValues.ville && (
                              <IconButton
                                onClick={() => {
                                  setFilters([
                                    {
                                      field: "ville",
                                      operator: "contains",
                                      value: "",
                                    },
                                  ]);
                                }}
                                size="small"
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />}
                />
              </Grid>
              <Grid item xs={12}  mt={3}>
                <Autocomplete
                  disablePortal
                  sx={{height: 'fit-content'}}
                  fullWidth
                  size="small"
                  id="combo-box-demo"
                  options={domaines}
                  onChange={(event: any, newValue: any) => {
                    setChipData([
                        ...chipData,
                      newValue.label ? newValue.label : "",
                    ]);
                  }}   
                  renderInput={(params) => 
                    <TextField 
                      sx={{"& .MuiInputBase-root": {height: 'fit-content'}}}  
                      {...params} 
                      label="Domaine" />}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                {chipData.length > 0 ? <Paper
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                  }}
                  component="ul"
                >
                  {chipData.map((data) => {
                    let icon;



                    return (
                      <ListItem key={data}>
                        <Chip
                          icon={icon}
                          label={data}
                          onDelete={handleDelete(data)}
                        />
                      </ListItem>
                    );
                  })}
                </Paper>: null}
              </Grid>
              <Grid   item xs={12} mt={3}>
                <Button fullWidth   sx={{ fontSize: 17, color: 'white', marginBottom: 2,borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "success.main", color: "primary.main"} }}>Filtrer</Button>
              </Grid>
            </Grid>
          </Card>



          </Grid>
        */}
          <Grid  item xs={12} md={9}  >
            <Card sx={{ bgcolor: 'success.main', padding: '10px', borderRadius: 5}}>
              <Grid container>
                <Grid item xs={2} m={2}>
                  <Stack display={"row"}>
                      <LordIcon
                          src="https://cdn.lordicon.com/twprnhsj.json"
                          trigger="hover"
                          colors={{primary: '#08c18a', secondary: "#eee966"}}
                          size={40}
                      />
                      <Typography variant='h4' sx={{fontWeight: "bold"}}>Offres</Typography>

                  </Stack>
                </Grid>
                <Grid item xs={6} m={2} >
                  <Stack direction="row"  flex={1}  >
                      <Autocomplete
                          sx={{
                              width: 550,
                              borderRadius: "50px",
                          }}
                          id="search-autocomplete"
                          options={options}
                          disableClearable
                          freeSolo
                          fullWidth
                          size="small"
                          value={currentFilterValues.nom}
                          onChange={(event: any, newValue: any) => {
                            setFilters([
                              {
                                  field: "nom",
                                  operator: "contains",
                                  value: newValue ? newValue : "",
                              },
                            ]);
                          }}
                          renderInput={(params) =>{
                            return(
                            <>
                            <TextField
                                {...params}
                                label={"Nom d'offre"}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                      <InputAdornment position="start">
                                        <SearchOutlined />
                                      </InputAdornment>
                                      {currentFilterValues.nom && (
                                        <IconButton
                                          onClick={() => {
                                            setFilters([
                                              {
                                                field: "nom",
                                                operator: "contains",
                                                value: "",
                                              },
                                            ]);
                                          }}
                                          size="small"
                                        >
                                          <ClearIcon />
                                        </IconButton>
                                      )}
                                      </>
                                    ) 
                                }}
                                
                            />
                          </>)  
                        }
                        }
                      />
                  </Stack>
                </Grid>
                <Grid container justifyContent={"center"}  item xs={12}  m={1} >
                { offres.length ?? [].length > 0 ?
                  <Masonry columns={{ xs: 1, sm:  2, md: 3}}   spacing={2}>
                        {offres.map((offre: any) => (
                                    <Card key={offre.id} sx={{ 
                                      maxWidth: 400 ,
                                      borderRadius: "20px",
                                      backgroundColor: "success.main",
                                      '&:hover': {
                                        boxShadow: 2
                                      },
                                    }}>
                                      <CardHeader
                                      
                                        action={
                                          <IconButton >
                                            <CheckCircleOutlineIcon fontSize="large" sx={{color: "primary.main"}}  />
                                          </IconButton>
                                        }
                                        title={offre.name}
                                        subheader={moment(offre.dDay).format('DD/MM/YYYY, HH:mm:ss') }
                                        titleTypographyProps={{variant:'h5' }}
                                      />
                                      <CardContent>
                                        <Typography>
                                          <LordIcon
                                              src="https://cdn.lordicon.com/oaflahpk.json"
                                              trigger="hover"
                                              colors={{primary: "#e88c30"}}
                                              state="hover-jump-spin"
                                              size={25}
                                          />{offre.ville}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {offre.description}
                                        </Typography>
                                      </CardContent>
                                      <CardActions disableSpacing>
                                        {/*<Button  onClick={() => handleShowDialog(offre.id)} sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "success.main", color: "primary.main"} }}>Soumissionner</Button>*/}
                                          <Button
                                               onClick={() => {
                                                navigate(`/accueil/show/${offre.id}`)
                                              }} 
                                              sx={{ml:'10px', color: 'primary.main',borderRadius: "10px",width: "50%" , textDecoration: "underline" ,  backgroundColor: "transparent",":hover": {backgroundColor: "primary.main", color: "success.main"} }}>
                                              Lire plus 
                                          </Button>
                                          <IconButton aria-label="add to favorites">
                                            <FavoriteIcon onClick={() => {handleRemoveFav(offre.id)}}  sx={{color: "primary.main"}}  />
                                          </IconButton>
                                      </CardActions>
                                      <Divider/>
                                      <Box sx={{padding: 2}}>                                      
                                        <Typography variant='body1' sx={{marginLeft: 3 }}>{offre?.user?.inscription?.nom ?? ''}{offre?.user?.inscriptions_ministeres_etab?.nom ?? ''}</Typography>
                                        <Typography variant='body2' sx={{marginLeft: 4 , color: "text.secondary"}}>{(offre?.user?.inscription?.nom ?? false) ? 'Entreprise privée' : 'Etablissement'}</Typography>
                                      </Box>

                                    
                                    </Card>

                      ))}
                  </Masonry>
                  : <ResultNotFound/>}
                  {offres.length > 0 && (
                    <Box display="flex" gap={2} mt={3} flexWrap="wrap" justifyContent='center'>
                        <Button
                            onClick={() => setCurrent((prev) => prev - 1)}
                            disabled={!(current > 1)}
                        >Précedent</Button>
                        <Box
                            display={{ xs: "hidden", sm: "flex" }}
                            alignItems="center"
                            gap="5px"
                        >
                            Page{" "}
                            <strong>
                                {current} of {pageCount}
                            </strong>
                        </Box>
                        <Button
                            onClick={() => setCurrent((prev) => prev + 1)}
                            disabled={current === pageCount}
                        >Suivant</Button>
                        <Select
                            variant="outlined"
                            color="info"
                            displayEmpty
                            required
                            inputProps={{ "aria-label": "Without label" }}
                            size='small'
                            defaultValue={10}
                            onChange={(e) =>
                                setPageSize(
                                    e.target.value ? Number(e.target.value) : 10,
                                )
                            }
                        >
                            {[10, 20, 30, 40, 50].map((size) => (
                                <MenuItem key={size} value={size}>
                                    Show {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                  )}
                </Grid>
              </Grid>

            </Card>
          </Grid>
          <Grid alignItems={"flex-start"}   container item sx={{display:{xs: "none", md: "flex"}}} md={3}>
          <Card sx={{ bgcolor: 'success.main', padding: 2 , borderRadius: 5}}>
            <Grid container item xs={12}  >

              <Typography variant='h5' sx={{fontWeight: "bold"}} mt={1}>Filtrage</Typography>
              <Grid item xs={12}  mt={5}>
                <Autocomplete
                  disableClearable
                  sx={{height: 'fit-content'}}
                  fullWidth
                  size="small"
                  id="combo-box-demo"
                  options={villes}
                  onChange={(event: any, newValue: any) => {
                    setFilters([
                      {
                          field: "ville",
                          operator: "contains",
                          value: newValue.label ? newValue.label : "",
                      },
                    ]);
                  }}     
                  value={currentFilterValues.ville}       
                  renderInput={(params) => 
                    <TextField 
                      sx={{"& .MuiInputBase-root": {height: 'fit-content'}}}  
                      {...params} 
                      label="Ville"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {currentFilterValues.ville && (
                              <IconButton
                                onClick={() => {
                                  setFilters([
                                    {
                                      field: "ville",
                                      operator: "contains",
                                      value: "",
                                    },
                                  ]);
                                }}
                                size="small"
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />}
                />
              </Grid>
              <Grid item xs={12}  mt={3}>
                <Autocomplete
                  disablePortal
                  sx={{height: 'fit-content'}}
                  fullWidth
                  size="small"
                  id="combo-box-demo"
                  options={domaines}
                  onChange={(event: any, newValue: any) => {
                    setChipData([
                        ...chipData,
                      newValue.label ? newValue.label : "",
                    ]);
                  }}   
                  renderInput={(params) => 
                    <TextField 
                      sx={{"& .MuiInputBase-root": {height: 'fit-content'}}}  
                      {...params} 
                      label="Domaine" />}
                />
              </Grid>
              <Grid item xs={12} mt={2}>
                {chipData.length > 0 ? <Paper
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                  }}
                  component="ul"
                >
                  {chipData.map((data) => {
                    let icon;



                    return (
                      <ListItem key={data}>
                        <Chip
                          icon={icon}
                          label={data}
                          onDelete={handleDelete(data)}
                        />
                      </ListItem>
                    );
                  })}
                </Paper>: null}
              </Grid>
              <Grid   item xs={12} mt={3}>
                <Button fullWidth   sx={{ fontSize: 17, color: 'white', marginBottom: 2,borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "success.main", color: "primary.main"} }}>Filtrer</Button>
              </Grid>
            </Grid>
          </Card>



          </Grid>

        </Grid>
    </Box>

  )
}

export default Favoris
