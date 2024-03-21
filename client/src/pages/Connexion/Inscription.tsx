import { Box, Button, Card, Container, CssBaseline, Grid, IconButton, Link, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Tooltip, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Logo from 'assets/logoVertTextPng.png'
import { authProvider } from 'authProvider';
import { useEffect, useState } from 'react';
import { useGetIdentity, useLogout } from '@pankod/refine-core';
import { axiosInstance } from 'App';
import { Logout } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Swal from 'sweetalert2';

const Inscription = () => {
    useEffect(() => {
        //@ts-ignore
        authProvider.getPermissions().then((res) => {
            if(res !== "inactiveUser") {
                window.location.replace("http://41.111.227.13:3000/")
            }
        }).catch(err => {
            window.location.replace("http://41.111.227.13:3000/login")
        })
    }, [])
    
    const { mutate: mutateLogout } = useLogout();

    const [inscription, setInscription] = useState({
        nom: "",
        type: "",
        numRegistre: "",
        numRegistreFile: {} as File,
        classification: "",
        classificationFile: {} as File,
        nif: "",
        nifFile: {} as File,
        nis: "",
        nisFile: {} as File,
        casnos: "",
        casnosFile: {} as File,
        cacobatph: "",
        cacobatphFile: {} as File,
    })

    const { data: user } = useGetIdentity({
        queryOptions: {
            onSuccess(data) {
                console.log(data);
                const insc = {
                    nom: data?.inscription?.nom ?? "",
                    type: data?.inscription?.type ?? "",
                    numRegistre: data?.inscription?.numRegistre ?? "",
                    numRegistreFile: {} as File,
                    classification: data?.inscription?.classification ?? "",
                    classificationFile: {} as File,
                    nif: data?.inscription?.nif ?? "",
                    nifFile: {} as File,
                    nis: data?.inscription?.nis ?? "",
                    nisFile: {} as File,
                    casnos: data?.inscription?.casnos ?? "",
                    casnosFile: {} as File,
                    cacobatph: data?.inscription?.cacobatph ?? "",
                    cacobatphFile: {} as File,
                }
                setInscription(prevState => {
                    return { ...prevState, ...insc };
                })
                console.log("srat");
                console.log(insc);
                console.log("insc state", inscription);
            },
        }
    })


    const disabled = (
        inscription.nom === "" 
        || inscription.type === "" 
        || inscription.numRegistre === "" 
        || inscription.classification === "" 
        || inscription.nif === "" 
        || inscription.nis === "" 
        || inscription.casnos === "" 
        || inscription.cacobatph === ""
        || (!inscription.numRegistreFile.name && (!user?.inscription?.numRegistreFile || !user.inscription.numRegistreFile))
        || (!inscription.classificationFile.name && (!user?.inscription?.classificationFile || !user.inscription.classificationFile))
        || (!inscription.nisFile.name && (!user?.inscription?.nisFile || !user.inscription.nisFile))
        || (!inscription.nifFile.name && (!user?.inscription?.nifFile || !user.inscription.nifFile))
        || (!inscription.casnosFile.name && (!user?.inscription?.casnosFile || !user.inscription.casnosFile))
        || (!inscription.cacobatphFile.name && (!user?.inscription?.cacobatphFile || !user.inscription.cacobatphFile))
      );
    
    
    const handleValider = async () => {
        const formData = new FormData();

        Object.keys(inscription).forEach(key => {
          //@ts-ignore
            const value = inscription[key];
          if (value instanceof File) {
            formData.append(key, value, value.name);
          } else {
            formData.append(key, value);
          }
        })
        user.inscription ? 
            await axiosInstance.put(`/auth/inscriptions/${user.inscription.id}`, formData).then((res) => {
                if(res.status === 200) {
                    window.location.reload();
                } else {
                    Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                    return Promise.reject(new Error("username: admin, password: admin"));
                }
            }).catch((err) => {
                Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                return Promise.reject(new Error("username: admin, password: admin"));
            })
            : 
            await axiosInstance.post("/auth/inscriptions/", formData).then((res) => {
                if(res.status === 201) {
                    window.location.reload();
                } else {
                    Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                    return Promise.reject(new Error("username: admin, password: admin"));
                }
            }).catch((err) => {
                Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                return Promise.reject(new Error("username: admin, password: admin"));
            })
    }

    const handleSave = async() => {
        const formData = new FormData();

        Object.keys(inscription).forEach(key => {
          //@ts-ignore
          const value = inscription[key];
          if (value instanceof File) {
            formData.append(key, value, value.name);
          } else {
            formData.append(key, value);
          }
        })
        user.inscription ?
            await axiosInstance.put(`/auth/inscriptions/save/${user.inscription.id}`, formData).then((res) => {
                if(res.status === 200) {
                    Swal.fire("Enregistrée", "Votre inscription est enregistrée, vous pouvez déconnecter et revenir plus tard pour la completer.", "success");
                } else {
                    Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                    return Promise.reject(new Error("username: admin, password: admin"));
                }
            }).catch((err) => {
                Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                return Promise.reject(new Error("username: admin, password: admin"));
            })
            : 
            await axiosInstance.post("/auth/inscriptions/save", formData).then((res) => {
                if(res.status === 200) {
                    Swal.fire("Enregistrée", "Votre inscription est enregistrée, vous pouvez déconnecter et revenir plus tard pour la completer.", "success");
                } else {
                    Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                    return Promise.reject(new Error("username: admin, password: admin"));
                }
            }).catch((err) => {
                Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
                return Promise.reject(new Error("username: admin, password: admin"));
            })
    }
    return (
    <Container    maxWidth="md">
        <CssBaseline />
        <Card style={{ background: '#fff', marginTop: 50, padding: 20 , borderRadius: 20 }}>
        <Grid container justifyContent={"flex-end"}>
            <Stack width={"fit-content"} direction={"row"}>
                <ListItemButton
                key="contact"
                onClick={() => {/*navigate("/contact")*/}}
                sx={{ 
                    justifyContent: "center",
                    margin: "20px",
                    borderRadius: "10px",
                    pl: 2,
                    py: 1,
                    width: "fit-content",
                }}
                >
                <ListItemIcon
                    sx={{
                    justifyContent: "center",
                    minWidth: 36,
                    color: "secondary.main",
                    }}
                >
                    <MailOutlineIcon />
                </ListItemIcon>
                <ListItemText
                    sx={{color:"secondary.main"}}
                    primary={"Contact"}
                    primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "14px",
                    }}
                />
                </ListItemButton>
                <ListItemButton
                key="logout"
                onClick={() => mutateLogout()}
                sx={{ 
                    justifyContent: "center",
                    margin: "20px",
                    borderRadius: "10px",
                    pl: 2,
                    py: 1,
                }}
                >
                <ListItemIcon
                    sx={{
                    justifyContent: "center",
                    minWidth: 36,
                    color: "secondary.main",
                    }}
                >
                    <Logout />
                </ListItemIcon>
                <ListItemText
                    sx={{color:"secondary.main"}}
                    primary={"Logout"}
                    primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "14px",
                    }}
                />
                </ListItemButton>
            </Stack>   
        </Grid>
            {((!user?.inscription ?? true) || (user.inscription.complet === false)) ? 
                <Grid container minWidth={"100%"} spacing={3}>
                
                <Grid container justifyContent={"center"}>
                    <Box
                        component="img"
                        width={200}
                        alt="Your logo."
                        src={Logo}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                                required
                                fullWidth
                                id="entreprise"
                                label="Entreprise"
                                name="entreprise"
                                autoComplete="Entreprise"
                                autoFocus
                                value={inscription.nom}
                                onChange={(e) => setInscription({...inscription, nom: e.target.value})}
                            />
                    </Grid>

                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                                required
                                fullWidth
                                id="type"
                                label="Type"
                                name="type"
                                autoComplete="type"
                                autoFocus
                                value={inscription.type}
                                onChange={(e) => setInscription({...inscription, type: e.target.value})}
                            />
                    </Grid>

                </Grid>
                <Grid container item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                            required
                            fullWidth
                            id="type"
                            label="Numéro de registre commercial"
                            name="type"
                            autoComplete="type"
                            autoFocus
                            value={inscription.numRegistre}
                            onChange={(e) => setInscription({...inscription, numRegistre: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={1} mt={2}>
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden onChange={e => setInscription({...inscription, numRegistreFile: e.target.files?.[0] ?? {} as File})} accept="application/pdf" type="file" />
                            <CloudUploadIcon sx={{color: "primary.main"}} fontSize='large'/>
                        </IconButton>
                    </Grid>
                    {(inscription && inscription.numRegistreFile && inscription.numRegistreFile.name) ? 
                      <Typography>{inscription.numRegistreFile.name}</Typography> 
                      : 
                      (user && user.inscription && user.inscription.numRegistreFile) ? 
                        <Typography>{user.inscription.numRegistreFile}</Typography> 
                      : 
                      null
                    }
                </Grid>
                <Grid container item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                            required
                            fullWidth
                            id="classification"
                            label="Classification"
                            name="classification"
                            autoComplete="classification"
                            autoFocus
                            value={inscription.classification}
                            onChange={(e) => setInscription({...inscription, classification: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={1} mt={2}>
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden onChange={e => setInscription({...inscription, classificationFile: e.target.files?.[0] ?? {} as File})} accept="application/pdf" type="file" />
                            <CloudUploadIcon sx={{color: "primary.main"}} fontSize='large'/>
                        </IconButton>
                    </Grid>
                    {(inscription && inscription.classificationFile && inscription.classificationFile.name) ? 
                      <Typography>{inscription.classificationFile.name}</Typography> 
                      : 
                      (user && user.inscription && user.inscription.classificationFile) ? 
                        <Typography>{user.inscription.classificationFile}</Typography> 
                      : 
                      null
                    }
                </Grid>
                <Grid container item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                            required
                            fullWidth
                            id="nis"
                            label="NIS"
                            name="nis"
                            autoComplete="nis"
                            autoFocus
                            value={inscription.nis}
                            onChange={(e) => setInscription({...inscription, nis: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={1} mt={2}>
                        <IconButton  color="primary" aria-label="upload picture" component="label">
                            <input hidden onChange={e => setInscription({...inscription, nisFile: e.target.files?.[0] ?? {} as File})} accept="application/pdf" type="file" />
                            <CloudUploadIcon sx={{color: "primary.main"}} fontSize='large'/>
                        </IconButton>
                    </Grid>
                    {(inscription && inscription.nisFile && inscription.nisFile.name) ? 
                      <Typography>{inscription.nisFile.name}</Typography> 
                      : 
                      (user && user.inscription && user.inscription.nisFile) ? 
                        <Typography>{user.inscription.nisFile}</Typography> 
                      : 
                      null
                    }
                </Grid>
                <Grid container item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                            required
                            fullWidth
                            id="nif"
                            label="NIF"
                            name="nif"
                            autoComplete="nif"
                            autoFocus
                            value={inscription.nif}
                            onChange={(e) => setInscription({...inscription, nif: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={1} mt={2}>
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden onChange={e => setInscription({...inscription, nifFile: e.target.files?.[0] ?? {} as File})} accept="application/pdf" type="file" />
                            <CloudUploadIcon sx={{color: "primary.main"}} fontSize='large'/>
                        </IconButton>
                    </Grid>
                    {(inscription && inscription.nifFile && inscription.nifFile.name) ? 
                      <Typography>{inscription.nifFile.name}</Typography> 
                      : 
                      (user && user.inscription && user.inscription.nifFile) ? 
                        <Typography>{user.inscription.nifFile}</Typography> 
                      : 
                      null
                    }
                </Grid>
                <Grid container item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                            required
                            fullWidth
                            id="casnos"
                            label="CASNOS"
                            name="casnos"
                            autoComplete="casnos"
                            autoFocus
                            value={inscription.casnos}
                            onChange={(e) => setInscription({...inscription, casnos: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={1} mt={2}>
                        <IconButton color="primary" aria-label="upload picture" component="label">                            
                            <input hidden onChange={e => setInscription({...inscription, casnosFile: e.target.files?.[0] ?? {} as File})} accept="application/pdf" type="file" />
                            <CloudUploadIcon sx={{color: "primary.main"}} fontSize='large'/>
                        </IconButton>
                    </Grid>
                    {(inscription && inscription.casnosFile && inscription.casnosFile.name) ? 
                      <Typography>{inscription.casnosFile.name}</Typography> 
                      : 
                      (user && user.inscription && user.inscription.casnosFile) ? 
                        <Typography>{user.inscription.casnosFile}</Typography> 
                      : 
                      null
                    }
                </Grid>
                <Grid container item xs={12} sm={6}>
                    <Grid item xs={11}>
                        <TextField
                            required
                            fullWidth
                            id="cacobatph"
                            label="CACOBATPH"
                            name="cacobatph"
                            autoComplete="cacobatph"
                            autoFocus
                            value={inscription.cacobatph}
                            onChange={(e) => setInscription({...inscription, cacobatph: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={1} mt={2}>
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden onChange={e => setInscription({...inscription, cacobatphFile: e.target.files?.[0] ?? {} as File})} accept="application/pdf" type="file" />
                            <CloudUploadIcon sx={{color: "primary.main"}} fontSize='large'/>
                        </IconButton>
                    </Grid>
                    {(inscription && inscription.cacobatphFile && inscription.cacobatphFile.name) ? 
                      <Typography>{inscription.cacobatphFile.name}</Typography> 
                      : 
                      (user && user.inscription && user.inscription.cacobatphFile) ? 
                        <Typography>{user.inscription.cacobatphFile}</Typography> 
                      : 
                      null
                    }
                </Grid>
                <Grid container justifyContent={"right"}  item xs={12} >
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 , mr: 3 , fontWeight: "bold"}}
                        onClick={handleSave}
                        >
                        Sauvgarder
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={disabled}
                        sx={{ mt: 3, mb: 2 , fontWeight: "bold"}}
                        onClick={handleValider}
                        >
                        Valider
                    </Button>                    
                </Grid>
                </Grid>
                :
                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                  <Typography variant="h4" color="secondary.text">
                    Votre demande est en cours de traitement
                  </Typography>
                </Box> 
            }

        </Card>


    </Container>
  )
}

export default Inscription
