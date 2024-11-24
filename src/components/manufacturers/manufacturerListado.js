import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';


import { useNavigate } from 'react-router-dom';

import manufacturerService from '../../services/manufacturerService.js';

export default function ManufacturerListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [manufacturers, setManufacturers] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [manufacturerActual, setManufacturerActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        manufacturerService.buscarTodos().then(res => {
            setManufacturers(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    function nuevoManufacturer() {
        navigate("nuevo"); // navega a URL para creacion de nuevo manufacturer
    }

    function editarManufacturer(manufacturer) {
        // setManufacturerActual(manufacturer); // no necesario
        navigate(manufacturer.name); // navega a URL del manufacturer
    }

    function confirmarBorradoManufacturer(manufacturer) {
        setManufacturerActual(manufacturer);
        setDialogoBorrado(true);
    }

    function borrarManufacturer() {
        manufacturerService.eliminar(manufacturerActual.name).catch((err) => { //Captura error en peticion HTTP
            alert("Error borrando entidad.\n"+err.message);
        });
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setManufacturerActual(null);
        setDialogoBorrado(false);
    }

    function buscarPorNombre() {
        setCargando(true);
        manufacturerService.buscarPorNombre(textoBusqueda).then(res => {
            setManufacturers(res.data);
            setCargando(false);
        });
    }


    function buscarTodos() {
        setCargando(true);
        manufacturerService.buscarTodos().then(res => {
            setManufacturers(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }


    function accionesManufacturer(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarManufacturer(rowData)} tooltip="Ver/editar el manufacturer" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoManufacturer(rowData)} tooltip="Eliminar el manufacturer" />
            </React.Fragment>
        );
    }


    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado}  />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarManufacturer}  />
        </React.Fragment>
    );

    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de manufacturers</div>

            <div className="grid">
                <InputText id="busqueda" className="col-6 mr-2" onChange={onBusquedaChange} />
                <Button label="Buscar por nombre" className="col-1 mr-2" onClick={buscarPorNombre} />
                <Button label="Buscar todos" className="col-1 mr-2" onClick={buscarTodos} />
            </div>


            <div className="flex justify-content-end">
                <Button label="Nuevo manufacturer" icon="pi pi-plus" className="p-button-lg" onClick={nuevoManufacturer} tooltip="Crear un nuevo manufacturer" tooltipOptions={{ position: 'bottom' }} />
            </div>


            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={manufacturers} responsiveLayout="scroll" stripedRows emptyMessage="No hay manufacturers que mostrar">
                    <Column field="name" header="Name" sortable/>
                    <Column field="cif" header="CIF" sortable />
                    <Column field={
                        (rowData) => `nº ${rowData.address?.number || ''} ${rowData.address?.floor ? `Piso ${rowData.address.floor}` : ''} ${rowData.address?.letra || ''}, ${rowData.address?.road || ''}, ${rowData.address?.city || ''}, ${rowData.address?.region || ''}, ${rowData.address?.country || ''}`}
                    header="Address"/>
                    <Column body={accionesManufacturer} />
                </DataTable>
            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirmar borrado" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {manufacturerActual && <span>Confirmar el borrado de <b>{manufacturerActual.name}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}