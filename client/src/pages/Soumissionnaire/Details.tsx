import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Breadcrumbs, Button, Card, Chip, Container, Grid, TableFooter, Typography, emphasize, styled } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useNavigate, useParams } from '@pankod/refine-react-router-v6';
import { useOne } from '@pankod/refine-core';
import { makeStyles } from '@mui/styles'
import SoumissionDialog from 'components/common/SoumissionDialog';

//@ts-ignore
/*function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}*/

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
  
  const useStyles: any = makeStyles({
    verticalTable: {
      display: 'flex',
      flexDirection: 'column',
    },
  });

const Details = () => {
  const classes = useStyles();
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useOne({
    resource: "soumission/offres",
    id: id as string,
  });

  //const [rows, setRows] = React.useState<any[]>([])

  const rows = data?.data?.lots ?? []

  const keyMapping = {
    domaine: 'Domaine',
    budget: 'Evaluation financière',
    delai: 'Délai de réalisation',
    garantie: 'Garantie des équipements',
    qualTech: 'Caractéristiques qualitatives des équipements',
    materiels: 'Le matériel et équipement',
    employes: "L'effectif",
  };

  // Transpose the data by mapping the new keys to their respective values in each object
  const transposedData = Object.entries(keyMapping).map(([oldKey, newKey]) => ({
    [newKey]: rows.map((obj: any) => obj[oldKey])
  }));
  const [show, setShow] = React.useState<boolean>(false)
  const [lotId, setLotId] = React.useState(0)
  
  const handleDialogClose = () => {
    setShow(false);
  };

  const handleShowDialog = (id: any) => {
    console.log(id);
    setLotId(id)
    setShow(true)
  }
  /*React.useEffect(() => {
    console.log(data);
    setRows(data?.data.lots)
  }, [data])
*/
  return (
    <Box sx={{ width: '100%' }}>
    <Grid container   >
        <Card sx={{ bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
            <Grid container sx={{ paddingX: 2}}>
                <Grid item xs={6}>
                <div role="presentation" >
                    <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb
                        component="a"
                        onClick={() => {
                          navigate(`/accueil/`)
                        }} 
                        label="Accueil"
                        icon={<BusinessCenterIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a" 
                        href="accueil/details" 
                        label="Détails offre"
                        icon={<AddCardIcon fontSize="small" />}
                        />
                    </Breadcrumbs>
                </div>
                </Grid>
                <Grid container height={3} item xs={6} justifyContent={'right'} mt={"20px"}>
                    <Button onClick={() => window.open("http://41.111.227.13:8080/offre/uploads/"+data?.data?.cahierDesCharges)} sx={{marginLeft: 2, marginRight: 5,borderRadius: "15px" , backgroundColor: "primary.main" , color: "success.main",":hover": {backgroundColor: "#E6F9F3", color: "primary.main"} }}>Cahier des charges</Button>
                </Grid>
                <Grid item xs={12} mb={3}><Typography variant='h4' color="primary.main">{data?.data?.name}</Typography></Grid>
                <Grid item xs={6} sx={{display: "flex" , justifyContent: "center" , color: "text.secondary"}} mb={3}><Typography>{data?.data?.description}</Typography></Grid>
                <Grid item xs={12}>
                <TableContainer  component={Paper}sx={{bgcolor: "success.main" }} >
        <Table  aria-label="simple table">
            <TableHead sx={{bgcolor: "#E6F9F3" }}>
            <TableRow >
                <TableCell sx={{ fontWeight: "bold" , fontSize: 17}}>Règle</TableCell>
                {rows.map((row: any) => (
                  <TableCell sx={{ fontWeight: "bold", fontSize: 17}} align="center">{row.name}</TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {transposedData.map((row: any) => (
                <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell align="center" sx={{ fontWeight: "bold"}}>{Object.keys(row)[0]}</TableCell>
                {row[Object.keys(row)[0]].map((r: any) => (
                  <TableCell align="center" sx={{ fontWeight: "bold"}}>{r}</TableCell>
                ))}
                </TableRow>
            ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>
                    </TableCell>
                    {rows.map((row: any) => (
                      <TableCell align="center" >
                        <Button onClick={() => handleShowDialog(row.id)} sx={{marginLeft: 2, marginRight: 5,borderRadius: "15px" , width: "80%", backgroundColor: "#E6F9F3",":hover": {backgroundColor: "#fff", color: "primary.main"} }}>Soumissionner</Button>
                      </TableCell>
                    ))}
                </TableRow>
            </TableFooter>
        </Table>
        </TableContainer>
        </Grid>
            </Grid>

        </Card>
    </Grid>
    <SoumissionDialog in={{show: show, lotId: lotId}}  onClose={handleDialogClose}/>
    </Box>
  )
}

export default Details
