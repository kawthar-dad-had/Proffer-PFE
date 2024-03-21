import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { 
  createTheme,
  ThemeProvider,
  responsiveFontSizes, 
} from "@pankod/refine-mui";
import { DarkTheme } from "@pankod/refine-mui";
//import { DarkTheme, LightTheme } from "@pankod/refine-mui";


let customTheme = createTheme({
  palette: {
    text: {
      primary: '#4F4D4D',
    },
    primary: {
      main: '#08C18A',
    },
    secondary: {
      main: '#1b2441',
    },
    success: {
      main: '#fff'
    },
    background: {
      default: '#F7F7F7',
      //default: '#1e36e8',
      paper: '#F1F1F1',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
     // replace with your desired font family
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&display=swap');
      `,
      
    },
  },
});

customTheme = responsiveFontSizes(customTheme);

let darkTheme = createTheme({
  ...DarkTheme,
  palette: {
    mode: "dark",
    primary: {
      main: '#4F4D4D',
    },
    secondary: {
      main: '#6A80A6',
    },
    success: {
      main: '#081F49'
    },
    background: {
      default: '#163062',
      paper: '#081F49',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&display=swap');
      `,
    },
  },
});

darkTheme = responsiveFontSizes(darkTheme);

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider theme={mode === "light" ? customTheme : darkTheme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const villes: {label: string}[] = [
  { label: 'Alger' },
  { label: 'Oran' },
  { label: 'Constantine' },
  { label: 'Annaba' },
  { label: 'Khenchela' },
  { label: 'Blida' },
  { label: 'Batna' },
  { label: 'Sétif' },
  { label: 'Sidi Bel Abbès' },
  { label: 'Biskra' },
  { label: 'Béjaïa' },
  { label: 'Tiaret' },
  { label: 'Tlemcen' },
  { label: 'Chlef' },
  { label: 'Djelfa' },
  { label: 'El Oued' },
  { label: 'Tizi Ouzou' },
  { label: 'Skikda' },
  { label: 'Mostaganem' },
  { label: 'Jijel' },
  { label: 'Béchar' },
  { label: 'Tébessa' },
  { label: 'Ouargla' },
  { label: 'Saïda' },
  { label: 'Ghardaïa' },
  { label: 'Relizane' },
  { label: 'Mascara' },
  { label: 'Bouira' },
  { label: 'Tipaza' },
  { label: 'Tissemsilt' },
  { label: 'Aïn Defla' },
  { label: 'Bordj Bou Arreridj' }
];

export const domaines: {label: string}[] = [
  { label: 'Agriculture' },
  { label: 'Agroalimentaire' },
  { label: 'Architecture' },
  { label: 'Artisanat' },
  { label: 'Automobile' },
  { label: 'Commerce' },
  { label: 'Communication' },
  { label: 'Construction' },
  { label: 'Culture' },
  { label: 'Développement durable' },
  { label: 'E-commerce' },
  { label: 'Economie' },
  { label: 'Education' },
  { label: 'Energie' },
  { label: 'Environnement' },
  { label: 'Finance' },
  { label: 'Industrie' },
  { label: 'Informatique' },
  { label: 'Juridique' },
  { label: 'Logistique' },
  { label: 'Marketing' },
  { label: 'Média' },
  { label: 'Mode' },
  { label: 'Santé' },
  { label: 'Sécurité' },
  { label: 'Services' },
  { label: 'Sport' },
  { label: 'Tourisme' },
  { label: 'Transport' },
];