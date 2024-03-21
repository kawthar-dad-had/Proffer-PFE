import { Autocomplete, Box, Breadcrumbs, Button, Card, Chip, DataGrid, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Edit, Grid, GridActionsCellItem, GridColumns, GridFilterModel, IconButton, TextField, Typography, emphasize, styled, useDataGrid } from '@pankod/refine-mui'
import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useUpdate } from '@pankod/refine-core';
import { useNavigate, useParams } from '@pankod/refine-react-router-v6';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import { BACKENDINFO2 } from 'interfaces/common';
import Swal from 'sweetalert2';
import { axiosInstance } from 'App';
import { Visibility } from '@mui/icons-material';
import moment from 'moment';

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

const Lots = () => {
    const navigate = useNavigate()
    const {id} = useParams();
    const { dataGridProps} = useDataGrid({resource: 'offre/offres/details/'+id})
    
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
            field: 'domaine',
            headerName: 'Domaine',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'budget',
            headerName: 'Evaluation Financière',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'delai',
            headerName: 'Délai de réalisation',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'employes',
            headerName: 'Effectif',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'materiels',
            headerName: 'Materiels',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          
          {
            field: 'qualTech',
            headerName: 'Qualité des équipements',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'garantie',
            type: 'Garantie des équipements',
            headerName: 'Cahier des charges',
            flex: 1,
            minWidth: 100,
          }
        ],
        []
      );
      
      const [state, dispatch] = React.useReducer(reducer, initState);
      const [open, setOpen] = useState(false)
      const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

      //@ts-ignore
      const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
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
            `/offre/offres/details/${id}/?filters=${JSON.stringify(
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
                              onClick={() => { navigate("/offre")}}
                              label="Offres"
                              icon={<BusinessCenterIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                              component="a" 
                              href="#" 
                              onClick={() => { navigate("/offre/show")}}
                              label="Détails offre"
                              icon={<AddCardIcon fontSize="small" />}
                              />
                          </Breadcrumbs>
                        </div>
                      </Grid>
                      <Grid item mr={1} mt={1}>
                        <BusinessCenterIcon fontSize='large'/>
                      </Grid>
                      <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Les lots </Typography>
                      </Grid>
                      <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer vos offres</Typography>
                      <Grid item xs={12}>
                      <Typography mt={2}>L'evaluateur de cette offre est {(state?.rows[0]?.offre?.evaluateur?.first_name ?? "")+ " " + (state?.rows[0]?.offre?.evaluateur?.first_name ?? "")}</Typography>

                      </Grid>
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
        
    </Box>
  )
}

export default Lots

