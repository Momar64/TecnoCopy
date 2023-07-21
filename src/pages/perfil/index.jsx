import CambioPass from '@/components/perfil/CambioPass'
import { getFormData } from '@/lib/utils/getFormData';
import { Box, Button, Card, CardContent, CardHeader, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import Alerta from '@/components/Alerta';
import Loader from '@/components/Loader';
const index = () => {
    const { data: session, status } = useSession()

    const [datos, setDatos] = useState(null);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("error");
    const [message, setMessage] = useState("");
    const handleEdit = async (e) => {
        e.preventDefault();
        var nuevos_datos = getFormData(e.currentTarget);
        nuevos_datos.id = session.user._id;
        const res = await fetch(process.env.NODE_ENV != 'development' ? "https://tecno-copy.vercel.app/api/empleados" : "/api/empleados",
            { method: 'PUT', body: JSON.stringify(nuevos_datos) }
        );
        const respuesta = await res.json();
        console.log(respuesta.message);
        // respuesta de api
        handleAlert(respuesta.message, respuesta.status);
        if (respuesta.status == "success") {
            setDatos(null);
            refresh();

        }
    }
    // llamar a api para obtener datos del empleado
    const getDatos = async () => {
        const res = await fetch(process.env.NODE_ENV != 'development' ? "https://tecno-copy.vercel.app/api/perfil" : "/api/perfil");
        const respuesta = await res.json();
        if (respuesta.status == 'success') {
            setDatos(respuesta.data);
        }
    }
    useEffect(() => {
        getDatos();
    }, [])
    const handleAlert = (msj, severidad) => {
        setMessage(msj);
        setSeverity(severidad);
        setOpen(true);
    }
    const refresh = async () => {
        getDatos();
    }
    return (
        <Box sx={{ m: 2 }}>
            <Alerta open={open} setOpen={setOpen} severity={severity} message={message} />
            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <CambioPass />
                </Grid>
                <Grid item xs={12} lg={6}>
                    {datos &&
                        <Card sx={{ boxShadow: 3 }}>
                            <CardHeader title={
                                <Typography variant='h5'>Editar perfil de {datos.name ?? ''}</Typography>
                            } />

                            <CardContent>
                                <Grid container component='form' onSubmit={handleEdit} spacing={2} sx={{ mr: 2, alignItems: 'center' }}>
                                    <Grid item xs={3}>Correo:</Grid>
                                    <Grid item xs={9}>
                                        <TextField required fullWidth name='email' defaultValue={datos.email ?? ''} />
                                    </Grid>
                                    <Grid item xs={3}>Calle:</Grid>
                                    <Grid item xs={9}>
                                        <TextField required fullWidth name='address1' defaultValue={datos.address ? datos.address.split('|')[0].trim() : ''} />
                                    </Grid>
                                    <Grid item xs={3}>Colonia:</Grid>
                                    <Grid item xs={9}>
                                        <TextField required fullWidth name='address2' defaultValue={datos.address ? datos.address.split('|')[1].trim() : ''} />
                                    </Grid>
                                    <Grid item xs={3}>Ciudad y estado:</Grid>
                                    <Grid item xs={9}>
                                        <TextField required fullWidth name='address3' defaultValue={datos.address ? datos.address.split('|')[2].trim() : ''} />
                                    </Grid>
                                    <Grid item xs={3}>RFC:</Grid>
                                    <Grid item xs={9}>
                                        <TextField fullWidth name='rfc' defaultValue={datos.rfc ?? ''} />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                        <Button type='submit' variant='contained' color='success'>
                                            Guardar
                                        </Button>

                                    </Grid>
                                </Grid>
                            </CardContent>

                        </Card>
                        ||
                        <Loader />
                    }
                </Grid>
            </Grid >
        </Box>
    )
}

export default index
