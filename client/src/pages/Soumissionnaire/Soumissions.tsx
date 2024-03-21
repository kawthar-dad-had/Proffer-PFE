import { Box, Card, Grid, Typography, Button, Breadcrumbs, Chip, emphasize, styled } from '@mui/material'
import { useDelete } from '@pankod/refine-core'
import { DataGrid, GridColumns, useDataGrid } from '@pankod/refine-mui'
import { useNavigate } from '@pankod/refine-react-router-v6'
import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import moment from 'moment'
import { axiosInstance } from 'App'
import { useState, useEffect } from 'react'

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


const Soumission = () => {
  const navigate = useNavigate()
  const { dataGridProps} = useDataGrid({resource: 'soumission/owner'})
  
  const [rows, setRows] = useState<any>([])
  
  useEffect(() => {
    let updatedRows: any = [];
    console.log(dataGridProps.rows);
    for (let i = 0; i < dataGridProps.rows.length; i++) {
      axiosInstance.get("soumission/offres/lot/" + dataGridProps.rows[i].lotId).then((res1) => {
        axiosInstance.get("auth/users/user/" + dataGridProps.rows[i].owner).then((res2) => {
          const updatedRow = {
            ...dataGridProps.rows[i],
            offre: res1?.data?.offre?.name ?? "",
            lot_name: res1?.data?.name ?? "",
            dernierDelai: res1?.data?.offre?.dDay ?? "",
            contractant: res1?.data?.offre?.user?.inscription?.nom ?? "",
            entreprise: res2?.data?.inscription.nom ?? ""
          };
          updatedRows.push(updatedRow);
          if (i === dataGridProps.rows.length - 1) {
            setRows(updatedRows);
          }
        });
      });
    }
  }, [dataGridProps.rows, setRows]);

  const { mutate } = useDelete();
  const columns = React.useMemo<GridColumns<any>>(
      () => [
        {
          field: 'offre',
          headerName: 'Offre',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
        },
        {
          field: 'lot_name',
          headerName: 'Lot',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
        },
        {
          field: 'entreprise',
          headerName: 'Soumissionnaire',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
        },
        {
          field: 'contractant',
          headerName: 'Contractant',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
        },
        {
          field: 'dateDepot',
          headerName: 'Date de soumission',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
          valueGetter(params) {
            return moment(parseInt(params.row.dateDepot)).format("DD/MM/YYYY")
          },
        },
        {
          field: 'state',
          headerName: 'Etat',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
        },
        {
          field: 'dernierDelai',
          headerName: 'Dernier Delai',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          minWidth: 100,
          valueGetter(params) {
            return moment(params.row.dernierDelai).format("DD/MM/YYYY")
          },
        },

  
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          flex: 1,
          minWidth: 100,
          sortable: false,
          getActions: (params) => [
  
            <VisibilityIcon
              sx={{ color: "red" }}
              onClick={() => {
                window.open("http://41.111.227.13:8080/soumission/uploads/"+params.row.infos.cahierDesCharges)
              }}
            />,
          ],
        },
      ],
      []
    );
  return (
    <Box sx={{ height: 400, width: '100%'  }}>
      <Card style={{background: '#fff', marginTop: '5px', padding: '10px'}}>
        <Grid container mb={"20px"}>
                <Grid container item xs={6} >
                <Grid item xs={12}>
                    <div role="presentation" onClick={handleClick}>
                      <Breadcrumbs aria-label="breadcrumb">
                        <StyledBreadcrumb
                          component="a"
                          href="#"
                          label="Soumissions"
                          icon={<AllInboxIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb component="a" href="#" label="Details soumission" />
                      </Breadcrumbs>
                    </div>
                  </Grid>
                  <Grid item mr={1} mt={1}>
                    <AllInboxIcon fontSize='large'/>
                  </Grid>
                  <Grid item xs={10} mt={1}>
                    <Typography variant="h4">Soumissions</Typography>
                  </Grid>
                  <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser les soumissions</Typography>
                </Grid>
              <Grid container item xs={6} justifyContent={'right'} mt={"20px"}>
          </Grid>
          </Grid>
          <DataGrid
            rows={rows}
            columns={columns}
            sortingMode="client"
            filterMode="client"
            rowsPerPageOptions={[10, 25]}
            pagination
            filterModel={undefined}
            autoHeight
            paginationMode="client"
            sx={{
              ...dataGridProps.sx,
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },'& .MuiDataGrid-columnHeaders': {
                bgcolor: '#fff', // set the cell background color
              },
            }}
          />
      </Card>

    </Box>
  )
}

export default Soumission
