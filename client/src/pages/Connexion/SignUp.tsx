import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useRegister } from "@pankod/refine-core";
import {IRegisterForm} from 'interfaces/common'

import Logo from 'assets/logoVertText.png'
import { Card, FormControl, InputLabel, MenuItem, Select } from '@pankod/refine-mui';
import { authProvider } from 'authProvider';

export default function SignUp() {
  //@ts-ignore
  authProvider.getPermissions().then((res) => {
    window.location.replace("http://41.111.227.13:3000/")
  }).catch((err) => {
    
  })
  const { mutate: register } = useRegister<IRegisterForm>(); 
  const [user, setUser] = React.useState<IRegisterForm>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    role: '',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register(user)
  };

  return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Card style={{ background: '#fff', marginTop: 50, paddingRight: 30, paddingBottom: 20, paddingLeft: 30  , borderRadius: 20 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              width={200}
              alt="Your logo."
              src={Logo}
            />
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="Prénom"
                    onChange={(e) => setUser({...user, first_name: e.target.value})}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Nom"
                    name="lastName"
                    autoComplete="family-name"
                    onChange={(e) => setUser({...user, last_name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setUser({...user, email: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={(e) => setUser({...user, password: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Adresse"
                    name="address"
                    autoComplete="address"
                    onChange={(e) => setUser({...user, address: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Numéro de téléphone"
                    name="phoneNumber"
                    autoComplete="phoneNumber"
                    onChange={(e) => setUser({...user, phone_number: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      required
                      fullWidth
                      labelId="role-label"
                      id="role"
                      label="Role"
                      name="role"
                      onChange={(e) => setUser({...user, role: e.target.value as string})}
                    >
                      <MenuItem value="soumissionnaire">Soumissionnaire</MenuItem>
                      <MenuItem value="contractant">Contractant</MenuItem>
                    </Select>
                  </FormControl>

                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={(user.first_name === "" || user.last_name === "" || user.email === "" || user.password.length < 8 || user.address === "" || user.phone_number === "" || user.role === "")}
                sx={{ mt: 3, mb: 2, fontWeight: "bold" }}
              >
                S'inscrire
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Vous avez déja un compte? Se connecter
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>          
        </Card>


      </Container>
  );
}