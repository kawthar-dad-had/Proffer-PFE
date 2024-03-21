import React, { useCallback, useEffect } from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    HttpError,
} from "@refinedev/core";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender, Row } from "@tanstack/react-table";
import {
    EditButton,
    SaveButton,
    useDataGrid,
} from "@refinedev/mui";

import { GridColumns, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
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
    Breadcrumbs,
    Grid,
    Chip,
    emphasize,
    styled,
    FormControl,
} from "@mui/material";

import {
    Edit,
    AddCircleOutline,
    RemoveCircleOutline,
} from "@mui/icons-material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { Visibility } from '@mui/icons-material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { EditProduct } from "../../components/Products/edit";
import { axiosInstance } from "App";
import moment from "moment";
import Swal from "sweetalert2";
import { useUpdate } from "@pankod/refine-core";
  
  
 const OffresMin: React.FC<IResourceComponentsProps> = () => {
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
                id: "offre",
                accessorKey: "name",
                header: "Offre",
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
                id: "contractant",
                accessorKey: "user.inscription.nom",
                header: "Contractant",
                cell: function render({ getValue }) {
                    return <Typography key="name">{getValue() as string}</Typography>;
                },
            },
            {
                id: "deadline",
                accessorKey: "dDay",
                header: "Dernier délai",
                cell: function render({ getValue }) {
                    return <Typography key="name">{moment(getValue() as string).format("DD/MM/YYYY")}</Typography>;
                },
            },
            {
                id: "ville",
                accessorKey: "ville",
                header: "Ville",
                cell: function render({ getValue }) {
                    return <Typography key="state">{getValue()  as string}</Typography>;
                },
            },
            {
              id: "evaluateur",
              accessorKey: "evaluateur.last_name",
              header: "Evaluateur",
              cell: function render({ getValue }) {
                  return <Typography key="state">{getValue()  as string}</Typography>;
              },
          },
          {
            id: "cahierDesCharges",
            header: "Cahier des charges",
            accessorKey: "cahierDesCharges",
            type: "actions",
            cell: function render({ getValue }) {

                return [
                    <IconButton onClick={() => window.open(`http://41.111.227.13:8080/offre/uploads/${getValue() as string}`)}>
                        <Visibility sx={{color: "primary.main"}}/>
                    </IconButton>
                ];
            },
            flex: 0.5,
            minWidth: 100,
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
                                    title: 'Voulez vous validez cette offre?',
                                    showCancelButton: true,
                                    confirmButtonText: 'Confirmer',
                                    cancelButtonText: 'Annuler',
                                  }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      mutate({
                                        resource: 'offre/offres/dashboard',
                                        id: getValue() as string,
                                        values: {
                                            state: "Approuvé"
                                        },
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
                                    title: 'Voulez vous refusez cette offre?',
                                    showCancelButton: true,
                                    confirmButtonText: 'Confirmer',
                                    cancelButtonText: 'Annuler',
                                  }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                      mutate({
                                        resource: 'offre/offres/dashboard',
                                        id: getValue() as string,
                                        values: {
                                            state: "Non Approuvé"
                                        },
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
                    )
                },
            },
        ],
        [t],
    );
    
    const [data, setData] = React.useState<any[]>([]);
    const [count, setCount] = React.useState(0)
    
    const fetchData = async () => {
        try {
          const response = await axiosInstance.get('offre/offres/');
          setData(response.data.rows);
          
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
                        <BusinessCenterIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={11}  mt={1}>
                        <Typography variant="h4">Offres</Typography>
                    </Grid>
                    <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer les offres</Typography>
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
    const t = useTranslate();

    const { dataGridProps } = useDataGrid<any>({
        resource: `offre/offres/lots/${record.id}`,
        initialPageSize: 5,
        syncWithLocation: false,
    });
    const [data, setData] = React.useState<any[]>([]);
    const [count, setCount] = React.useState(0)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axiosInstance.get(`offre/offres/lots/${record.id}`);
            setData(response.data.rows);
            setCount(response.data.count)
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, []);

    console.log(dataGridProps);
    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "name",
                headerName: "Lot",
                flex: 1,
                minWidth: 150,
            },
            {
                field: "domaine",
                headerName: "Domaine",
                flex: 1,
                minWidth: 120,
            },
            {
                field: "materiels",
                headerName: "Evaluation de matériels",
                flex: 1,
                minWidth: 100,
            },
            {
              field: "employes",
              headerName: "Evaluation d'effectif",
              flex: 1,
              minWidth: 100,
            },
            {
              field: "delai",
              headerName: "Evaluation de delai",
              flex: 1,
              minWidth: 100,
            },
            {
              field: "garantie",
              headerName: "Evaluation de garantie",
              flex: 1,
              minWidth: 100,
            },
            {
              field: "qualTech",
              headerName: "Evaluation technique",
              flex: 1,
              minWidth: 100,
            },
            {
                field: "budget",
                headerName: "Evaluation financière",
                flex: 1,
                minWidth: 100,
              },
        ],
        [t],
    );


    const editDrawerFormProps = useModalForm<any, HttpError, any>({
        refineCoreProps: {
            action: "edit",
            resource: "products",
            redirect: false,
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    return (
        <Grid container>
            <Grid item xs={2}  m={2}>
                <Typography variant="h4">Lots</Typography>
            </Grid>
            <Grid item xs={12}>
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    rows={data}
                    rowCount={count}
                    autoHeight
                    density="comfortable"
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
                <EditProduct {...editDrawerFormProps} />

            </Grid>

        </Grid>

    );
};

export default OffresMin