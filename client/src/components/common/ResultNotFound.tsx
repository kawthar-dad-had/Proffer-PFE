import { Box, Typography } from "@pankod/refine-mui";

const ResultNotFound = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height={200}>
      <Typography variant="h4" color="secondary.text">
        Aucune résultat trouvée!
      </Typography>
    </Box>
  );
};

export default ResultNotFound;