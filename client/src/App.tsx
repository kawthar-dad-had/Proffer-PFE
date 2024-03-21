import React from "react";

import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";

import dataProvider from "@pankod/refine-simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import routerProvider, { useNavigate } from "@pankod/refine-react-router-v6";
import { useTranslation } from "react-i18next";
import { ColorModeContextProvider } from "contexts";
import { Title, Sider, Layout, Header } from "components/layout";
import { authProvider } from "./authProvider";

import axios from "axios"
import GroupIcon from '@mui/icons-material/Group';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import PersonIcon from '@mui/icons-material/Person';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeIcon from '@mui/icons-material/Home';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {
  SignIn,
  SignUp,
} from 'pages'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

import Offre from "pages/Contractant/Offres/Offres";
import CreateOffre from "pages/Contractant/Offres/CreateOffre";
import {Soumissions} from "pages/Contractant/Soumissions/Soumissions";
import Soumission from "pages/Contractant/Soumissions/Soumission";
import Evaluateurs from "pages/Contractant/Evaluateurs/Evaluateurs";
import CreateEvaluateur from "pages/Contractant/Evaluateurs/CreateEvaluateur";
import OffresMin from "pages/Ministere/OffresMin";
import Profile from "pages/Contractant/Profile";
import Home from "pages/Soumissionnaire/Home";
import Favoris from "pages/Soumissionnaire/Favoris";
import ProfileSoum from "pages/Soumissionnaire/Profile";
import SoumissionSoum from "pages/Soumissionnaire/Soumission";
import SoumissionsSoum from "pages/Soumissionnaire/Soumissions";
import Noification from "pages/Notification";
import {Evaluateur} from "pages/Evaluateur/Evaluateur";
import { Dashboard } from "pages/Admin/Dashboard";
import Inscription from "pages/Connexion/Inscription";
import Utilisateur from "pages/Admin/Utilisateur";
import Offres from "pages/Admin/Offre";
import Lots from "pages/Contractant/Offres/Lots";
import RendezVous from "pages/Contractant/RendezVous";
import Budget from "pages/Contractant/Budget";
import Details from "pages/Soumissionnaire/Details";
import {Ministere} from "./pages/Admin/Ministere";
import CreateMinistere from "pages/Admin/CreateMinistere";
import { Etablissement } from "pages/Ministere/Etablissement";
import CreateEtablissment from "pages/Ministere/CreateEtablissment";
import Contact from "pages/Contact";

export const axiosInstance = axios.create({
  baseURL: "http://41.111.227.13:8080",
  withCredentials: true
})
//axiosInstance.defaults.withCredentials = true
const LoginForm = () => {
  return ( 
    <div style={{backgroundColor: '#E6F9F3'}}>
      <SignIn/>
    </div>
  )
}

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          accessControlProvider={{
            can: async ({ resource, action, params }) => {
              //@ts-ignore
              let permissionsData: string = await authProvider?.getPermissions() ?? 'none';
              console.log(permissionsData);
              if ((permissionsData === 'none') && (resource === "login" || resource === "register")) {
                return Promise.resolve({can: true})
              } else if (permissionsData === 'none') {
                return Promise.resolve({can: false})
              } else if (resource === 'inscription' && permissionsData === 'inactiveUser'){
                return Promise.resolve({can: true})
              } else if (permissionsData === 'inactiveUser'){    
                return Promise.resolve({can: false})
              }  else if (permissionsData !== 'inactiveUser' && resource === 'inscription'){    
                return Promise.resolve({can: false})
              } else if (permissionsData === 'contractant' && ((resource === "offre" || resource === "soumission" || resource === "evaluateur" || resource === "rendezvous" || resource === "contact" ))) {
                return Promise.resolve({can: true})
              } else if (permissionsData === 'contractant') {
                return Promise.resolve({can: false})
              } else if (permissionsData === "soumissionnaire" && (resource === "accueil" || resource === "favoris" || resource === "soumissions/soumissionnaire" || resource === "details" || resource === "contact")) {
                return Promise.resolve({can: true})
              } else if (permissionsData === "soumissionnaire") {
                return Promise.resolve({can: false})
              } else if(permissionsData === "admin" && (resource === "dashboard" || resource === "utilisateur" || resource === "offres" || resource === "ministere")) {
                return Promise.resolve({can: true})
              } else if(permissionsData === "admin") {
                return Promise.resolve({can: false})
              } else if(permissionsData === "evaluateur" && (resource === "evaluateurs")) {
                return Promise.resolve({ can: true })
              } else if(permissionsData === "evaluateur") {
                return Promise.resolve({ can: false })
              } else if(permissionsData === "ministere" && (resource === "etablissement" || resource === "offres/ministere")) {
                return Promise.resolve({ can: true })
              } else if(permissionsData === "ministere") {
                return Promise.resolve({ can: false })
              } else {
                return Promise.resolve({ can: false })
              }
              
            },
          }}
          dataProvider={dataProvider("http://41.111.227.13:8080" as string, axiosInstance)}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={
            [
              {
                name: "dashboard",
                options: {
                  label: "Dashboard"
                },
                list: Dashboard,
                edit: MuiInferencer,
                show: MuiInferencer,
                icon: <DashboardOutlinedIcon/>
                //canDelete: true,
              },
              {
                name: "offre",
                list: Offre,
                edit: MuiInferencer,
                show: Lots,
                create: CreateOffre,
                icon: <BusinessCenterIcon/>
                //canDelete: true,
              },
              {
                name: "soumission",
                list: Soumissions,
                icon: <AllInboxIcon/>,
                /*
                options: {
                  label: "Utilisateurs"
                },
                */
                show: Soumission,
                //canDelete: true,
              },            
              {
                name: "utilisateur",
                list: Utilisateur,
                icon: <GroupIcon/>,
                /*
                options: {
                  label: "Utilisateurs"
                },
                */
                //canDelete: true,
              },   
              {
                name: "offres",
                list: Offres,
                icon: <BusinessCenterIcon/>,
                /*
                options: {
                  label: "Utilisateurs"
                },
                */
                //canDelete: true,
              },
              {
                name: "offres/ministere",
                list: OffresMin,
                icon: <BusinessCenterIcon/>,
                options: {
                  label: "Offres"
                },
                //canDelete: true,
              }, 
              {
                name: "evaluateur",
                list: Evaluateurs,
                icon: <GroupIcon/>,
                /*
                options: {
                  label: "Utilisateurs"
                },
                */
                edit: MuiInferencer,
                //show: Soumission,
                create: CreateEvaluateur,
                canDelete: true,
              },
              {
                name: "rendezvous",
                list: RendezVous,
                icon: <Groups3OutlinedIcon/>,
                /*
                options: {
                  label: "Utilisateurs"
                },
                */
                edit: MuiInferencer,
                show: Budget,
                //create: CreateEvaluateur,
                canDelete: true,
              },
              {
                name: "accueil",
                list: Home,
                icon: <HomeIcon/>,
                options: {
                  label: "Accueil"
                },
                show: Details,
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },
              {
                name: "favoris",
                list: Favoris,
                icon: <BookmarksIcon/>,
                options: {
                  label: "Favoris"
                },
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },
              {
                name: "profil/soumissionnaire",
                list: ProfileSoum,
                icon: <PersonIcon/>,
                options: {
                  label: "Profil Soum"
                },
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },
              {
                name: "soumissions/soumissionnaire",
                list: SoumissionsSoum,
                icon: <AllInboxIcon/>,
                options: {
                  label: "Soumissions"
                },
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },
              {
                name: "soumissioner",
                list: SoumissionSoum,
                icon: <GroupIcon/>,
                options: {
                  label: "Soumission Soum"
                },
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },
              {
                name: "evaluateurs",
                list: Evaluateur,
                icon: <GroupIcon/>,
                options: {
                  label: "Evaluateur"
                },
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },
              {
                name: "notification",
                list: Noification,
                icon: <MarkChatUnreadIcon/>,
                edit: MuiInferencer,
                //show: Soumission,
                canDelete: true,
              },              
              {
                name: "ministere",
                list: Ministere,
                icon: <BusinessIcon/>,
                edit: MuiInferencer,
                create: CreateMinistere,
                canDelete: true,
              },              
              {
                name: "etablissement",
                list: Etablissement,
                icon: <CorporateFareIcon/>,
                edit: MuiInferencer,
                create: CreateEtablissment,
                canDelete: true,
              },              
              {
                name: "contact",
                list: Contact,
                icon: <ContactMailIcon/>,
                edit: MuiInferencer,
                canDelete: true,
              },
            ]
          }
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          routerProvider={{
            ...routerProvider,
            routes: [
              {
                path: "/register",
                element: <SignUp/>,
              },
              {
                path: "/inscription",
                element: <Inscription/>,
              },
            ]
          }}
          authProvider={authProvider}
          LoginPage={LoginForm}
          i18nProvider={i18nProvider}
        />
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
