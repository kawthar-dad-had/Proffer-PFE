
import { Card, Grid, IconButton, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const optionsLine = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const optionsBar = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May'];

const dataLine = {
  labels,
  datasets: [
    {
      label: 'Contractants Privés',
      data: [34,35,353,35,35],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Soumissionnaire',
      data: [34,398,353,35,35],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
const dataBar = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [34,35,353,35,35],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};
const dataPie = {
  labels: [
    "Ministère de l'Intérieur",
    "Ministère des Finances",
    "Ministère de la Santé",
    "Ministère de l'Éducation",
    "Ministère de la Justice",
    "Ministère de l'Agriculture",
  ],
  datasets: [
    {
      label: '# Nombre',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
export const Dashboard = () => {
  return (
  <Grid container spacing={2} minHeight={"100%"} >

      {/*
      <Grid container  item xs={12} mt={1} mb={1}>
        <Grid item mr={1} mt={1}>
            <IconButton>
              <DashboardOutlinedIcon/>
            </IconButton>
        </Grid>
        <Grid item xs={10}  mt={1}>
          <Typography variant="h4">Gestion des statistiques</Typography>
        </Grid>
      </Grid>
      */}
      <Grid  item xs={12}  md={8}   >
        <Card   sx={{ bgcolor: 'success.main', padding: '10px'}}>
          <Typography variant='h5' mt={1} sx={{fontWeight: "bold"}}> Nombre d'utilisateurs</Typography>
          <Line style={{marginTop: 10}}  options={optionsLine} data={dataLine} />
        </Card>
      </Grid>

      <Grid  item xs={12} md={4} >
        <Card sx={{ bgcolor: 'success.main', padding: '10px', minHeight:"100%"}}>
          <Typography variant='h5' mt={1} sx={{fontWeight: "bold"}}>Nombre d'établissements</Typography>
          <Pie style={{marginTop: 30}}  data={dataPie} />
        </Card>
      </Grid>

      <Grid   item xs={12} md={12}>
        <Card sx={{ bgcolor: 'success.main', padding: '10px'}}>
          <Typography variant='h5' mt={1} sx={{fontWeight: "bold"}}>Nombre de ministères</Typography>
          <Bar  style={{marginTop: 10}}  options={optionsBar} data={dataBar} />
        </Card>
      </Grid> 
  </Grid>
  );
};
