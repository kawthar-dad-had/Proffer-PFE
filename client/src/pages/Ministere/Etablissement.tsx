import React, { useEffect, useState } from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { LordIcon } from 'components/common/lord-icon';
import { Autocomplete, AutocompleteRenderInputParams, Box, Breadcrumbs, Button, Card, Chip, DataGrid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, GridActionsCellItem, GridColumns, GridFilterModel, IconButton, InputLabel, TextField, Typography, emphasize, styled, useDataGrid } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';
import BusinessIcon from '@mui/icons-material/Business';
import { domaines } from 'contexts';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { axiosInstance } from 'App';
import Swal from 'sweetalert2';
import { BACKENDINFO2 } from 'interfaces/common';

const initState: BACKENDINFO2 = {
  page: 0,
  pageSize: 10,
  total: 20,
  filter: [],
  sort: [],
  rows: [],
  refresh: false,
  filterModel: undefined,
};

const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'SORT':
      return {
        ...state,
        refresh: !state.refresh,
        sort: [...action.payload],
      };

    case 'FILTER':
      return {
        ...state,
        refresh: !state.refresh,

        filter: [...action.payload],
      };
    case 'PAGE':
      return {
        ...state,
        refresh: !state.refresh,
        page: action.payload,
      };
    case 'PAGESIZE':
      return {
        ...state,
        refresh: !state.refresh,
        pageSize: action.payload,
      };
    case 'ROWS':
      return {
        ...state,
        total: action.payload.count,
        rows: [...action.payload.rows],
      };

    default:
      return state;
  }
};

/*
function createFilterModelFromFilters(filters: any[]) {
  const filterModel: GridFilterModel = {
    items: [],
  };
  filters.forEach((filter) => {
    filterModel.items.push({
      columnField: filter.field,
      operatorValue: filter.operator,
      value: filter.value,
    });
  });
  return filterModel;
}*/

export const Etablissement = () => {
  const navigate = useNavigate()
  const { dataGridProps } = useDataGrid({resource: `auth/users/mes_etabs/`,});
  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: 'inscriptions_ministeres_etab.nom',
        headerName: 'Nom',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
        valueGetter: (params: any) => {
          return params.row.inscriptions_ministeres_etab.nom
        }
      },
      {
        field: 'email',
        headerName: 'Email',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'phone_number',
        headerName: 'Téléphone',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'inscriptions_ministeres_etab.nis',
        headerName: 'NIS',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
        valueGetter: (params: any) => {
          return params.row.inscriptions_ministeres_etab.nis
        }
      },
      {
        field: 'inscriptions_ministeres_etab.nif',
        headerName: 'NIF',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
        valueGetter: (params: any) => {
          return params.row.inscriptions_ministeres_etab.nif
        }
      },
      {
        field: 'inscriptions_ministeres_etab.codeOrdonnateur',
        headerName: 'Code Ordonnateur',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
        valueGetter: (params: any) => {
          return params.row.inscriptions_ministeres_etab.codeOrdonnateur
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        minWidth: 100,
        sortable: false,
        getActions: function render( params ) {
          let cells = [
            <GridActionsCellItem
                key={1}
                label={"Cahier des charges"}
                icon={<ListAltOutlinedIcon />}
                onClick={() => window.open("http://41.111.227.13:8080/offre/uploads/"+params.row.cahierDesCharges)}
                //showInMenu
            />,
            <GridActionsCellItem
                key={1}
                label={"Détails offre"}
                icon={<ListAltOutlinedIcon />}
                onClick={() => navigate("/offre/show/"+params.row.id)}
                //showInMenu
            />,
          ]
          return cells
        }
      },
    ],
    []
  );

  const [state, dispatch] = React.useReducer(reducer, initState);
  const fetchData = async () => {
      await axiosInstance.get(`auth/users/mes_etabs/?filters=${JSON.stringify(
        state.filter
      )}&sorts=${JSON.stringify(state.sort)}&size=${state.pageSize}&page=${
        state.page
      }`).then((res: any) => {
        if (res.status === 200) {
          console.log(res.data);
          dispatch({ type: 'ROWS', payload: res.data });
        }
        console.log(res);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, [state.refresh]);

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
  
  const [open , setOpen] = useState(false)
  const  handleClose = () => {
    setOpen(false)
  }
  const [minObj, setMinObj] = useState({
    nom: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    nif: "",
    nis: "",
    codeOrdonnateur: "",
    nifFile: {} as File,
    nisFile: {} as File,
    codeOrdonnateurFile: {} as File,
  })

  const handleselectedFile1 = (event: any) => {
    setMinObj({...minObj, nisFile: event.target.files[0]})
  };

  const handleselectedFile2 = (event: any) => {
    setMinObj({...minObj, nifFile: event.target.files[0]})
  };

  const handleselectedFile = (event: any) => {
    setMinObj({...minObj, codeOrdonnateurFile: event.target.files[0]})
  };

  const handleCreate = async() => {
    let formData = new FormData();
    
    Object.keys(minObj).forEach(key => {
      //@ts-ignore
        const value = minObj[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, value);
      }
    })

    await axiosInstance.post('/auth/users/etab', formData).then((res) => {
      if (res.status === 201) {
        Swal.fire("Succés", "Etablissement créé avec succés", "success");
        setMinObj({
          nom: "",
          email: "",
          password: "",
          phone_number: "",
          address: "",
          nif: "",
          nis: "",
          codeOrdonnateur: "",
          nifFile: {} as File,
          nisFile: {} as File,
          codeOrdonnateurFile: {} as File,
        })
        setOpen(false)
      } else {
        setOpen(false)
        Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
      }
    }).catch((err) => {
      console.log(err);
      setOpen(false)
      Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
    })
    
  }
  return (
    <Box sx={{ width: '100%'  }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
              <Grid container mb={"20px"}>
                      <Grid container item xs={6} >
                          <Grid item xs={12}>
                            <div role="presentation" >
                              <Breadcrumbs aria-label="breadcrumb">
                                <StyledBreadcrumb
                                  component="a"
                                  href="/offre/create"
                                  onClick={() => { navigate("/etablissement")}}
                                  label="Etablissements"
                                  icon={<BusinessIcon fontSize="small" />}
                                />
                                <StyledBreadcrumb
                                  component="a" 
                                  href="#" 
                                  onClick={() => { navigate("/etablissement/create")}}
                                  label="Ajouter un etablissement"
                                  icon={<AddCardIcon fontSize="small" />}
                                  />
                              </Breadcrumbs>
                            </div>
                          </Grid>
                          <Grid item mr={1} mt={1}>
                            {/*<BusinessCenterIcon fontSize='large'/>*/}
                            <LordIcon
                                src="https://cdn.lordicon.com/ajyyzcwv.json"
                                trigger="hover"
                                colors={{primary: '#121331', secondary: "#08a88a"}}
                                size={40}
                            />
                          </Grid>
                          <Grid item xs={10}  mt={1}>
                            <Typography variant="h4">Etablissements</Typography>
                          </Grid>
                          <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer vos contracants</Typography>
                      </Grid>
                      <Grid container height={3} item xs={6} justifyContent={'right'} mt={"20px"}>
                        <Button  onClick={() =>  setOpen(true)}sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "#fff", color: "primary.main"} }}>Ajouter un etablissement</Button>
                      </Grid>
              </Grid>
              <DataGrid
              {...dataGridProps}
              sortingMode="server"
              filterMode="server"
              onFilterModelChange={(data) => {
                dispatch({ type: 'FILTER', payload: data.items });
              }}
              pagination
              paginationMode="server"
              rows={state.rows}
              rowCount={state.total}
              page={state.page}
              pageSize={state.pageSize}
              columns={columns}
              filterModel={undefined}
              autoHeight
              onPageSizeChange={(data) =>
                dispatch({ type: 'PAGESIZE', payload: data })
              }
              onSortModelChange={(data) =>
                dispatch({
                  type: 'SORT',
                  payload: [[data[0].field, data[0].sort?.toLocaleUpperCase()]],
                })
              }
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                ...dataGridProps.sx,
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                }, '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'success.main', // set the cell background color
                },
              }}             
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} fullWidth={true} maxWidth={"lg"} >
          <DialogTitle sx={{color: "primary.main", textAlign: "center"}} >
              <Grid container justifyContent={"center"}>
                    <BusinessCenterIcon fontSize='large'/>
                    <Typography variant="h4">Créer un etablissement</Typography>
              </Grid>
              </DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <Grid container justifyContent={"center"} spacing={1}>
              <Grid item xs={6}>
                <TextField
                margin="dense"
                id="name"
                label="Nom"
                type="text"
                fullWidth
                variant="standard"
                //InputLabelProps={{ shrink: true }}
                onChange={e =>setMinObj({...minObj, nom: e.target.value})}
                />

              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="name"
                  label="Email"
                  type="text"
                  fullWidth
                  variant="standard"
                  //InputLabelProps={{ shrink: true }}
                  onChange={e =>setMinObj({...minObj, email: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setMinObj({...minObj, password: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Téléphone"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setMinObj({...minObj, phone_number: e.target.value})}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="NIS"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setMinObj({...minObj, nis: e.target.value})}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="NIF"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setMinObj({...minObj, nif: e.target.value})}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Code ordonnateur"
                        type="number"
                        fullWidth
                        variant="standard"
                        //InputLabelProps={{ shrink: true }}
                        onChange={e =>setMinObj({...minObj, codeOrdonnateur: e.target.value})}
                />
              </Grid>
              <Grid container justifyContent={"center"} item xs={4}>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <InputLabel>Fichier NIS :</InputLabel>
                  <input hidden onChange={e => handleselectedFile1(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {minObj?.nisFile?.name ?? ""}
                </span>
              </Grid>
              <Grid container justifyContent={"center"} item xs={4}>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <InputLabel>Fichier NIF	:</InputLabel>
                  <input hidden onChange={e => handleselectedFile2(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {minObj?.nifFile?.name ?? ""}
                </span>
              </Grid>
              <Grid container justifyContent={"center"} item xs={4}>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <InputLabel>Fichier code ordonnateur	:</InputLabel>
                  <input hidden onChange={e => handleselectedFile(e)} accept="application/pdf" type="file" />
                  <PictureAsPdfIcon />
                </IconButton>
                <span>
                  {minObj?.codeOrdonnateurFile?.name ?? ""}
                </span>
              </Grid>
            </Grid>


          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button onClick={handleCreate}>Ajouter</Button>
          </DialogActions>
        </Dialog>

    </Box>    
  )
}
