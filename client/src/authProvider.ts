import { AuthProvider } from "@pankod/refine-core";
import { axiosInstance } from "App";
import Swal from 'sweetalert2';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    await axiosInstance
        .post(
          "/auth/users/login",
          {
            email,password
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            if ((res.data.role === 'contractant' || res.data.role === 'etablissement') && res.data.active){
              window.location.replace("http://41.111.227.13:3000/offre")
            } else if(res.data.role === 'soumissionnaire' && res.data.active) {
              window.location.replace("http://41.111.227.13:3000/accueil")
            }else if ((res.data.role === 'contractant' || res.data.role === 'soumissionnaire') && !res.data.active) {
              window.location.replace("http://41.111.227.13:3000/inscription")
            } else if (res.data.role === 'admin') {
              window.location.replace("http://41.111.227.13:3000/dashboard")
            } else if (res.data.role === 'evaluateur') {
              window.location.replace("http://41.111.227.13:3000/evaluateurs")
            }else if (res.data.role === 'ministere') {
              window.location.replace("http://41.111.227.13:3000/etablissement")
            }
          }
          if (res.status === 401) {
            Swal.fire("Erreur", "mauvaise combinaison email/password", "error");
            return Promise.reject(new Error("username: admin, password: admin"));
          }
        })
        .catch((e) => {
          Swal.fire("Erreur", "mauvaise 2 combinaison email/password", "error");
          return Promise.reject(new Error("error login"));
        });
    
    
  },
  register: async ({
    first_name, 
    last_name, 
    phone_number,
    address,
    email,
    password,
    role
  }) => {
    console.log(first_name, 
      last_name, 
      phone_number,
      address,
      email,
      password,
      role)
    const res = await axiosInstance
        .post(
          "/auth/users/register",
          {
            first_name, 
            last_name, 
            phone_number,
            address,
            email,
            password,
            role
          },
          {
            withCredentials: true,
          }
        )
        console.log(res.data)
        if (res.status === 201) {
          window.location.replace("http://41.111.227.13:3000/inscription")
        }
         else {
          Swal.fire("Erreur", "mauvaise combinaison des informations", "error");
          return Promise.reject(new Error("username: admin, password: admin"));
        }
  },
  logout: async () => {
  const res = await axiosInstance
    .get("/auth/users/logout", {
      withCredentials: true,
    })
    if (res.status === 200) {
      return Promise.resolve();
    }
    else {
      return Promise.reject();
    }
    
  },
  checkError: () => Promise.resolve(),
  checkAuth: async () => {
  const res = await axiosInstance
      .get('/auth/users/isAuth', {
        withCredentials: true,
      })
      if (res.status === 200) {
        //console.log(res.data)
        return Promise.resolve();
      }
      else {
        return Promise.reject();
      } 
    
  },
  getPermissions: async () => {
    const res = await axiosInstance
      .get('/auth/users/isAuth', {
        withCredentials: true,
      })
      if (res.status === 200) {
        if ((res.data.role === 'contractant' || res.data.role === 'etablissement') && res.data.active){
          return Promise.resolve("contractant");
        } else if(res.data.role === 'soumissionnaire' && res.data.active) {
          return Promise.resolve("soumissionnaire");
        }else if ((res.data.role === 'contractant' || res.data.role === 'soumissionnaire') && !res.data.active) {
          return Promise.resolve("inactiveUser");
        } else if (res.data.role === 'admin') {
          return Promise.resolve("admin");
        } else if (res.data.role === 'evaluateur') {
          return Promise.resolve("evaluateur");
        } else if (res.data.role === 'ministere') {
          return Promise.resolve("ministere");
        } else {
          return Promise.resolve("none");    
        }
      }
      return Promise.resolve("none");
      
  },
  getUserIdentity: async () => {
   const res = await axiosInstance
      .get('/auth/users/isAuth', {
        withCredentials: true,
      })
      if (res.status === 200) {
        return Promise.resolve(res.data);
      }
      else {
        return Promise.resolve();
      }
    
  },
};
