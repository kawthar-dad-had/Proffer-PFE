import { Avatar, Button, Card, CardContent, CardHeader, Grid, IconButton, Stack, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import  imageUrl  from "./../assets/photo.jpg";  
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';


const Notification = () => {
  return (
    <Grid container  >
        <Grid item xs={10} >
            <Button variant="outlined" size='small' sx={{marginTop: "15px"}} >Aujourd'hui</Button>
            <Grid item xs={12} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                    <Grid container>
                        <Grid item xs={11}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }}>
                                    <BusinessCenterIcon/>
                                </Avatar>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                        </Grid>
                        <Grid item container xs={1} alignItems={'center'}>
                            <span style={{fontSize: "15px", color: "#B4B0B0"}}>11:30 AM</span>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                    <Grid container>
                        <Grid item xs={11}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }}  src={imageUrl}/>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                        </Grid>
                        <Grid item container xs={1} alignItems={'center'}>
                            <span style={{fontSize: "15px", color: "#B4B0B0"}}>11:30 AM</span>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                    <Grid container>
                        <Grid item xs={11}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }}  src={imageUrl}/>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                        </Grid>
                        <Grid item container xs={1} alignItems={'center'}>
                            <span style={{fontSize: "15px", color: "#B4B0B0"}}>11:30 AM</span>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Button variant="outlined" size='small' sx={{marginTop: "15px"}} >Hier</Button>
            <Grid item xs={8} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: "primary.main"}}>
                                            <BusinessCenterIcon/>
                                        </Avatar>                                    }
                                    action= {
                                        <Stack mt={1}>
                                            <span style={{fontSize: "11px", color: "#B4B0B0" }}>September 14, 2016</span>
                                            <span style={{fontSize: "11px", color: "#B4B0B0"}}>11:30 AM</span>
                                        </Stack>
                                    }
                                    title={
                                        <Typography>Offre</Typography>
                                    }
                                    subheader={
                                        <Typography>Votre Offre <b>Construire un hopital</b>  a été approuvé par l'administrateur</Typography>
                                    }
                                />

                        
                    
                </Card>
            </Grid>
            <Grid item xs={12} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                    <Grid container>
                        <Grid item xs={11}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }}  src={imageUrl}/>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                        </Grid>
                        <Grid item container xs={1} alignItems={'center'}>
                            <span style={{fontSize: "15px", color: "#B4B0B0"}}>11:30 AM</span>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                    <Grid container>
                        <Grid item xs={11}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }}  src={imageUrl}/>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                        </Grid>
                        <Grid item container xs={1} alignItems={'center'}>
                            <span style={{fontSize: "15px", color: "#B4B0B0"}}>11:30 AM</span>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} mt={2}>
                <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                    <Grid container>
                        <Grid item xs={11}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }}  src={imageUrl}/>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                        </Grid>
                        <Grid item container xs={1} alignItems={'center'}>
                            <span style={{fontSize: "15px", color: "#B4B0B0"}}>11:30 AM</span>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid> 
        
    </Grid>

  )
}

export default Notification