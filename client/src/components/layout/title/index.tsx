import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button } from "@pankod/refine-mui";

import Proffer from 'assets/logoVertPng.png'
import Logo from 'assets/pPng.png'

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={Logo} alt="Refine" width="100px" height="100px" style={{marginTop: "20px"}} />
        ) : (
          <img src={Proffer} alt="Refine" width="160px" style={{marginTop: "20px"}} />
        )}
      </Link>
    </Button>
  );
};
