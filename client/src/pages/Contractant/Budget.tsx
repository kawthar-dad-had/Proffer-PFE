import React, { useCallback, useEffect, useState } from "react";
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
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';

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
    Breadcrumbs,
    Paper,
    Select,
    MenuItem
} from "@mui/material";

import {
    AddCircleOutline,
    Label,
    RemoveCircleOutline,
    Visibility,
} from "@mui/icons-material";
import { axiosInstance } from "App";
import { useNavigate, useParams } from "@pankod/refine-react-router-v6";
  
  
 const Budget: React.FC<IResourceComponentsProps> = () => {
    const { id: offreId } = useParams();

    const [lotData, setLotData] = useState()

    const [lots, setLots] = React.useState<any[]>([])
    const [lotId, setLotId] = React.useState(0)

    const [data, setData] = React.useState<any[]>([]);
    const fetchData = async () => {
        try {
          const resp = await axiosInstance.get("/offre/offres/lot/bareme/"+lotId)
          console.log(resp);
          setLotData(resp.data)
          const response = await axiosInstance.get('/soumission/lot/'+lotId);
          console.log(response);      
          const calcul = response.data.rows.map((row: any) => {
              const budgets = response.data.rows.map((row: any) => {
                  return row.infos.budget
              })
              const delais = response.data.rows.map((row: any) => {
                  return row.infos.delai
              })
              const garanties = response.data.rows.map((row: any) => {
                  return row.infos.garantie
              })
              const minBudget = Math.min(...budgets)
              row.evaluation.budget = Math.round(minBudget * resp.data.budget / row.infos.budget);

              const minDelai = Math.min(...delais)
              row.evaluation.delai = Math.round(minDelai * resp.data.delai / row.infos.delai);
              
              const maxGarantie = Math.max(...garanties)
              row.evaluation.garantie = Math.round(row.infos.garantie * resp.data.garantie / maxGarantie);

              row.total = (Number(row?.evaluation?.materiels) ?? 0) + (Number(row?.evaluation?.garantie) ?? 0) 
                  + (Number(row?.evaluation?.delai) ?? 0) + (Number(row?.evaluation?.budget) ?? 0) 
                  + (Number(row?.evaluation?.qualTech) ?? 0) + (Number(row?.evaluation?.employes) ?? 0);
              console.log(row);
              return row
          });
          console.log(calcul);
          setData(calcul.sort((a: any, b: any) => b.total - a.total));
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {    
        fetchData();
      }, [lotId]);

    const fetchData1 = async() => {
        const resp1 = await axiosInstance.get("/offre/offres/results/lots/auto/complete/"+offreId)
        setLots(resp1.data)
        setLotId(resp1.data[0].id)
    }

    useEffect(() => {
        fetchData1()
    },[offreId])
    
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

    const navigate = useNavigate()
    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "entreprise",
                accessorKey: "nom",
                header: "Soumissionnaire",
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
                id: "qualTech",
                accessorKey: "evaluation.qualTech",
                header: "Evaluation technique",
                cell: function render({ getValue }) {
                    return <Typography key="name">{getValue() as string}</Typography>;
                },
            },
            {
                id: "evaluationAutomatique",
                accessorKey: "evaluationAutomatique",
                header: "Evaluation automatique",
                cell: function render({ row }) {
                    return <Typography key="state">{
                        //@ts-ignore
                        (Number(row?.original?.evaluation?.materiels) ?? 0) + (Number(row?.original?.evaluation?.garantie) ?? 0) + (Number(row?.original?.evaluation?.delai) ?? 0) + (Number(row?.original?.evaluation?.budget) ?? 0) + (Number(row?.original?.evaluation?.employes) ?? 0)
                    }
                    </Typography>
                },
            },
            {
              id: "infos.budget",
              accessorKey: "budget",
              header: "Budget",
              cell: function render({ getValue }) {
                    return <Typography>{getValue()  as string}</Typography>;
              },
            },
            {
              id: "total",
              accessorKey: "total",
              header: "Note totale",
              cell: function render({ getValue }) {
                return <Typography key="state">{(getValue() as string)}</Typography>;
              },
              enableSorting: true,
            },
            {
                id: "actions",
                accessorKey: "cahierDesCharges",
                header: 'Cahier des charges',
                cell: function render({ getValue }) {
                    return (
                        <Stack direction="row">
                                <IconButton
                                    onClick={() => {
                                        window.open('http://41.111.227.13:8080/soumission/uploads/'+getValue() as string);
                                    }}
                                >
                                    <Visibility sx={{color: "primary.main"}} fontSize="large" />
                                </IconButton>
                            
                        </Stack>
                    );
                },
            },
        ],
        [t],
    );
    
    
    const {
        options: {
            state: { pagination },
            pageCount,
        },
        getHeaderGroups,
        getRowModel,
        setPageIndex,
        setPageSize,
    } = useTable({
        columns,
        data
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
                <Grid item xs={12}>
                        <div role="presentation" onClick={handleClick}>
                          <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                              component="a"
                              href="/offre/create"
                              onClick={() => { navigate("/rendezvous")}}
                              label="Rendez-Vous"
                              icon={<Groups3OutlinedIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                              component="a" 
                              href="#" 
                              onClick={() => { navigate("/rendezvous/show")}}
                              label="Résultat"
                              icon={<PointOfSaleOutlinedIcon fontSize="small" />}
                              />
                          </Breadcrumbs>
                        </div>
                      </Grid>
                    <Grid item mr={1} mt={1}>
                        <GroupIcon fontSize='large'/>
                    </Grid>
                    <Grid item xs={10}  mt={1}>
                        <Typography variant="h4">Les résultats</Typography>
                    </Grid>
                    <Typography color={"#a9afb9"} fontSize={"13px"}>Visualiser les résultats finaux des soumissions</Typography>
                    <Grid ml={4} mt={2} item xs={12}>
                      <Stack direction="row" spacing={2} alignItems={"center"}>
                        <Typography fontWeight={"bold"}>Séléctionner un lot:</Typography>
                        <Select value={lots[0]?.name ?? ""}>
                            {lots.map((lot: any) => (
                                <MenuItem key={lot.id} value={lot.name}>
                                    {lot.name}
                                </MenuItem>
                            ))}
                        </Select>
                                               
                      </Stack>
                      <Typography  fontWeight={"bold"}>Le barème:</Typography>
                      <Stack direction={"row"} spacing={3} justifyContent={"center"}>
                        <Stack direction="row" width={"fit-content"} sx={{border: 1, borderRadius: 20 , padding: 1, color: "primary.main"}}>
                            <Typography ml={3} mr={2} >Evaluation financière</Typography>
                            <ArrowRightAltOutlinedIcon />
                            <Typography ml={2} >{
                            //@ts-ignore
                            lotData?.budget ?? "?"
                            } points</Typography>
                        </Stack>
                        <Stack direction="row" width={"fit-content"} sx={{border: 1, borderRadius: 20 , padding: 1, color: "primary.main"}}>
                            <Typography ml={3} mr={2} >Délai de réalisation</Typography>
                            <ArrowRightAltOutlinedIcon />
                            <Typography ml={2} >{
                            //@ts-ignore
                            lotData?.delai ?? "?"
                            } points</Typography>
                        </Stack>
                        <Stack direction="row" width={"fit-content"} sx={{border: 1, borderRadius: 20 , padding: 1, color: "primary.main"}}>
                            <Typography ml={3} mr={2} >Garantie des équipements</Typography>
                            <ArrowRightAltOutlinedIcon />
                            <Typography ml={2} >{
                            //@ts-ignore
                            lotData?.garantie ?? "?"
                            } points</Typography>
                        </Stack>
                        <Stack direction="row" width={"fit-content"} sx={{border: 1, borderRadius: 20 , padding: 1, color: "primary.main"}}>
                            <Typography ml={3} mr={2} >Le matériel et equipments</Typography>
                            <ArrowRightAltOutlinedIcon />
                            <Typography ml={2} >{
                                //@ts-ignore
                                lotData?.materiels ?? "?"
                            } points</Typography>
                        </Stack>
                        <Stack direction="row" width={"fit-content"} sx={{border: 1, borderRadius: 20 , padding: 1, color: "primary.main"}}>
                            <Typography ml={3} mr={2} >L'effectif</Typography>
                            <ArrowRightAltOutlinedIcon />
                            <Typography ml={2} >{
                                //@ts-ignore
                                lotData?.employes ?? "?"
                            } points</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
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


//@ts-ignore
function createData(Critère, Valeur, Note) {
  return { Critère, Valeur, Note };
}



const CategoryProductsTable: React.FC<{ record: any }> = ({ record }) => {

    const rows = [
        createData('Evaluation financière',  record.infos.budget, record.evaluation.budget),
        createData('Délai de réalisation',record.infos.delai, record.evaluation.delai),
        createData('Garantie des équipements',  record.infos.garantie, record.evaluation.garantie),
        createData('Matériels', record.evaluation.materiels, record.evaluation.materiels),
        createData('L\'effectif', record.evaluation.employes, record.evaluation.employes),
        createData('Qualité Technique',  '-', record.evaluation.qualTech),
    ];
    return (
      <Grid container>
        <Grid item xs={12}>        
          <Stack direction="row">
              <IconButton>
                  <BadgeIcon fontSize="medium"/>
              </IconButton>
              <Typography variant="h5" mt={1} >Détails de l'evaluation</Typography>
          </Stack>
        </Grid>
      
        <TableContainer sx={{marginTop: 1}} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                <TableCell sx={{fontWeight: "bold", fontSize: 15}} align="left">Critère</TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: 15}} align="center">Valeur</TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: 15}} align="right">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow>
                  <TableCell align="left">{row.Critère}</TableCell>
                  <TableCell align="center">{row.Valeur}</TableCell>
                  <TableCell align="right">{row.Note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
};

export default Budget