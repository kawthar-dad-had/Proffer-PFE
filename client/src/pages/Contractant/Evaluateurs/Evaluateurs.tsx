import { Card, Grid, Typography, Button, TextField, IconButton, Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { useCreate, useDelete } from '@pankod/refine-core';
import { useDataGrid, GridColumns, DataGrid } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';
import React, { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Swal from 'sweetalert2';
import { BACKENDINFO } from 'interfaces/common';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { axiosInstance } from 'App';

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

const initState: BACKENDINFO = {
  page: 0,
  pageSize: 10,
  total: 20,
  filter: [],
  sort: [],
  rows: [],
  refresh: false,
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

const Evaluateurs = () => {
  const navigate = useNavigate()
  const [smallCard, setSmallCard] = useState(false)
  const [smallCard1, setSmallCard1] = useState(false)
  const { dataGridProps} = useDataGrid({resource: 'auth/users/evaluateurs'})
  
  const { mutate: deleteEval } = useDelete();
  const { mutate: create } = useCreate();
  const [evaluateur, setEvaluateur] = useState<any>({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmed_password: "",
  })
  const disabled = (Object.keys(evaluateur).length === 6) ?
  (evaluateur.first_name !== "" && evaluateur.last_name !== "" && evaluateur.phone_number !== "" && evaluateur.email !== "" && evaluateur.password !== "" && evaluateur.confirmed_password !== "" && evaluateur.confirmed_password === evaluateur.password)
  : false

  const handleCreate = () => {
    
    create(
      {
          resource: `auth/users/evaluateur`,
          values: evaluateur,
      },
      {
          onError: (error, variables, context) => {
            console.log(error);
              // An error occurred!
              Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
          },
          onSuccess: (data, variables, context) => {
              // Let's celebrate!
              getData()
              setSmallCard(false)
          },
      },
  );
  }

  const columns = React.useMemo<GridColumns<any>>(
      () => [
        {
          field: 'last_name',
          headerName: 'Nom',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
        },
        {
          field: 'first_name',
          headerName: 'Prénom',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
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
          renderCell: (params) => {
            return(
              <Chip label={params.row.phone_number} sx={{color: "#FFAF22" , borderColor: "#FFAF22"}} variant="outlined"/>
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
          getActions: ({ id }) => [
  
            <EditIcon
              onClick={() =>
                deleteEval({
                  resource: 'dashboard',
                  id,
                  values: {
                    status: {
                      id: 5,
                      text: 'Cancelled',
                    },
                  },
                })
              }
            />,
            <DeleteIcon
              sx={{ color: "red" }}
              onClick={() =>
                Swal.fire({
                  title: 'Voulez vous supprimez ce lot?',
                  showCancelButton: true,
                  confirmButtonText: 'Supprimer',
                  cancelButtonText: 'Annuler',
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    deleteEval({
                      resource: 'auth/users/evaluateurs',
                      id: id,
                    },{
                      onError: (error, variables, context) => {
                          // An error occurred!
                      },
                      onSuccess: (data, variables, context) => {
                          // Let's celebrate!
                          getData()
                      },
                  },)
                    
                  }
                })
              }
            />,
          ],
        },
      ],
      []
    );

    const [state, dispatch] = React.useReducer(reducer, initState);

    const getData = () => {
      axiosInstance
        .get(
          `/auth/users/evaluateurs/?filters=${JSON.stringify(
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

    const handleEvaluation = () => {
      setSmallCard(true)
    }
    const handleAnnuler = () => {
      setSmallCard(false  )
    }
    
    
  return (
    <Grid container sx={{ height: 400, width: "100%"   }} spacing={1}>
      <Grid item xs={smallCard ? 6 : 12}>
        <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
          <Grid container mb={"20px"}>
                <Grid container item xs={6} >
                  <Grid item xs={12}>
                    <div role="presentation" onClick={handleClick}>
                      <Breadcrumbs aria-label="breadcrumb">
                        <StyledBreadcrumb
                          component="a"
                          href="#"
                          label="Evaluateurs"
                          icon={<GroupIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb component="a" href="#" label="Ajouter un evaluateur" />
                      </Breadcrumbs>
                    </div>
                  </Grid>
                  <Grid item mr={1} mt={1}>
                    <GroupIcon fontSize='large'/>
                  </Grid>
                  <Grid item xs={10} mt={1}>
                    <Typography variant="h4">Les evaluateurs</Typography>
                  </Grid>
                  <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer les evaluateurs</Typography>
                </Grid>
                <Grid container height={3} item xs={6} justifyContent={'right'} mt={"20px"}>
                  <Button onClick={handleEvaluation} sx={{ml:'10px',borderRadius: "10px", color: 'white', bgcolor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Ajouter un evaluateur</Button>
                </Grid>
            </Grid>
            <DataGrid
              {...dataGridProps}
              sortingMode="server"
              filterMode="server"
              onFilterModelChange={(data) => {
                dispatch({ type: 'FILTER', payload: data.items });
              }}
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
              filterModel={undefined}
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

      {smallCard1 ?
          <Grid item xs={6}>
            <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
              <Grid container mb={"20px"}>
                  <Grid item xs={12}>
                    <div role="presentation" onClick={handleAnnuler}>
                      <Breadcrumbs aria-label="breadcrumb">
                        <StyledBreadcrumb
                          component="a"
                          href="#"
                          label="Evaluateurs"
                          icon={<GroupIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb component="a" href="#" label="Ajouter un evaluateur" />
                      </Breadcrumbs>
                    </div>
                  </Grid>
                  <Grid item xs={10} mt={1}>
                      <Typography variant="h5">Ajouter un evaluateur</Typography>
                  </Grid>
                  <Grid container item xs={2} justifyContent={'right'} >
                    <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => navigate("/evaluateur/create")}>
                      <ZoomOutMapIcon />
                    </IconButton>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nom"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, last_name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Prénom"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, first_name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, email: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, password: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="confirmer le mot de passe"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, confirmed_password: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Numero de Téléphone"
                        type="phone"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, phone_number: e.target.value})}
                        />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent={'right'} mt={"20px"}>
                    <Button onClick={handleAnnuler}  sx={{ml:'10px',borderRadius: "10px", color: 'white', bgcolor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Annuler</Button>
                    <Button onClick={handleCreate} disabled={!disabled}  sx={{ml:'10px',borderRadius: "10px", color: 'white', bgcolor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Valider</Button>
                  </Grid>
                </Grid>
            </Card>
          </Grid>
          
      :null}
            {smallCard ?
          <Grid item xs={6}>
            <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
              <Grid container mb={"20px"}>
                  <Grid item xs={12}>
                    <div role="presentation" onClick={handleAnnuler}>
                      <Breadcrumbs aria-label="breadcrumb">
                        <StyledBreadcrumb
                          component="a"
                          href="#"
                          label="Evaluateurs"
                          icon={<GroupIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb component="a" href="#" label="Modifier les informations" />
                      </Breadcrumbs>
                    </div>
                  </Grid>
                  <Grid item xs={10} mt={1}>
                      <Typography variant="h5">Modifier les informations</Typography>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nom"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, last_name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Prénom"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, first_name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, email: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, password: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="confirmer le mot de passe"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, confirmed_password: e.target.value})}
                        />
                        
                    </Grid>
                    <Grid container alignItems={"center"} justifyContent={"center"} mt={2} item xs={2}>
                      <Button onClick={handleAnnuler}  sx={{ml:'10px',borderRadius: "10px", color: 'white', bgcolor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Modifier</Button>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Numero de Téléphone"
                        type="phone"
                        fullWidth
                        variant="standard"
                        onChange={e => setEvaluateur({...evaluateur, phone_number: e.target.value})}
                        />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} justifyContent={'right'} mt={"20px"}>
                    <Button onClick={handleAnnuler}  sx={{ml:'10px',borderRadius: "10px", color: 'white', bgcolor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Annuler</Button>
                    <Button onClick={handleCreate} disabled={!disabled}  sx={{ml:'10px',borderRadius: "10px", color: 'white', bgcolor: "primary.main",":hover": {bgcolor: "success.main", color: "primary.main"} }}>Valider</Button>
                  </Grid>
                </Grid>
            </Card>
          </Grid>
          
      :null}
    </Grid>
  )
}

export default Evaluateurs
