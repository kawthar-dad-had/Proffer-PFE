import { Box, Button, Card, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useState } from 'react';
import { axiosInstance } from 'App';
import Swal from 'sweetalert2';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { Instagram, LinkedIn } from "@mui/icons-material"
const Contact = () => {
    const problemTitles = [
        "Problème de connexion",
        "Demande d'assistance pour l'utilisation de la plateforme",
        "Erreur lors du dépôt d'une offre",
        "Question sur les critères d'éligibilité",
        "Problème avec le processus de soumission",
        "Demande de clarification sur un appel d'offres",
        "Signaler un bug ou un dysfonctionnement de la plateforme",
        "Demande d'informations supplémentaires",
        "Réclamation concernant un appel d'offres",
        "Problème de facturation ou de paiement",
        "Demande de modification des données de l'entreprise",
        "Autre problème ou question"
      ];
    const [selectedValue, setSelectedValue] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange = (event: any) => {
      setSelectedValue(event.target.value);
    };
  
    const handleEmailChange = (event: any) => {
      setEmail(event.target.value);
    };
  
    const handleMessageChange = (event: any) => {
      setMessage(event.target.value);
    };
  
    const handleSubmit = async() => {
      // Access the values here
      setLoading(true); // Set loading state to true

        try {
          const response = await axiosInstance.post('/auth/contact', { email, object: selectedValue, message });

          if (response.status === 200) {
            Swal.fire('Succés', "Mail n'est pas envoyé avec succés!", 'success');
            setSelectedValue(''); // Reset selectedValue to an empty string
            setEmail(''); // Reset email to an empty string
            setMessage(''); // Reset message to an empty string
          } else {
            Swal.fire('Erreur', "Mail n'est pas envoyé!", 'error');
          }
        } catch (err) {
          Swal.fire('Erreur', "Mail n'est pas envoyé!", 'error');
        } finally {
          setLoading(false); // Set loading state to false after request completion
        }
    };
  return (
    <Box sx={{ width: '100%'  }}>
        <Grid container justifyContent={"center"} >
            <Grid item xs={12}>
                <Card sx={{ bgcolor: 'success.main', marginTop: '5px' , padding: 4}}>
                    <Grid>
                        <Grid container justifyItems={"center"} alignItems={"center"}  item xs={12}>
                            <Grid item>
                                <ContactMailIcon fontSize='large' sx={{marginTop: 1,marginRight: 1,color: "primary.main" }}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{fontWeight: 'bold' , color: "primary.main" , fontSize: 35}}>Contact</Typography>
                            </Grid>
                            <Grid container justifyContent={"right"} item xs={5}>
                                <Stack direction={'row'} spacing={1}>
                                    <Fab size="small" color="primary" aria-label="add">
                                        <FacebookRoundedIcon sx={{ color: '#fff' }}/>
                                    </Fab>
                                    <Fab size="small" color="primary" aria-label="add">
                                        <Instagram sx={{ color: '#fff' }}/>
                                    </Fab>
                                    <Fab size="small" color="primary" aria-label="add">
                                        <LinkedIn sx={{ color: '#fff' }}/>
                                    </Fab>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} mt={3}>
                        <FormControl fullWidth variant="filled">
                            <InputLabel id="demo-simple-select-filled-label">Objet</InputLabel>
                            <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={selectedValue}
                            onChange={handleChange}
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {problemTitles.map((title) => (
                               <MenuItem value={title}>{title}</MenuItem>
                            ))}
                            </Select>
                            <TextField
                            sx={{ marginTop: 3 }}
                            id="filled-basic"
                            label="Email"
                            variant="filled"
                            value={email}
                            onChange={handleEmailChange}
                            />
                            <TextField
                            id="standard-multiline-static"
                            label="Message"
                            multiline
                            rows={4}
                            variant="standard"
                            sx={{ marginTop: 3 }}
                            value={message}
                            onChange={handleMessageChange}
                            />
                            <Grid container height={10} justifyContent={'right'} m={2}>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !selectedValue || !email || !message} 
                                sx={{
                                fontWeight: 800,
                                color: 'white',
                                borderRadius: '10px',
                                backgroundColor: 'primary.main',
                                ':hover': { backgroundColor: '#fff', color: 'primary.main' },
                                }}
                            >
                                {loading ? 'Loading...' : 'Envoyer'}
                            </Button>
                            </Grid>
                        </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>    
    </Box> 
  )
}

export default Contact
