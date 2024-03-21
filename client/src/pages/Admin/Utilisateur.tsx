import React, { useCallback, useEffect } from "react";
import {
    useTranslate,
    IResourceComponentsProps,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender, Row } from "@tanstack/react-table";
import {
    SaveButton,
} from "@refinedev/mui";
import GroupIcon from '@mui/icons-material/Group';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

import {
    Checkbox,
    TableContainer,
    Table,
    Stack,
    TableBody,
    TableRow,
    Button,
    TableCell,
    TextField,
    TableHead,
    IconButton,
    Typography,
    TablePagination,
    Box,
    Card,
    Grid,
    Chip,
    emphasize,
    styled,
    FormControl,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";

import {
    AddCircleOutline,
    RemoveCircleOutline,
    Visibility,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useUpdate } from "@pankod/refine-core";
import { axiosInstance } from "App";
  
  
 const Utilisateur: React.FC<IResourceComponentsProps> = () => {
    const {mutate} = useUpdate()
    const {
        refineCore: { onFinish, id, setId },
        register,
        handleSubmit,
    } = useForm<any>({
        refineCoreProps: {
            redirect: false,
            action: "edit",
        },
    });

    const t = useTranslate();

    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "entreprise",
                accessorKey: "inscription.nom",
                header: "Entreprise",
                cell: function render({ row, getValue }) {
                    return (
                        <Stack direction="row" alignItems="center" spacing={3}>
                            <IconButton onClick={() => row.toggleExpanded()}>
                                {row.getIsExpanded() ? (
                                    <RemoveCircleOutline fontSize="small" />
                                ) : (
                                    <AddCircleOutline fontSize="small" />
                                )}
                            </IconButton>
                            <Typography>{getValue() as string}</Typography>
                        </Stack>
                    );
                },
            },
            {
                id: "last_name",
                accessorKey: "last_name",
                header: "Nom de responsable",
                cell: function render({ getValue }) {
                    return <Typography key="name">{getValue() as string}</Typography>;
                },
            },
            {
                id: "first_name",
                accessorKey: "first_name",
                header: "Prenom de responsable",
                cell: function render({ getValue }) {
                    return <Typography key="state">{getValue()  as string}</Typography>;
                },
            },
            {
              id: "role",
              accessorKey: "role",
              header: "Role",
              cell: function render({ getValue }) {
                  return <Typography key="state">{getValue()  as string}</Typography>;
              },
            },
            {
              id: "tlp",
              accessorKey: "Téléphone",
              header: "Téléphone",
              cell: function render({ getValue }) {
                    return <Chip label="0792171077"  variant="outlined" />
                  //return <Typography key="state">{getValue()  as string}</Typography>;
              },
            },
            {
                id: "id",
                accessorKey: "id",
                header: "Actions",
                cell: function render({ getValue }) {
                    return (
                        <Stack direction="row">
                                <IconButton
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'Voulez vous validez ce compte?',
                                            showCancelButton: true,
                                            confirmButtonText: 'Confirmer',
                                            cancelButtonText: 'Annuler',
                                          }).then((result) => {
                                            /* Read more about isConfirmed, isDenied below */
                                            if (result.isConfirmed) {
                                              mutate({
                                                resource: 'auth/users/activate',
                                                id: getValue() as string,
                                                values: {},
                                              }, {
                                                onError: () => {
                            
                                                },
                                                onSuccess: () => {
                                                  fetchData()
                                                }
                                              })
                                              
                                            }
                                          })
                                    }}
                                >
                                    <CheckCircleOutlineIcon  sx={{color: "green"}} fontSize="large" />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'Voulez vous refusez ce compte?',
                                            showCancelButton: true,
                                            confirmButtonText: 'Confirmer',
                                            cancelButtonText: 'Annuler',
                                          }).then((result) => {
                                            /* Read more about isConfirmed, isDenied below */
                                            if (result.isConfirmed) {
                                              mutate({
                                                resource: 'auth/users/reject',
                                                id: getValue() as string,
                                                values: {},
                                              }, {
                                                onError: () => {
                            
                                                },
                                                onSuccess: () => {
                                                  fetchData()
                                                }
                                              })
                                              
                                            }
                                          })
                                    }}
                                >
                                    <HighlightOffIcon sx={{color: "red"}} fontSize="large" />
                                </IconButton>
                            
                        </Stack>
                    );
                },
            },
        ],
        [t],
    );
    
    const [data, setData] = React.useState<any[]>([]);
    const [count, setCount] = React.useState(0)
    
    const fetchData = async () => {
        try {
          const response = await axiosInstance.get('auth/users/');
          setData(response.data.rows);
          setCount(response.data.count)
        } catch (error) {
          console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
      }, []);

    const {
        options: {
            state: { pagination },
            pageCount,
        },
        getHeaderGroups,
        getRowModel,
        setPageIndex,
        setPageSize,
    } = useTable<any>({
        columns,
        data,
        pageCount: count
    });
    

    const renderRowSubComponent = useCallback(
        ({ row }: { row: Row<any> }) => (
            <CategoryProductsTable record={row.original} />
        ),
        [],
    );

    const handleEditButtonClick = (editId: string) => {
        setId(editId);
    };

    const renderEditRow = useCallback((row: Row<any>) => {
        const { id, title, isActive } = row.original;

        return (
            <TableRow key={`edit-${id}-inputs`}>
                <TableCell
                    sx={{
                        flex: "1",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={3}
                        alignContent="center"
                        alignItems="center"
                    >
                        <IconButton onClick={() => row.toggleExpanded()}>
                            {row.getIsExpanded() ? (
                                <RemoveCircleOutline fontSize="small" />
                            ) : (
                                <AddCircleOutline fontSize="small" />
                            )}
                        </IconButton>

                        <TextField
                            fullWidth
                            id="title"
                            type="text"
                            size="small"
                            defaultValue={title}
                            {...register("title", {
                                required: t("errors.required.field", {
                                    field: "Title",
                                }),
                            })}
                        />
                    </Stack>
                </TableCell>
                <TableCell>
                    <Checkbox
                        id="isActive"
                        defaultChecked={isActive}
                        {...register("isActive")}
                    />
                </TableCell>
                <TableCell
                    sx={{
                        maxWidth: "150px",
                    }}
                >
                    <SaveButton type="submit">{t("buttons.save")}</SaveButton>
                    <Button onClick={() => setId(undefined)}>
                        {t("buttons.cancel")}
                    </Button>
                </TableCell>
            </TableRow>
        );
    }, []);

    function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
      }
      const StyledBreadcrumb = styled(Chip)(({ theme }) => {
        const backgroundColor =
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
        return {
          backgroundColor,
          height: theme.spacing(3),
          color: theme.palette.text.primary,
          fontWeight: theme.typography.fontWeightRegular,
          '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
          },
          '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
          },
        };
      }) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
      
    return (
        <Box sx={{ height: "auto", width: '100%' }}>
            <Card sx={{bgcolor: 'success.main', marginTop: '5px', padding: '10px'}}>
                <Grid container  xs={12} >
                    <Grid item mr={1} mt={1}>
                        <GroupIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Les comptes des utilisateurs</Typography>
                    </Grid>
                    <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer les comptes des utilisaateurs</Typography>
                </Grid>
                
                <Grid  mt={3}  xs={12}>
                    <FormControl fullWidth  onSubmit={handleSubmit(onFinish)}>
                        <form onSubmit={handleSubmit(onFinish)}>
                            <TableContainer sx={ {borderRadius: "10px"}}>
                                <Table size="small">
                                    <TableHead sx={{bgcolor: "primary.main"}}>
                                        {getHeaderGroups().map((headerGroup) => (
                                            <TableRow
                                                key={`header-group-${headerGroup.id}`}
                                            >
                                                {headerGroup.headers.map((header) => (
                                                    <TableCell
                                                        sx={{fontSize: 15 , color: "#fff"}}
                                                        key={`header-group-cell-${header.id}`}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHead>
                                    <TableBody>
                                        {getRowModel().rows.map((row) => {
                                            return (
                                                <React.Fragment key={row.id}>
                                                    {id ===
                                                    (row.original as any).id ? (
                                                        renderEditRow(row)
                                                    ) : (
                                                        <TableRow>
                                                            {row
                                                                .getAllCells()
                                                                .map((cell) => {
                                                                    return (
                                                                        <TableCell
                                                                            key={cell.id}
                                                                        >
                                                                            {flexRender(
                                                                                cell.column
                                                                                    .columnDef
                                                                                    .cell,
                                                                                cell.getContext(),
                                                                            )}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                        </TableRow>
                                                    )}
                                                    {row.getIsExpanded() ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={
                                                                    row.getVisibleCells()
                                                                        .length
                                                                }
                                                            >
                                                                {renderRowSubComponent({
                                                                    row,
                                                                })}
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : null}
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25,
                                    {
                                        label: "All",
                                        value: data.length ?? 100,
                                    },
                                ]}
                                showFirstButton
                                showLastButton
                                count={pageCount || 0}
                                rowsPerPage={pagination?.pageSize || 10}
                                page={pagination?.pageIndex || 0}
                                onPageChange={(_, newPage: number) => setPageIndex(newPage)}
                                onRowsPerPageChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setPageSize(parseInt(event.target.value, 10));
                                    setPageIndex(0);
                                }}
                            />
                        </form>
                    </FormControl>

                </Grid>
            </Card>
        </Box>

    );
};


const CategoryProductsTable: React.FC<{ record: any }> = ({ record }) => {


    return (
        <Grid container>
            <Grid item xs={12}>        
                <Stack direction="row">
                    <IconButton>
                        <BadgeIcon fontSize="medium"/>
                    </IconButton>
                    <Typography variant="h5" mt={1} >Les informations de l'entreprise</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Box>
                    <List>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility" onClick={() => window.open(`http://41.111.227.13:8080/auth/uploads/${record.inscription.numRegistreFile}`)}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary="Numéro de registre"
                          />
                          <Chip label={record?.inscription?.numRegistre ?? ""} color='primary' variant="outlined" sx={{marginRight: "30%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility" onClick={() => window.open(`http://41.111.227.13:8080/auth/uploads/${record.inscription.classificationFile}`)}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary="Classification"
                          />
                          <Chip label={record?.inscription?.classification ?? ""} color='primary' variant="outlined" sx={{marginRight: "30%"}}/>

                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility" onClick={() => window.open(`http://41.111.227.13:8080/auth/uploads/${record.inscription.nifFile}`)}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary="NIF"
                          />
                          <Chip label={record?.inscription?.nif ?? ""} color='primary' variant="outlined" sx={{marginRight: "30%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility" onClick={() => window.open(`http://41.111.227.13:8080/auth/uploads/${record.inscription.nisFile}`)}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary="NIS"
                          />
                          <Chip label={record?.inscription?.nis ?? ""} color='primary' variant="outlined" sx={{marginRight: "30%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility" onClick={() => window.open(`http://41.111.227.13:8080/auth/uploads/${record.inscription.casnosFile}`)}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary="CASNOS"
                          />
                          <Chip label={record?.inscription?.casnos ?? ""} color='primary' variant="outlined" sx={{marginRight: "30%"}}/>
                        </ListItem>
                        <Divider variant='middle'/>
                        <ListItem
                          sx={{
                            height: "70px",
                            borderRadius: "20px",
                            '&:hover': {
                              boxShadow: 2
                            },
                          }}                          
                          secondaryAction={
                            <IconButton edge="end" aria-label="Visibility" onClick={() => window.open(`http://41.111.227.13:8080/auth/uploads/${record.inscription.cacobatphFile}`)}>
                              <PictureAsPdfOutlinedIcon sx={{color: "red"}} fontSize='small'/>
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary="cacobatph"
                          />
                          <Chip label={record?.inscription?.cacobatph ?? ""} color='primary' variant="outlined" sx={{marginRight: "30%"}}/>
                        </ListItem>

                    </List>
                  </Box>
            </Grid>

        </Grid>

    );
};

export default Utilisateur