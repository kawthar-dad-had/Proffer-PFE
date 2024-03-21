import { Autocomplete, Box, Breadcrumbs, Button, Card, Chip, DataGrid, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Edit, Grid, GridActionsCellItem, GridColumns, GridFilterModel, IconButton, InputLabel, Stack, TextField, Typography, emphasize, styled, useDataGrid } from '@pankod/refine-mui'
import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useUpdate } from '@pankod/refine-core';
import { useNavigate } from '@pankod/refine-react-router-v6';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import { BACKENDINFO2 } from 'interfaces/common';
import Swal from 'sweetalert2';
import { axiosInstance } from 'App';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { domaines } from 'contexts';
import moment from 'moment';
import { LordIcon } from 'components/common/lord-icon';

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
        filterModel: createFilterModelFromFilters(action.payload),
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
}

const RendezVous = () => {
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const {mutate} = useUpdate()
    const { dataGridProps} = useDataGrid({resource: 'offre/rdvs'})
    const [rdv, setRdv] = useState({
      id: "",
      offreId: "",
      date: "",
      hour: "",
      adresse: ""
    })

    const [mode, setMode] = useState("")
    useEffect(() => {
      const fetchOptions = async () => {
        const response = await axiosInstance.get("/offre/offres/lots/auto/complete")
        setOptions(response.data.map((option:any)=> ( {label: option.name, id: option.id})))
      }
    
      fetchOptions()
    }, [])
    const columns = React.useMemo<GridColumns<any>>(
        () => [
          {
            field: 'offre',
            headerName: 'Offre',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
            valueGetter(params) {
              return params?.row?.offre?.name ?? ""
            },
          },
          {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'hour',
            headerName: 'Heure',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'adresse',
            headerName: 'Adresse',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'state',
            headerName: 'Etat',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
              return(
                <Chip label={params.row.state}   sx={{color: "#FFAF22" , borderColor: "#FFAF22"}} variant="outlined"/>
              )
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
              let cells: any[] = []
              
              if(new Date(`${params.row.date}T${params.row.hour}:00`) <= new Date() && params.row.state === "Validé") {  
                cells = [ ...cells,<GridActionsCellItem
                  key={1}
                  label={"Résultat"}
                  icon={<PointOfSaleOutlinedIcon />}
                  onClick={() => {
                    Swal.fire({
                      title: 'Voulez vous lancez ce rendez-vous?',
                      showCancelButton: true,
                      confirmButtonText: 'Confirmer',
                      cancelButtonText: 'Annuler',
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        mutate({
                          resource: 'soumission/close',
                          id: params.row.offreId,
                          values: {},
                        }, {
                          onError: () => {
      
                          },
                          onSuccess: () => {
                            getData()
                            navigate(`/rendezvous/show/${params.row.offreId}`)
                          }
                        })
                        
                      }
                    })
                    
                  }}
                  showInMenu
              />]
              }
              if(new Date(`${params.row.date}T${params.row.hour}:00`) > new Date() && params.row.state === "Validé") {
                cells = [ ...cells,<GridActionsCellItem
                    key={1}
                    label={"Annuler"}
                    icon={<DeleteOutlineOutlinedIcon />}
                    onClick={() => {
                      Swal.fire({
                        title: 'Voulez vous annulez ce rendez-vous?',
                        showCancelButton: true,
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          mutate({
                            resource: 'offre/rdvs/cancel',
                            id: params.row.id,
                            values: {},
                          }, {
                            onError: () => {
        
                            },
                            onSuccess: () => {
                              getData()
                            }
                          })
                          
                        }
                      })
                    }}
                    showInMenu
                />]
              }

              if(new Date(`${params.row.date}T${params.row.hour}:00`) > new Date() && params.row.state === "Validé"){
                  cells = [ ...cells,<GridActionsCellItem
                  key={1}
                  label={"Modifier"}
                  icon={<ModeEditOutlineOutlinedIcon />}
                  onClick={() => {
                    console.log(params.row);
                    setRdv({
                      id: params.row.id,
                      date: params.row.data,
                      hour: params.row.hour,
                      adresse: params.row.adresse,
                      offreId: params.row.offreId
                    })
                    setOpen(true);
                    setScroll('paper');
                    setMode('patch')
                    //handleClickOpen('paper','patch')
                  }}
                  showInMenu
                />]
              }

              return cells;
              

            }
          }
        ],
        []
      );
      
      const [state, dispatch] = React.useReducer(reducer, initState);
      const [open, setOpen] = useState(false)
      const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

      //@ts-ignore
      const handleClickOpen = (scrollType, mode) => () => {
        setOpen(true);
        setScroll(scrollType);
        setMode(mode)
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleSubmit = () => {
        console.log(rdv);
        if (mode === 'post') {
          axiosInstance.post('/offre/rdvs/', rdv).then(() => {
            setOpen(false);
            setRdv({
              id: "",
              offreId: "",
              date: "",
              hour: "",
              adresse: ""
            })
            getData()
          })
        } else if (mode === 'patch') {
          axiosInstance.patch(`/offre/rdvs/${rdv.id}`, rdv).then(() => {
            setOpen(false);
            setRdv({
              id: "",
              offreId: "",
              date: "",
              hour: "",
              adresse: ""
            })
            getData()
          })
        }
      }
    
      const descriptionElementRef = React.useRef<HTMLElement>(null);
      React.useEffect(() => {
        if (open) {
          const { current: descriptionElement } = descriptionElementRef;
          if (descriptionElement !== null) {
            descriptionElement.focus();
          }
        }
      }, [open]);
      const getData = () => {
        axiosInstance
          .get(
            `/offre/rdvs/?filters=${JSON.stringify(
              state.filter
            )}&sorts=${JSON.stringify(state.sort)}&size=${state.pageSize}&page=${
              state.page
            }`,
            { withCredentials: true }
          )
          .then((res: any) => {
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
        getData();
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
      
      function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
      }

      
      
  return (
    <Box sx={{ width: '100%'  }}>
          <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
            <Grid container mb={"20px"}>
                  <Grid container item xs={6} >
                      <Grid item xs={12}>
                        <div role="presentation" onClick={handleClick}>
                          <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                              component="a"
                              href="/offre/create"
                              onClick={() => { navigate("/rendezvous")}}
                              label="Rendez-Vous"
                              icon={<Groups3OutlinedIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                              component="a" 
                              href="#" 
                              onClick={() => { navigate("/rendezvous/show")}}
                              label="Résultat"
                              icon={<PointOfSaleOutlinedIcon fontSize="small" />}
                              />
                          </Breadcrumbs>
                        </div>
                      </Grid>
                      <Grid item mr={1} mt={1}>
                        <Groups3OutlinedIcon fontSize='large'/>
                      </Grid>
                      <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Les rendez-vous </Typography>
                      </Grid>
                      <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer vos rendez-vous</Typography>
                      <Grid item xs={12}>
                          <Typography mt={2} sx={{color: "text.secondary"}}>
                          <LordIcon
                            src="https://cdn.lordicon.com/puvaffet.json"
                            trigger="hover"
                            colors={{primary:"#121331",secondary:"#08a88a"}}
                          />
                          Des notifications seront envoyées aux soumissionnaires en cas de création, d'annulation ou de modification d'un rendez-vous.</Typography>
                      </Grid>
                  </Grid>
                  <Grid container height={3} item xs={6} justifyContent={'right'} mt={"20px"}>
                    <Button onClick={handleClickOpen('paper','post')} sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "#fff", color: "primary.main"} }}>Créer un Rendez-vous</Button>
                  </Grid>
              </Grid>
              <DataGrid
                {...dataGridProps}
                sortingMode="server"
                filterMode="server"
                onSortModelChange={(data) =>
                  dispatch({
                    type: 'SORT',
                    payload: [[data[0].field, data[0].sort?.toLocaleUpperCase()]],
                  })
                }
                pagination
                paginationMode="server"
                onPageChange={(data) => dispatch({ type: 'PAGE', payload: data })}
                onPageSizeChange={(data) =>
                  dispatch({ type: 'PAGESIZE', payload: data })
                }
                rows={state.rows}
                rowCount={state.total}
                page={state.page}
                pageSize={state.pageSize}
                columns={columns}
                filterModel={state.filterModel}
                autoHeight
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{
                  ...dataGridProps.sx,
                  '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                    bgcolor: 'success.main', 
                  },'& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'success.main', // set the cell background color
                  },
                }}
              />
          </Card>
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle color={"primary.main"} id="scroll-dialog-title">
              <Grid container justifyContent={"center"}>
                    <Groups3OutlinedIcon fontSize='large'/>
                    <Typography variant="h5" ml={1}>Creation d'un Rendez-vous</Typography>
              </Grid>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
            <Grid container justifyContent={"center"} spacing={1}>
              <Grid item xs={4}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    id="combo-box-demo"
                    options={options}
                    defaultValue={options.find((option: any) => option.id === rdv.offreId)}
                    onChange={(event, newValue) => {
                      //@ts-ignore
                      setRdv({...rdv, offreId: newValue?.id ?? null});
                    }}
                    renderInput={(params) => <TextField variant='standard' margin="dense" {...params} label="Offre" />}
                  />
              </Grid>
              <Grid item xs={3}>
                <TextField
                      autoFocus
                      //inputProps={{ min: new Date().toISOString().slice(0, 10), max: dDay }}
                      margin="dense"
                      id="name"
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      variant="standard"
                      defaultValue={rdv.date}
                      onChange={e =>setRdv({...rdv, date: moment(e.target.value).format("YYYY-MM-DD")})}
                    />
              </Grid>
              <Grid item xs={3}>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Heure"
                type="time"
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                defaultValue={rdv.hour}
                onChange={e =>setRdv({...rdv, hour: e.target.value})}
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Adresse"
                      type="text"
                      fullWidth
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      defaultValue={rdv.adresse}
                      onChange={e =>setRdv({...rdv, adresse: e.target.value})}
                    />
              </Grid>

            </Grid>
              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button onClick={handleSubmit}>{(mode === 'post')? 'Créer' : (mode === 'patch' )? 'Mettre à jour': null}</Button>
            </DialogActions>
          </Dialog>
    </Box>
  )
}

export default RendezVous

