import { DocumentScanner } from '@mui/icons-material'
import { AppBar, Button, Card, Dialog, DialogContent, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { EventoInterface, PosteInterface, ReporteInterface } from '../../../interfaces/interfaces';
import { SesionContext } from '../../../context/SesionProvider';
import { getReporteGeneral } from '../../../api/reporte.api';
import { useSnackbar } from 'notistack';
import { GridCloseIcon } from '@mui/x-data-grid-premium';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getPoste } from '../../../api/Poste.api';
import { url } from '../../../api/url';


interface ReporteRecorridoDialogProps {
    filtro: ReporteInterface;

}

const ReporteRecorridoDialog: React.FC<ReporteRecorridoDialogProps> = ({ filtro }) => {

    const [open, setOpen] = useState(false);
    const [list, setList] = useState<EventoInterface[]>([]);
    const [listPoste, setListPoste] = useState<PosteInterface[]>([]);

    const { sesion } = useContext(SesionContext);
    const { enqueueSnackbar } = useSnackbar();




    const handleClickOpen = async () => {
        const TempEvento = await getReporteGeneral(filtro, sesion.token)
        //const Temp: CiudadInterface[] = await getCiudad(sesion.token)
        const TempPoste = await getPoste(sesion.token)

        const TempList: EventoInterface[] = []
        const TempListPoste: PosteInterface[] = []

        TempEvento.map(evento => {
            const tempCiudadA: number | null = evento.poste?.ciudadA?.id ? evento.poste?.ciudadA?.id : null
            const tempCiudadB: number | null = evento.poste?.ciudadB?.id ? evento.poste?.ciudadB?.id : null
            if (tempCiudadA === filtro.TramoInicial && tempCiudadB === filtro.TramoFinal || tempCiudadB === filtro.TramoInicial && tempCiudadA === filtro.TramoFinal) {
                TempList.push(evento)
            }
        })

        TempPoste.map(poste => {
            const tempCiudadA: number | null = poste.ciudadA?.id ? poste.ciudadA?.id : null
            const tempCiudadB: number | null = poste.ciudadB?.id ? poste.ciudadB?.id : null
            if (tempCiudadA === filtro.TramoInicial && tempCiudadB === filtro.TramoFinal || tempCiudadB === filtro.TramoInicial && tempCiudadA === filtro.TramoFinal) {
                TempListPoste.push(poste)
            }
        })

        if (TempList.length > 0) {
            setList(TempList)
            setListPoste(TempListPoste)

            setOpen(true);
            console.log("--------------------------------")
            console.log(TempList)
            console.log("--------------------------------")
        }
        else {
            enqueueSnackbar("No hay datos", {
                variant: "warning",
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <React.Fragment>
            <Button startIcon={<DocumentScanner />} onClick={handleClickOpen}>
                {"Generar Reporte"}
            </Button>
            <Dialog
                fullScreen
                fullWidth
                open={open}
                onClose={handleClose}

            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <GridCloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {"Reporte de Recorrido"}
                        </Typography>

                    </Toolbar>
                </AppBar>
                <DialogContent sx={{ backgroundColor: "#cccccc53" }}>
                    {list.length > 0 ?
                        <Grid container>
                            <Grid item md={12}>
                                <Typography
                                    sx={{ fontSize: 30, textAlign: 'center' }}
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Reporte {listPoste[0].ciudadA?.name} - {listPoste[0].ciudadB?.name}
                                </Typography>
                            </Grid>
                            <Grid item md={12}>
                                <Typography
                                    sx={{ fontSize: 20, textAlign: 'center' }}
                                    color="text.secondary"
                                >
                                    Fecha del {filtro.fechaInicial?.toLocaleDateString()} al {filtro.fechaFinal?.toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item container sm={12} md={4}>
                                <Grid sm={6} md={12}>
                                    <Card>
                                        <Grid>
                                            <Grid display={"flex"} justifyContent={'center'} >
                                                <img src={`${url}${listPoste[0].ciudadA?.image}`} style={{ height: 200 }} />

                                            </Grid>
                                            <Grid display={"flex"} justifyContent={"space-between"} >
                                                <Grid alignContent={'center'}>
                                                    <Typography
                                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                                        color="text.secondary"
                                                        fontWeight="bold"

                                                    >
                                                        L {listPoste[0].ciudadA?.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid>
                                                    <Typography
                                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                                        color="text.secondary"
                                                    >
                                                        Lat: {listPoste[0].ciudadA?.lat}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                                        color="text.secondary"
                                                    >
                                                        Lng: {listPoste[0].ciudadA?.lng}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid sm={6} md={12}>
                                    <Card>
                                        <Grid>
                                            <Grid display={"flex"} justifyContent={'center'} >
                                                <img src={`${url}${listPoste[0].ciudadB?.image}`} style={{ height: 200 }} />

                                            </Grid>
                                            <Grid display={"flex"} justifyContent={"space-between"} >
                                                <Grid alignContent={'center'}>
                                                    <Typography
                                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                                        color="text.secondary"
                                                        fontWeight="bold"

                                                    >
                                                        L {listPoste[0].ciudadB?.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid>
                                                    <Typography
                                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                                        color="text.secondary"
                                                    >
                                                        Lat: {listPoste[0].ciudadB?.lat}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                                        color="text.secondary"
                                                    >
                                                        Lng: {listPoste[0].ciudadB?.lng}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </Card>
                                </Grid>

                            </Grid>
                            <Grid item sm={12} md={4}>
                                <Card>


                                    <Typography
                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                        color="text.secondary"
                                    >
                                        Eventos del tramo
                                    </Typography>
                                    {/* @ts-expect-error No se sabe el tipo de event */}
                                    <MapContainer center={[listPoste[0].ciudadA?.lat, listPoste[0].ciudadA?.lng]}
                                        zoom={8}
                                        style={{ height: "564px" }}
                                        scrollWheelZoom={false}

                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                                        {
                                            list?.map((item, i) => {
                                                return <Marker key={i} position={[item.poste?.lat, item.poste?.lng]}>
                                                    <Popup>Poste {item.poste?.name}</Popup>
                                                </Marker>
                                            }
                                            )
                                        }
                                    </MapContainer>
                                </Card>
                            </Grid>

                            <Grid item sm={12} md={4}>
                                <Card>
                                    <Typography
                                        sx={{ fontSize: 16, textAlign: 'center' }}
                                        color="text.secondary"
                                    >
                                        Postes del tramo
                                    </Typography>
                                    {/* @ts-expect-error No se sabe el tipo de event */}
                                    <MapContainer center={[listPoste[0].ciudadA?.lat, listPoste[0].ciudadA?.lng]}
                                        zoom={8}
                                        style={{ height: "564px" }}
                                        scrollWheelZoom={false}

                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

                                        {
                                            listPoste?.map((item, i) => {
                                                return <Marker key={i} position={[item.lat, item.lng]} >
                                                    <Popup>Poste {item.name}</Popup>
                                                </Marker>
                                            }
                                            )
                                        }
                                        <Marker position={[listPoste[0].ciudadA?.lat, listPoste[0].ciudadA?.lng]} >
                                            <Popup> {listPoste[0].ciudadA?.name}</Popup>
                                        </Marker>
                                        <Marker position={[listPoste[0].ciudadB?.lat, listPoste[0].ciudadB?.lng]} >
                                            <Popup> {listPoste[0].ciudadB?.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </Card>
                            </Grid>
                        </Grid>
                        : null}



                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default ReporteRecorridoDialog