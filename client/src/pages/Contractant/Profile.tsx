import { PhotoCamera } from '@mui/icons-material';
import { Avatar, Badge, Box, Button, Card, Chip, Divider, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tab, Tabs, TextField, Typography, styled } from '@mui/material'
import  imageUrl  from "../../assets/bg.jpg";  
import DnsIcon from '@mui/icons-material/Dns';
import React from 'react';
import { Visibility } from '@mui/icons-material';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

const shapeStyles = { bgcolor: 'primary.main', width: "100%", height: 200 };
const circle = (
  <img src={imageUrl}  alt="Image description" style={{ ...shapeStyles }} />
);

function generate(element: React.ReactElement) {
  return [0, 1, 2,3,5,6,7].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const Profile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const isDisabled = true;
  return (
    <Card style={{background: '#fff', height: "100%"}}>
    <Grid container spacing={3} height={"100%"}>
      <Grid item xs={12} sm={3}>
          <Grid container width={"100%"}>
            <Grid container item xs={12} width={"100%"}>
              <Badge
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }} 
                sx={{width: "100%"}}
                 overlap="circular" badgeContent={
                  <Fab onClick={() => alert("kawthar")} >
                    <PhotoCamera />
                  </Fab>}>
                {circle}
              </Badge>
            </Grid>
            <Grid container item xs={12} justifyContent={"center"} mt={"5%"}>
              <Typography>Dadoua Hadia Ahmed</Typography>
            </Grid>
            <Grid container item xs={12} justifyContent={"center"} mt={"2%"}>
              <Typography variant='body2'>Responsable</Typography>
            </Grid>
            <Grid container item xs={12} justifyContent={"center"} mt={"2%"}>
              <Typography >Kb-developement</Typography>
              <Chip label="SARL" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>
            </Grid>

            
            <Grid container item xs={12} justifyContent={"center"} mt={10} >
              <List sx={{ width: '100%' }}>
                <ListItem >
                  <Grid container item xs={12} justifyContent={"center"} >
                    <Badge badgeContent={4} color="primary">
                      <Button variant="outlined">Notification</Button>
                    </Badge>
                  </Grid>
                </ListItem>
                <Divider variant='middle'  component="li" />
                <ListItem >
                  <Grid container item xs={12} justifyContent={"center"} >
                    <Badge badgeContent={4} color="primary">
                      <Button variant="outlined">Soumissions</Button>
                    </Badge>
                  </Grid>
                </ListItem>
              </List>
            </Grid>
          </Grid>
      </Grid>
      <Grid item xs={12} sm={9} minHeight={"100%"}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={
                  <Grid container  xs={12} >
                    <Grid item>
                      <DnsIcon fontSize='medium'/>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">Informations</Typography>
                    </Grid>
                  </Grid>
                } {...a11yProps(0)} />
                <Tab label={
                  <Grid container  xs={12}  >
                  <Grid item>
                    <ManageAccountsOutlinedIcon fontSize='medium'/>
                  </Grid>
                  <Grid item xs={8} >
                    <Typography variant="body1">compte</Typography>
                  </Grid>
                </Grid>                
              } {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                  <Box>
                    <List>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility">
                              <Visibility  />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 , bgcolor: "#fff" }}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Numéro de registre"
                          />
                          <Chip label="5724298346" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility">
                              <Visibility/>
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 , bgcolor: "#fff" }} >
                            <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Classification"
                          />
                          <Chip label="A" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>

                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility">
                              <Visibility />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 , bgcolor: "#fff"}}>
                            <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="NIF"
                          />
                          <Chip label="5724298346" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility">
                              <Visibility/>
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 , bgcolor: "#fff"}}>
                            <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="NIS"
                          />
                          <Chip label="5724298346" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility">
                              <Visibility />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 , bgcolor: "#fff"}}>
                            <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="CASNOS"
                          />
                          <Chip label="5728346" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility">
                              <Visibility />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 , bgcolor: "#fff"}}>
                            <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="cacobatph"
                          />
                          <Chip label="57242984567346" color='primary' variant="outlined" sx={{marginRight: "20%"}}/>
                        </ListItem>

                    </List>
                  </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <Grid container spacing={4}  >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    value="k.dadouahadria@esi-sba.dz"
                    disabled={isDisabled}
                    label="Email"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: isDisabled ? "#fff" : "inherit"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    value="0792171077"
                    disabled={isDisabled}
                    label="Numéro de téléphone"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: isDisabled ? "#fff" : "inherit"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value="164 Logts Ilot 23 bloc c 4 N°=23 BVD Millenium - Bir El Djir, Oran , Algérie"
                    disabled={isDisabled}
                    label="Adresse"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: isDisabled ? "#fff" : "inherit"
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} justifyContent={'right'} mt={"20px"} mb={"20px"}>
                    <Button  sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "#fff", color: "primary.main"} }}>Modifier</Button>
              </Grid>
              <Divider  />
              <Grid container spacing={4} mt={1}  >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Mot de passe"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: isDisabled ? "#fff" : "inherit"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le mot de passe"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: isDisabled ? "#fff" : "inherit"
                      }
                    }}
                  />
                </Grid>

              </Grid>
              <Grid container item xs={12} justifyContent={'right'} mt={"20px"}>
                    <Button  sx={{ml:'10px', color: 'white',borderRadius: "10px", backgroundColor: "primary.main",":hover": {backgroundColor: "#fff", color: "primary.main"} }}>Changer</Button>
              </Grid>
            </TabPanel>
          </Box>



      </Grid>
      
      
    </Grid>
    </Card>
  )
}

export default Profile
