import { Backdrop, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, Chip, CircularProgress, Grid, IconButton, Link, Typography, emphasize, styled } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useEffect, useState } from 'react';
import { Masonry } from '@mui/lab';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AddCardIcon from '@mui/icons-material/AddCard';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate, useParams } from '@pankod/refine-react-router-v6';
import { useOne } from '@pankod/refine-core';
import moment from 'moment';
import { axiosInstance } from 'App';
import SoumissionDialog from 'components/common/SoumissionDialog';

const Soumission = () => {
  const [lot , setLot] = useState(false)
  const navigate = useNavigate()
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
  }) as typeof Chip;

  const { id } = useParams();

  const { data, isLoading, isError, refetch } = useOne({
    resource: "soumission/offres/lot",
    id: id as string,
  });

  const [lotDetail, setLotDetail] = useState();
  let [lots, setLots] = useState([])
  
  const [isLoading1, setIsLoading1] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    //@ts-ignore
    setLotDetail(data?.data ?? {})
    //@ts-ignore
    setLots(data?.data?.offre?.lots?.filter((obj: any) => obj.id !== data?.data?.id ?? -1) ?? [])
  },[data])
  useEffect(() => {
    // scroll to top of the page when the route changes
    window.scrollTo(0, 0);
    setIsLoading1(true);
    const timeoutId = setTimeout(() => {
      setIsLoading1(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [location]);

  const handleAddFav = (id: number) => {
    axiosInstance.post("/soumission/favoris", {lotId: id}).then(() => {
      setLotDetail(lots[1])
      setLots(lots.filter((lot: any) => lot.id !== id));
      lots = lots.filter((lot: any) => lot.id !== id);
      refetch()
    })
  }
  
  const handleRemoveFav = (id: number) => {
    axiosInstance.delete(`/soumission/favoris/${id}`).then(() => {
      setLotDetail(lots[1])
      setLots(lots.filter((lot: any) => lot.id !== id));
      refetch()
    })
  }

  const [show, setShow] = useState<boolean>(false)
  const [lotId, setLotId] = useState(0)
  const handleDialogClose = () => {
    setShow(false);
  };
  
  const handleShowDialog = (id: any) => {
    setLotId(id)
    setShow(true)
  }

  useEffect(() => {
    refetch();
  }, [lots, lotDetail]);

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
      <Grid container  spacing={2}>
        <Backdrop open={isLoading1}><CircularProgress sx={{color:"primary.main"}} /></Backdrop>
        <Grid item xs={12}>
          <Card style={{ background: 'success.main', padding: '10px'}}>
              <Grid container spacing={1} mb={"20px"}>
                  <Grid container item xs={6} >
                      <Grid item xs={12}>
                        <div role="presentation" >
                          <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                              component="a"
                              href="/offre/create"
                              label="Accueil"
                              icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                              component="a" 
                              href="#" 
                              label="Details lot"
                              icon={<AddCardIcon fontSize="small" />}
                              />
                          </Breadcrumbs>
                        </div>
                      </Grid>
                      <Grid item mr={1} mt={1}>
                        <HelpCenterIcon fontSize='large'/>
                      </Grid>
                      <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Information </Typography>
                      </Grid>
                      <Typography color={"#a9afb9"} fontSize={"13px"}>Toutes les informations sur le lot</Typography>
                  </Grid>
                  <Grid container item xs={8}>
                    <Card style={{ background: 'success.main', marginTop: '5px', padding: '10px', width: "100%"}}>
                      <Grid container spacing={"space-between"}>
                        <Grid item xs={10}>
                          <Typography variant="h4">Lot</Typography>
                        </Grid>
                        <Grid container justifyContent={"right"} item xs={2}>
                          <IconButton aria-label="add to favorites">
                            {/*@ts-ignore*/}
                            {lotDetail?.favorite ?? false ?  <FavoriteIcon onClick={() => {handleRemoveFav(lotDetail.id)}}  sx={{color: "primary.main"}}  /> : <FavoriteBorderIcon onClick={() => {handleAddFav(lotDetail.id)}} sx={{color: "primary.main"}}  /> }
                          </IconButton>
                          <IconButton >
                            <CheckCircleOutlineIcon fontSize="large" sx={{color: "primary.main"}}  />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Typography color={"#a9afb9"} fontSize={"13px"}>Entreprise</Typography>
                      <Grid container>
                        <Grid item>
                        <Typography  mr={1}>Nom de lot :</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          {/*@ts-ignore*/}
                          <Typography color="text.secondary" variant="body2">{lotDetail?.name ?? ""}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item>
                        <Typography  mr={1}>Le dernier délai :</Typography>
                        </Grid>
                        <Grid item xs={9}>
                        {/*@ts-ignore*/}
                          <Typography color="text.secondary" variant="body2">{moment(lotDetail?.dernierDelai ?? "").format("DD/MM/YYYY HH:mm:ss")}</Typography>
                        </Grid>
                      </Grid>
                      <Typography>Description :</Typography>
                      <Typography  variant="body2" color="text.secondary">
                        {/*@ts-ignore*/}
                        {lotDetail?.description ?? ""}
                      </Typography>
                        <Grid container mt={5} spacing={2} justifyContent={"center"} >
                          <Grid container item justifyContent={"center"} xs={4}>
                            <Card sx={{ 
                              width: 170,
                              height: "fit-content",
                              backgroundColor: "success.main",
                              textAlign: "center",
                              borderRadius: "20px",
                              boxShadow: 10,
                              '&:hover': {
                                color: "success.main",
                                backgroundColor: "primary.main"
                              },
                            }}>
                              <CardContent >
                                <Typography variant='body2' fontSize={17} mb={1}>Nombre de salariés</Typography>
                                {/*@ts-ignore*/}
                                <span style={{fontWeight: "bold", fontSize: 20 , color: "primary.main"}}>{lotDetail?.nbSalaries ?? ""}</span>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid container item justifyContent={"center"} xs={4}>
                            <Card sx={{ 
                              width: 170,
                              height: "fit-content",
                              backgroundColor: "success.main",
                              textAlign: "center",
                              borderRadius: "20px",
                              boxShadow: 10,
                              '&:hover': {
                                color: "success.main",
                                backgroundColor: "primary.main"
                              },
                            }}>
                              <CardContent >
                                <Typography variant='body2' fontSize={17} mb={1}>Nombre de matériels</Typography>
                                {/*@ts-ignore*/}
                                <span style={{fontWeight: "bold", fontSize: 20 , color: "primary.main"}}>{lotDetail?.nbMateriels ?? ""}</span>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid container item justifyContent={"center"} xs={4}>
                            <Card sx={{ 
                              width: 170,
                              height: "fit-content",
                              backgroundColor: "success.main",
                              textAlign: "center",
                              borderRadius: "20px",
                              boxShadow: 10,
                              '&:hover': {
                                color: "success.main",
                                backgroundColor: "primary.main"
                              },
                            }}>
                              <CardContent >
                                <Typography variant='body2' fontSize={17} mb={1}>Nombre de soumissions</Typography>
                                <span style={{fontWeight: "bold", fontSize: 20 , color: "primary.main"}}>12</span>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid container mt={2} item justifyContent={"center"} xs={4}>
                            <Card sx={{ 
                              width: 170,
                              height: "fit-content",
                              backgroundColor: "success.main",
                              textAlign: "center",
                              borderRadius: "20px",
                              boxShadow: 10,
                              '&:hover': {
                                color: "success.main",
                                backgroundColor: "primary.main"
                              },
                            }}>
                              <CardContent >
                                <Typography variant='body2' fontSize={17}  mb={1}>Classification</Typography>
                                {/*@ts-ignore*/}
                                <span style={{fontWeight: "bold", fontSize: 20 , color: "primary.main"}}>{lotDetail?.classification?.toUpperCase() ?? ""}</span>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid container mt={2} item justifyContent={"center"} xs={4}>
                           <Card sx={{ 
                              width: 170,
                              height: "fit-content",
                              backgroundColor: "success.main",
                              textAlign: "center",
                              borderRadius: "20px",
                              boxShadow: 10,
                              '&:hover': {
                                color: "success.main",
                                backgroundColor: "primary.main"
                              },
                            }}>
                              <CardContent >
                                <Typography variant='body2' fontSize={17} mb={1}>Domaine</Typography>
                                {/*@ts-ignore*/}
                                <span style={{fontWeight: "bold", fontSize: 20 , color: "primary.main"}}>{lotDetail?.domaine ?? ""}</span>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid container mt={2} item justifyContent={"center"} xs={4}>
                            <Card sx={{ 
                              width: 170,
                              height: "fit-content",
                              backgroundColor: "success.main",
                              textAlign: "center",
                              borderRadius: "20px",
                              boxShadow: 10,
                              '&:hover': {
                                color: "success.main",
                                backgroundColor: "primary.main"
                              },
                            }}>
                              <CardContent >
                                <Typography variant='body2' fontSize={17} mb={1}>Type</Typography>
                                {/*@ts-ignore*/}
                                <span style={{fontWeight: "bold", fontSize: 20 , color: "primary.main"}}>{lotDetail?.type ?? ""}</span>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                        <Grid container mt={2} mb={2}>
                          <Button 
                            //@ts-ignore
                            onClick={() => handleShowDialog(lotDetail.id)}
                            fullWidth
                            sx={{m:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "success.main", color: "primary.main"} }}>
                              Soumissionner
                          </Button>
                        </Grid>
                    </Card>
                  </Grid>
                  <Grid container  item xs={4}>
                    <Grid item xs={12}>
                      <Card style={{ background: 'success.main', marginTop: '5px', padding: '10px', width: "100%"}}>
                        {/*@ts-ignore*/}
                        <Typography variant="h5">{lotDetail?.offre?.user?.inscription?.nom ?? ""} </Typography>
                        <Typography color={"#a9afb9"} fontSize={"13px"}>Entreprise</Typography>
                        <Grid container>
                          <Grid item>
                          <Typography  mr={2}>Responsable :</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            {/*@ts-ignore*/}
                            <Typography color="text.secondary" variant="body2">{lotDetail?.offre?.user?.last_name+" "+lotDetail?.offre?.user?.first_name ?? ""}</Typography>
                          </Grid>
                        </Grid>
                        <IconButton>
                        <LocationOnIcon  fontSize="medium" sx={{color: "primary.main"}}  />
                        {/*@ts-ignore*/}
                        <Typography   fontSize={10}>{lotDetail?.offre?.user?.address ?? ""}</Typography>                
                      </IconButton>
                        <Grid container width={"100%"} justifySelf={"center"}>
                          <Grid container justifyContent={"center"} item xs={4}>
                            <IconButton >
                              <LinkedInIcon fontSize="large"  sx={{color: "primary.main"}}  />
                            </IconButton>
                          </Grid>
                          <Grid container justifyContent={"center"}  item xs={4}>
                            <IconButton >
                              <InstagramIcon fontSize="large" sx={{color: "#fc05be"}}  />
                            </IconButton>
                          </Grid>
                          <Grid container justifyContent={"center"}  item xs={4}>
                            <IconButton >
                              <FacebookIcon fontSize="large" sx={{color: "primary.main"}}  />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid  item xs={12}>
                      <Card style={{ background: 'success.main', marginTop: '5px', padding: '10px', width: "100%"}}>
                        <Grid>
                          <Typography variant="h4">Offre <BusinessCenterIcon fontSize='medium'/></Typography>
                        </Grid>
                        <Typography color={"#a9afb9"} fontSize={"13px"}>Entreprise</Typography>
                        <Grid container>
                          <Grid item>
                          <Typography  mr={1}>Nom de l'offre :</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            {/*@ts-ignore*/}
                            <Typography color="text.secondary" variant="body2">{lotDetail?.offre?.name ?? ""}</Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item>
                          <Typography  mr={1}>Ville :</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            {/*@ts-ignore*/}
                            <Typography color="text.secondary" variant="body2">{lotDetail?.offre?.ville ?? ""}</Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item>
                          <Typography  mr={1}>Le dernier délai :</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            {/*@ts-ignore*/}
                            <Typography color="text.secondary" variant="body2">{moment(lotDetail?.offre?.dDay ?? "").format("DD/MM/YYYY HH:mm")}</Typography>
                          </Grid>
                        </Grid>
                        <Typography>Description :</Typography>
                        
                        <Typography  variant="body2" color="text.secondary">
                          {/*@ts-ignore*/}
                          {lotDetail?.offre?.description ?? ""}
                        </Typography>
                          <Grid container mt={2} mb={2}>
                            <Button 
                              fullWidth
                              onClick={()=> {
                                setLot(true)
                              }}
                              sx={{m:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "success.main", color: "primary.main"} }}>
                                Tout les lots
                            </Button>
                          </Grid>
                      </Card>
                    </Grid>
                  </Grid>
              </Grid>
              {lot ? 
              <Grid container justifyContent={"center"}  item xs={12}  m={1}>
                <Grid item xs={12} m={2}>
                  <Typography variant='h5'>Les autres lots</Typography>
                </Grid>
                { lots.length > 0 ?
                <Masonry columns={{ xs: 1, sm:  2, md: 3}}  >
                  {lots.map( (l: any) => 
                  <Card 
                    key={l.id}
                    sx={{ 
                    maxWidth: 300 ,
                    borderRadius: "20px",
                    '&:hover': {
                      boxShadow: 20
                    },
                  }}>
                    <CardHeader
                    
                      action={
                        <IconButton >
                          <CheckCircleOutlineIcon fontSize="large" sx={{color: "primary.main"}}  />
                        </IconButton>
                      }
                      title={l.name}
                      subheader={moment(l.dernierDelai).format('DD/MM/YYYY, HH:mm:ss')}
                      titleTypographyProps={{variant:'h6' }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {l.description}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Button onClick={() => handleShowDialog(l.id)}  sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "success.main", color: "primary.main"} }}>Soumissionner</Button>
                        <IconButton aria-label="add to favorites">
                          {/*@ts-ignore*/}
                          {l?.favorite ?? false ?  <FavoriteIcon onClick={() => {handleRemoveFav(l.id)}}  sx={{color: "primary.main"}}  /> : <FavoriteBorderIcon onClick={() => {handleAddFav(l.id)}} sx={{color: "primary.main"}}  /> }
                        </IconButton>
                      <Link
                        onClick={() => navigate(`/accueil/show/${l.id}`)}
                        component="button"
                        flex={"flex-end"}
                        variant="body2"
                      >
                        Lire plus
                      </Link>
                    </CardActions>
                  </Card>)
                  }
                </Masonry> : null}
                
              </Grid>      
              : null}
          </Card>
        </Grid>
        <SoumissionDialog in={{show: show, lotId: lotId}}  onClose={handleDialogClose}/>
      </Grid>

  )
}

export default Soumission
