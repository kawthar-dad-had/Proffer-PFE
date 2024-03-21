import React, { useContext, useEffect, useState } from "react";
import {
  useGetIdentity,
} from "@pankod/refine-core";
import {
  AppBar,
  IconButton,
  Avatar,
  Stack,
  MenuItem,
  Toolbar,
  Typography,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  Tooltip,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardHeader,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  TextField,
} from "@pankod/refine-mui";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { BusinessCenterOutlined, DarkModeOutlined, LightModeOutlined, Logout, PersonAdd, Settings } from "@mui/icons-material";
import { LordIcon } from 'components/common/lord-icon';

import { ColorModeContext } from "contexts";
import { axiosInstance } from "App";
import moment from "moment";
import Swal from "sweetalert2";

export const Header: React.FC = () => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [openDialog1 , setOpenDialog1] = useState(false)
    const [openDialog2 , setOpenDialog2] = useState(false)
    const [openDialog3 , setOpenDialog3] = useState(false)

    const handleOpenDiaog = () => {
        setOpenDialog1(true)
    }
    const handleCloseDialog1 = () => {
      setOpenDialog1(false)
    }
    const handleOpenDiaLog2 = () => {
      setOpenDialog2(true)
  }
  const handleCloseDialog2 = () => {
    setOpenDialog2(false)
  }
  const handleOpenDiaLog3 = () => {
    setOpenDialog3(true)
}
const handleCloseDialog3 = () => {
  setOpenDialog3(false)
}

    //@ts-ignore
    const handleClickOpen = (scrollType) => () => {
      setOpenDialog(true);
      setScroll(scrollType);
      axiosInstance.patch("/auth/notifications/", {}).then((response) => {
        axiosInstance.get('/auth/notifications/').then((response) => {
            console.log(response.data);
            setNotifications(response.data)
      })
    })
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

  const { mode, setMode } = useContext(ColorModeContext);
  
  const { data: user } = useGetIdentity();

  const [profile, setProfile] = useState<any>()


  React.useEffect(() => {
    setProfile(user);
  }, [user])
  const [notifications, setNotifications] = React.useState<any>()

  React.useEffect(() => {
    axiosInstance.get('/auth/notifications/').then((response) => {
        console.log(response.data);
        setNotifications(response.data)
    })
  }, [])
  const showUserInfo = user && (user.name || user.avatar);


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function generateNotificationMessage(type: string, offerName: string) {
    switch (type) {
      case "offre approuvée":
        return `Votre offre <b>${offerName}</b> a été approuvée par l'administrateur`;
      case "offre refusée":
        return `Votre offre <b>${offerName}</b> a été refusée par l'administrateur`;
      case "lot evalué":
        return `Votre lot <b>${offerName}</b> a été évalué`;
      case "rdv créé":
        return `Un nouveau rendez-vous a été créé pour votre offre <b>${offerName}</b>`;
      case "rdv modifié":
        return `Le rendez-vous a été modifié pour votre offre <b>${offerName}<b> a été modifié`;
      case "rdv annulé":
        return `Le rendez-vous pour votre offre <b>${offerName}</b> a été annulé`;
      case "resultat":
        return `Le résultat pour votre offre <b>${offerName}</b> est disponible`;
      case "lot annulé":
        return `Votre lot <b>${offerName}</b> a été annulé`;
      default:
        return "Nouvelle notification";
    }
  }

  function createData(name: string, value: string) {
    return { name, value };
  }
  
  const rows =  (user?.inscription ?? false) ? [
    createData('Entreprise', user?.inscription?.nom ?? "-"),
    createData('Classification', user?.inscription?.classification ?? "-"),
    createData('Numéro de registre commercial', user?.inscription?.numRegistre ?? "-"),
    createData('NIF', user?.inscription?.nif ?? "-"),
    createData('NIS', user?.inscription?.nis ?? "-"),
    createData('CASNOS', user?.inscription?.casnos ?? "-"),
    createData('CACOBATPH', user?.inscription?.cacobatph ?? "-"),
  ] : (user?.inscriptions_ministeres_etab ?? false) ? [
    createData('Entreprise', user?.inscriptions_ministeres_etab?.nom ?? "-"),
    createData('NIF', user?.inscriptions_ministeres_etab?.nif ?? "-"),
    createData('NIS', user?.inscriptions_ministeres_etab?.nis ?? "-"),
    createData('Code Ordonnateur', user?.inscriptions_ministeres_etab?.codeOrdonnateur ?? "-"),
  ] : [];

  const handleUpdateProfile = async () => {
      try {
        const response = await axiosInstance.patch('/auth/users/me',  {...profile})

        if (response.status === 200) {
          handleCloseDialog2()
          Swal.fire({
            title: 'Succès',
            text: 'Profile mise à jour avec succès!',
            icon: 'success',
            customClass: {
              container: 'my-swal-container',
            },
          });
        } else {
          Swal.fire({
            title: 'Erreur',
            text: "Profile n'est pas mettre à jour!",
            icon: 'error',
            customClass: {
              container: 'my-swal-container',
            },
          });
        }
      } catch (err) {
        Swal.fire({
          title: 'Erreur',
          text: "Profile n'est pas mettre à jour!",
          icon: 'error',
          customClass: {
            container: 'my-swal-container',
          },
        });
      }
  }

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const handleUpdatePassword = async () => {
    try {
      const response = await axiosInstance.patch('/auth/users/password/me',  {password, newPassword});

      if (response.status === 200) {
        handleCloseDialog3()
        Swal.fire({
          title: 'Succès',
          text: 'Password mise à jour avec succès!',
          icon: 'success',
          customClass: {
            container: 'my-swal-container',
          },
        });
      } else {
        Swal.fire({
          title: 'Erreur',
          text: "Password n'est pas mettre à jour!",
          icon: 'error',
          customClass: {
            container: 'my-swal-container',
          },
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: "Password n'est pas mettre à jour!",
        icon: 'error',
        customClass: {
          container: 'my-swal-container',
        },
      });
    }
  }
  return (
    <AppBar sx={{bgcolor: "success.main"}} position="sticky" elevation={1}>
      <Toolbar
        sx={{
          paddingLeft: {
              sm: "24px",
              md: "24px",
          },
        }}
      >
        <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
        >
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                <Typography color={"text.secondary"} variant="h4">{user?.inscription?.nom ?? ''}{user?.inscriptions_ministeres_etab?.nom ?? ""}</Typography>

                </Stack>
                <Stack
                    direction="row"
                    marginRight={2}
                    justifyContent="flex-end"
                    alignItems="center"
                >
                <IconButton onClick={handleClickOpen('paper')}>
                    <Badge badgeContent={notifications?.unseenNotifications ?? 0} color="primary">
                        <LordIcon
                             src="https://cdn.lordicon.com/psnhyobz.json"
                            trigger="hover"
                            colors={{primary: 'text.secondary'}}
                            size={(23)}
                        />
                    </Badge>
                </IconButton>
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <IconButton
                        onClick={() => {
                        setMode();
                        }}
                    >
                        {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
                    </IconButton> 
                    {showUserInfo && (
                        <Stack direction="row" gap="16px" alignItems="center">
                            {user.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
                            {user.name && (
                                <Typography variant="subtitle2">{user?.name}</Typography>
                            )}
                        </Stack>
                    )}
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>{(user?.first_name?.charAt(0).toUpperCase() ?? "") + (user?.last_name?.charAt(0).toUpperCase() ?? "")}</Avatar>
                        </IconButton>
                        </Tooltip>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                            },
                            '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleOpenDiaog}>
                        <Avatar /> Profil
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleOpenDiaLog2}>
                        <ListItemIcon>
                            <ManageAccountsIcon fontSize="small" />
                        </ListItemIcon>
                        Modifier le profil
                        </MenuItem>
                        <MenuItem onClick={handleOpenDiaLog3}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Modifier le mot de passe
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                        </MenuItem>
                    </Menu>
                </Stack>
      </Stack>
      </Toolbar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        
      >

        <DialogTitle id="scroll-dialog-title">
            <IconButton>
                <NotificationsNoneIcon/>
            </IconButton>
            Notification</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
            {(notifications?.groupedNotifications?.Today ?? false) ? 
            <>
            <Button variant="outlined" size='small' sx={{marginTop: 1}} >Aujourd'hui</Button>  
            {notifications?.groupedNotifications?.Today.map((notification: any) =>
                <>    
                    <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: "primary.main"}}>
                                        <BusinessCenterOutlined/>
                                    </Avatar>                                    }
                                action= {
                                    <Stack m={1}>
                                        <span style={{fontSize: "11px", color: "#B4B0B0" }}>{moment(notification.createdAt).format("LL")}</span>
                                        <span style={{fontSize: "11px", color: "#B4B0B0"}}>{moment(notification.createdAt).format("HH:mm")}</span>
                                    </Stack>
                                }
                                title={
                                    <Typography>{notification.titre}</Typography>
                                }
                                subheader={
                                  <Typography>{notification.contenu}</Typography>
                                }
                            />
                    </Card>
                </>
           )} </>: null}
           {(notifications?.groupedNotifications?.Yesterday ?? false)?
           <>
           <Button variant="outlined" size='small' sx={{marginTop: 1}} >Hier</Button>
           {notifications?.groupedNotifications?.Yesterday.map((notification: any) =>
                <>    
                    <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: "primary.main"}}>
                                        <BusinessCenterOutlined/>
                                    </Avatar>                                    }
                                action= {
                                    <Stack mt={1}>
                                        <span style={{fontSize: "11px", color: "#B4B0B0" }}>{moment(notification.createdAt).format("LL")}</span>
                                        <span style={{fontSize: "11px", color: "#B4B0B0"}}>{moment(notification.createdAt).format("HH:mm")}</span>
                                    </Stack>
                                }
                                title={
                                    <Typography>{notification.titre}</Typography>
                                }
                                subheader={
                                    <Typography>{notification.contenu}</Typography>
                                }
                            />

                    </Card>
                </>
            )} </>: null}
            {(notifications?.groupedNotifications?.Others ?? false) ?
            <>
            <Button variant="outlined" size='small' sx={{marginTop: 1}} >Autre</Button>
             {notifications.groupedNotifications.Others.map((notification: any) =>
                <>    
                    <Card  style={{background: '#fff', marginTop: '5px', width: "100%"}}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: "primary.main"}}>
                                        <BusinessCenterOutlined/>
                                    </Avatar>                                    }
                                action= {
                                    <Stack mt={1}>
                                        <span style={{fontSize: "11px", color: "#B4B0B0" }}>{moment(notification.createdAt).format("LL")}</span>
                                        <span style={{fontSize: "11px", color: "#B4B0B0"}}>{moment(notification.createdAt).format("HH:mm")}</span>
                                    </Stack>
                                }
                                title={
                                    <Typography>{notification.titre}</Typography>
                                }
                                subheader={
                                    <Typography>{notification.contenu}</Typography>
                                }
                            />

                    </Card>
                </>
            )} </>: null}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialog1}
        maxWidth={'md'}
        onClose={handleCloseDialog1}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        
      >

        <DialogTitle id="scroll-dialog-title">
            <IconButton>
                <AssignmentIndIcon/>
            </IconButton>
            Profil</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              {/*<TableHead>
                <TableRow>
                  <TableCell>Entreprise</TableCell>
                  <TableCell align="right">Classification</TableCell>
                  <TableCell align="right">Numéro de registre commercial</TableCell>
                  <TableCell align="right">NIF</TableCell>
                  <TableCell align="right">NIS</TableCell>
                  <TableCell align="right">CASNOS</TableCell>
                  <TableCell align="right">Numéro de registre commercial</TableCell>
                  <TableCell align="right">Numéro de registre commercial</TableCell>
                </TableRow>
                              </TableHead>*/}
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialog2}
        maxWidth={'md'}
        onClose={handleCloseDialog2}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        
      >

        <DialogTitle id="scroll-dialog-title">
            <IconButton>
                <Settings/>
            </IconButton>
            Modifier le profil</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
            <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="first_name"
                label="Nom"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={profile?.first_name ?? ''}
                onChange={(event) =>
                  setProfile({ ...profile, first_name: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="last_name"
                label="Prénom"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={profile?.last_name ?? ""}
                onChange={(event) =>
                  setProfile({ ...profile, last_name: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                defaultValue={profile?.email ?? ""}
                onChange={(event) =>
                  setProfile({ ...profile, email: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="phone_number"
                label="Téléphone"
                type="number"
                fullWidth
                variant="standard"
                defaultValue={profile?.phone_number ?? ""}
                onChange={(event) =>
                  setProfile({ ...profile, phone_number: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="address"
                label="Adresse"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={profile?.address ?? ""}
                onChange={(event) =>
                  setProfile({ ...profile, address: event.target.value })
                }
              />
            </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateProfile}>Modifier</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog3}
        onClose={handleCloseDialog3}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        
      >

        <DialogTitle id="scroll-dialog-title">
            <IconButton>
                <Settings/>
            </IconButton>
            Modifier le mot de passe</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Ancien mot de passe"
                  type="password"
                  fullWidth
                  variant="standard"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <TextField  
                  autoFocus
                  margin="dense"
                  label="Nouveau mot de passe"
                  type="password"
                  fullWidth
                  variant="standard"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdatePassword}>Modifier</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};
