import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';


import { useNavigate } from 'react-router-dom';

import alertService from '../../services/alertService.js';

export default function AlertListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [alerts, setAlerts] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [alertActual, setAlertActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        alertService.buscarTodos().then(res => {
            setAlerts(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    function nuevoAlert() {
        navigate("nuevo"); // navega a URL para creacion de nuevo alert
    }

    function editarAlert(alert) {
        // setAlertActual(alert); // no necesario
        navigate(alert.idHealthAlert.toString()); // navega a URL del alert
    }

    function confirmarBorradoAlert(alert) {
        setAlertActual(alert);
        setDialogoBorrado(true);
    }

    function borrarAlert() {
        alertService.eliminar(alertActual.idHealthAlert).catch((err) => { //Captura error en peticion HTTP
            alert("Error borrando entidad.\n" + err.message);
        });
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setAlertActual(null);
        setDialogoBorrado(false);
    }

    function buscarTodos() {
        setCargando(true);
        alertService.buscarTodos().then(res => {
            setAlerts(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }

    function accionesAlert(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarAlert(rowData)} tooltip="Ver/editar el alert" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoAlert(rowData)} tooltip="Eliminar el alert" />
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
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarAlert} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de alerts</div>

            <div className="grid">
                <InputText id="busqueda" className="col-6 mr-2" onChange={onBusquedaChange} />
                <Button label="Buscar todos" className="col-1 mr-2" onClick={buscarTodos} />
            </div>


            <div className="flex justify-content-end">
                <Button label="Nuevo alert" icon="pi pi-plus" className="p-button-lg" onClick={nuevoAlert} tooltip="Crear un nuevo alert" tooltipOptions={{ position: 'bottom' }} />
            </div>


            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={alerts} responsiveLayout="scroll" stripedRows emptyMessage="No hay alerts que mostrar">
                    <Column field="idHealthAlert" header="idHealthAlert" sortable />
                    <Column field="organization" header="Organización" sortable />
                    <Column header="Enlace" body={(rawData) => enlaceTemplate(rawData.alertLink)} sortable />
                    <Column body={accionesAlert} />
                </DataTable>

            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirmar borrado" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {alertActual && <span>Confirmar el borrado de <b>{alertActual.idHealthAlert}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}