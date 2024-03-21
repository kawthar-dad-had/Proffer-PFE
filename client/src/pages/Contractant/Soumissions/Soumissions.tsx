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
import { Visibility } from '@mui/icons-material';
import { GridColumns, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import AllInboxIcon from '@mui/icons-material/AllInbox';
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

import { EditProduct } from "../../../components/Products/edit";
import { axiosInstance } from "App";
import moment from "moment";
  
  
export const Soumissions: React.FC<IResourceComponentsProps> = () => {
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
                accessorKey: "offre.name",
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
                id: "lot",
                accessorKey: "name",
                header: "Lot",
                cell: function render({ getValue }) {
                    return <Typography key="name">{getValue() as string}</Typography>;
                },
            },
            {
                id: "state",
                accessorKey: "offre.state",
                header: "Etat",
                cell: function render({ getValue }) {
                    return  <Chip label={getValue() as string}sx={{color: "#FFAF22" , borderColor: "#FFAF22"}} variant="outlined"/>
                },
            },
            {
                id: "dDay",
                accessorKey: "offre.dDay",
                header: "Dernier Délai",
                cell: function render({ getValue }) {
                    return <Typography key="name">{moment(getValue() as string).format("DD/MM/YYYY")}</Typography>;
                },
            },

        ],
        [t],
    );
    
    const [data, setData] = React.useState<any[]>([]);
    const [count, setCount] = React.useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axiosInstance.get('soumission/offres/mes_offres/lots');
            setData(response.data.rows);
            setCount(response.data.count)
          } catch (error) {
            console.error(error);
          }
        };
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
        data: data, 
        pageCount: count,   
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
                        <AllInboxIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Soumissions</Typography>
                    </Grid>
                    <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser ou gérer les soumissions</Typography>
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
                                                        sx={{fontSize: 15 , color: "success.main"}}
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
        resource: `soumission/lot/${record.id}`,
        initialPageSize: 5,
        syncWithLocation: false,
    });
    const [data, setData] = React.useState<any[]>([]);
    
    const [count, setCount] = React.useState(0);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axiosInstance.get(`soumission/lot/${record.id}`);
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
                field: "nom",
                headerName: "Soumissionnaire",
                flex: 1,
                minWidth: 180,
            },
            {
                field: "dateDepot",
                headerName: "Date de dépot",
                flex: 1,
                minWidth: 200,
                valueGetter(params) {
                    return moment(new Date(parseInt(params.row.dateDepot,10))).format("DD/MM/YYYY");
                },
            },            
            {
                field: "state",
                headerName: "Etat",
                flex: 1,
                minWidth: 100,
            },
            {
                field: "cahierDesCharges",
                headerName: "Cahier des charges",
                type: "actions",
                getActions: function render({ row }) {
                    return [
                        <IconButton onClick={() => window.open(`http://41.111.227.13:8080/soumission/uploads/${row.infos.cahierDesCharges}`)}>
                            <Visibility sx={{color: "primary.main"}}/>
                        </IconButton>
                    ];
                },
                flex: 0.5,
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
                <Typography variant="h4">Soumissions</Typography>
            </Grid>
            <Grid item xs={12}>
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    rows={data}
                    rowCount={count}
                    pagination
                    paginationMode="client"
                    autoHeight
                    density="comfortable"
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
                <EditProduct {...editDrawerFormProps} />

            </Grid>

        </Grid>

    );
};