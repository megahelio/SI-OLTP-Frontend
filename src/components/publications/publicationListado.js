import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';


import { useNavigate } from 'react-router-dom';

import publicationService from '../../services/publicationService.js';

export default function PublicationListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [publications, setPublications] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [publicationActual, setPublicationActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        publicationService.buscarTodos().then(res => {
            setPublications(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    function nuevoPublication() {
        navigate("nuevo"); // navega a URL para creacion de nuevo publication
    }

    function editarPublication(publication) {
        // setPublicationActual(publication); // no necesario
        navigate(publication.id.toString()); // navega a URL del publication
    }

    function confirmarBorradoPublication(publication) {
        setPublicationActual(publication);
        setDialogoBorrado(true);
    }

    function borrarPublication() {
        publicationService.eliminar(publicationActual.id).catch((err) => { //Captura error en peticion HTTP
            alert("Error borrando entidad.\n" + err.message);
        });
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setPublicationActual(null);
        setDialogoBorrado(false);
    }

    function buscarTodos() {
        setCargando(true);
        publicationService.buscarTodos().then(res => {
            setPublications(res.data);
            setCargando(false);
        });
    } 
    function buscarPorYear() {
        setCargando(true);
        publicationService.buscarPorYear(textoBusqueda).then(res => {
            setPublications(res.data);
            setCargando(false);
        });
    }
    

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }

    function accionesPublication(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarPublication(rowData)} tooltip="Ver/editar el publication" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoPublication(rowData)} tooltip="Eliminar el publication" />
            </React.Fragment>
        );
    }
    function enlaceTemplate(link) {
        return (
            <Button
                label="Ver enlace"
                icon="pi pi-external-link"
                className="p-button-link"
                onClick={() => window.open(link, '_blank')}
            />
        );
    };

    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarPublication} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de publications</div>

            <div className="grid">
                <InputText id="busqueda" className="col-6 mr-2" onChange={onBusquedaChange} />
                <Button label="Buscar por año" className="col-1 mr-2" onClick={buscarPorYear} />
                <Button label="Buscar todos" className="col-1 mr-2" onClick={buscarTodos} />
            </div>


            <div className="flex justify-content-end">
                <Button label="Nuevo publication" icon="pi pi-plus" className="p-button-lg" onClick={nuevoPublication} tooltip="Crear un nuevo publication" tooltipOptions={{ position: 'bottom' }} />
            </div>


            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={publications} responsiveLayout="scroll" stripedRows emptyMessage="No hay publications que mostrar">
                    {/* <Column field="id" header="ID" sortable/> */}
                    <Column field="year" header="Year" sortable />
                    <Column header="Enlace" body={(rawData) => enlaceTemplate(rawData.publicationLink)} sortable />
                    <Column body={accionesPublication} />
                </DataTable>

            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirmar borrado" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {publicationActual && <span>Confirmar el borrado de <b>{publicationActual.year}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}