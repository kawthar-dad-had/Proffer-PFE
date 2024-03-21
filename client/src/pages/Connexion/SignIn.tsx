import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useLogin } from "@pankod/refine-core";
import {ILoginForm} from 'interfaces/common'
import "../../styles/style.css"
import Logo from 'assets/image.png'
import { Card, CardMedia } from '@mui/material';
import { LordIcon } from 'components/common/lord-icon';

export default function SignIn() {
  const { mutate: login } = useLogin<ILoginForm>();  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user: ILoginForm = {
      email: data.get('email')?.toString() ?? '',
      password: data.get('password')?.toString() ?? '',
    };
    login(user)
  };

  return (
    <Container maxWidth="lg" sx={{display: 'flex',justifyContent:"center" ,alignItems: "center", height: '100vh'}} >
        <Card sx={{ bgcolor: 'transparent',boxShadow: 5, borderRadius: 10, display:{sx: {width: "60%"},md:{width: "100%"}} }} >
          <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
            <Grid item  sx={{display:{xs: "none", lg: "flex"}}} lg={6} >
              <CardMedia
                component='video'
                image={require("../../assets/profferVideoVert.mp4")}
                loop
                autoPlay
                muted
              />
            </Grid>
            <Grid item  xs= {12} sm={6}  sx={{ paddingLeft: 10, paddingRight: 10,  paddingBottom: 10  }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <LordIcon
                    src="https://cdn.lordicon.com/ajkxzzfb.json"
                    trigger="hover"
                    colors={{primary: '#ffc738', secondary: '#08c18a'}}
                    size={(150)}
                  />
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                      <Grid container justifyContent={"center"} mt={2} mb={2}>
                        <button
                          type="submit"
                          className='buttonproffer'
                        >
                          Se connecter
                        </button>
                      </Grid>


                    <Grid container justifyContent={'center'}>
                      <Grid item>
                        <Link href="/register" variant="body2">
                          {"Pas de compte? S'inscrire maintenant"}
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                </Box> 
            </Grid>
          </Grid>
         
        </Card>


    </Container>
  );
}