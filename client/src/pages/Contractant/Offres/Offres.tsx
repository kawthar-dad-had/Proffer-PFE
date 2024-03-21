import { Autocomplete, Box, Breadcrumbs, Button, Card, Chip, DataGrid, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Edit, Grid, GridActionsCellItem, GridColumns, GridFilterModel, IconButton, TextField, Typography, emphasize, styled, useDataGrid } from '@pankod/refine-mui'
import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDelete, useUpdate } from '@pankod/refine-core';
import { useNavigate } from '@pankod/refine-react-router-v6';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import { BACKENDINFO2 } from 'interfaces/common';
import Swal from 'sweetalert2';
import { axiosInstance } from 'App';
import { villes } from 'contexts';
import ClearIcon from '@mui/icons-material/Clear';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
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

const Offre = () => {
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const { dataGridProps} = useDataGrid({resource: 'offre/offres/mes_offres'})
    const { mutate } = useUpdate();
    const {mutate: mutateDelete } = useDelete()

    useEffect(() => {
      const fetchOptions = async () => {
        const response = await axiosInstance.get("/offre/offres/auto/complete")
        setOptions(response.data.map((option:any)=> option.name))
      }
    
      fetchOptions()
    }, [])
    const columns = React.useMemo<GridColumns<any>>(
        () => [
          {
            field: 'name',
            headerName: 'Nom',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'dDay',
            headerName: 'Dernier délai',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
            valueGetter: (params) => moment(params.row.dDay).format("DD/MM/YYYY"),
          },
          {
            field: 'ville',
            headerName: 'Ville',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'Nombre_de_lots',
            headerName: 'Nombre de lots',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
            valueGetter: (params) => params.row.lots.length,
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
                <Chip label={params.row.state} sx={{color: "#FFAF22" , borderColor: "#FFAF22"}} variant="outlined"/>
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
              let cells = [
                <GridActionsCellItem
                    key={1}
                    label={"Cahier des charges"}
                    icon={<ListAltOutlinedIcon />}
                    onClick={() => window.open("http://41.111.227.13:8080/offre/uploads/"+params.row.cahierDesCharges)}
                    showInMenu
                />,
                <GridActionsCellItem
                    key={1}
                    label={"Détails offre"}
                    icon={<ListAltOutlinedIcon />}
                    onClick={() => navigate("/offre/show/"+params.row.id)}
                    showInMenu
                />,
              ]

              if(params.row.state !== 'En attente' && params.row.state !== 'Annulé' && params.row.state !== 'Non Approuvé') {
                cells =[...cells, <GridActionsCellItem
                  key={1}
                  label={"Annuler"}
                  icon={<CloseOutlinedIcon />}
                  onClick={() =>
                    Swal.fire({
                      title: 'Voulez vous annulez cette offre?',
                      showCancelButton: true,
                      confirmButtonText: 'Confirmer',
                      cancelButtonText: 'Annuler',
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        mutate({
                          resource: 'offre/offres',
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
                  }
                  showInMenu
              />,
            ]}

            if(params.row.state === 'En attente') {
                cells = [...cells, <GridActionsCellItem
                  key={1}
                  label={"Supprimer"}
                  icon={<CloseOutlinedIcon />}
                  onClick={() =>
                    Swal.fire({
                      title: 'Voulez vous supprimez cette offre?',
                      showCancelButton: true,
                      confirmButtonText: 'Confirmer',
                      cancelButtonText: 'Annuler',
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        mutateDelete({
                          resource: 'offre/offres',
                          id: params.row.id,
                        }, {
                          onError: () => {
      
                          },
                          onSuccess: () => {
                            getData()
                          }
                        })
                        
                      }
                    })
                  }
                  showInMenu
                />,
              ];
            }
            return cells
            }
          },
        ],
        []
      );
      
      const [state, dispatch] = React.useReducer(reducer, initState);

      const getData = () => {
        axiosInstance
          .get(
            `/offre/offres/mes_offres/?filters=${JSON.stringify(
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
            <Grid container mb={"20px"}>
                  <Grid container item xs={6} >
                      <Grid item xs={12}>
                        <div role="presentation" onClick={handleClick}>
                          <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                              component="a"
                              href="/offre/create"
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
                        {/*<BusinessCenterIcon fontSize='large'/>*/}
                        <LordIcon
                            src="https://cdn.lordicon.com/twprnhsj.json"
                            trigger="hover"
                            colors={{primary: '#08c18a', secondary: "#eee966"}}
                            size={40}
                        />
                      </Grid>
                      <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Offres</Typography>
                      </Grid>
                      <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer vos offres</Typography>
                  </Grid>
                  <Grid container height={3} item xs={6} justifyContent={'right'} mt={"20px"}>
                    <Button onClick={() => { navigate("/offre/create")}} sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Créer une offre</Button>
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
                  },'& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'success.main', // set the cell background color
                  },
                }}
              />
          </Card>
        </Grid>
        <Grid alignItems={"flex-start"} container item sx={{display:{xs: "none", md: "flex"}}} md={3}>
          <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
            <Grid container item xs={12} p={2}  >     
              <Typography variant='h4' sx={{fontWeight: "bold"}} >Filtrage</Typography>
              <Grid item xs={12}  mt={3}>
                <Autocomplete
                  disablePortal
                  sx={{height: 'fit-content'}}
                  fullWidth
                  freeSolo
                  size="small"
                  id="combo-box-demo"
                  options={options}
                  onChange={(event: any, newValue: any) => {
                    dispatch({
                      type: 'FILTER',
                      payload: [
                        {
                          columnField: "name",
                          operatorValue: "contains",
                          value: newValue ? newValue : "",
                        },
                      ],
                    });
                  }}
                  renderInput={(params) => 
                    <TextField 
                      sx={{"& .MuiInputBase-root": {height: 'fit-content'}}}  
                      {...params} 
                      label="Offre" 
                      InputProps={{
                        ...params.InputProps,
                      }}  
                    />}
                />
              </Grid>
              <Grid item xs={12}  mt={3}>
                <Autocomplete
                  disablePortal
                  sx={{height: 'fit-content'}}
                  fullWidth
                  freeSolo
                  size="small"
                  id="combo-box-demo"
                  options={villes}
                  onChange={(event: any, newValue: any) => {
                    dispatch({
                      type: 'FILTER',
                      payload: [
                        {
                          columnField: "ville",
                          operatorValue: "contains",
                          value: newValue?.label ? newValue.label : "",
                        },
                      ],
                    });
                  }}
                  renderInput={(params) => 
                    <TextField 
                      sx={{"& .MuiInputBase-root": {height: 'fit-content'}}}  
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        
                      }}
                      label="Ville" />}
                />
              </Grid>

              <Grid   item xs={12} mt={3}>
                <Button fullWidth  onClick={() => { navigate("/offre/create")}} sx={{ fontSize: 17, color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "#fff", color: "primary.main"} }}>Filtrer</Button>
              </Grid>
                
            </Grid> 
          </Card>
    
        </Grid>
      </Grid>


    </Box>
  )
}

export default Offre

