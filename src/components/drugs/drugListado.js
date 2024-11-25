import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';


import { useNavigate } from 'react-router-dom';

import drugService from '../../services/drugService';

export default function DrugListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [drugs, setDrugs] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [drugActual, setDrugActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        drugService.buscarTodos().then(res => {
            setDrugs(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    function nuevoDrug() {
        navigate("nuevo"); // navega a URL para creacion de nuevo drug
    }

    function editarDrug(drug) {
        // setDrugActual(drug); // no necesario
        navigate(drug.id.toString()); // navega a URL del drug
    }

    function confirmarBorradoDrug(drug) {
        setDrugActual(drug);
        setDialogoBorrado(true);
    }

    function borrarDrug() {
        drugService.eliminar(drugActual.id).catch((err) => { //Captura error en peticion HTTP
            alert("Error borrando entidad.\n"+err.message);
        });
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setDrugActual(null);
        setDialogoBorrado(false);
    }

    function buscarPorNombre() {
        setCargando(true);
        drugService.buscarPorNombre(textoBusqueda).then(res => {
            setDrugs(res.data);
            setCargando(false);
        });
    }
    function buscarTodos() {
        setCargando(true);
        drugService.buscarTodos().then(res => {
            setDrugs(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }


    function accionesDrug(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarDrug(rowData)} tooltip="Ver/editar el drug" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoDrug(rowData)} tooltip="Eliminar el drug" />
            </React.Fragment>
        );
    }


    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado}  />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarDrug}  />
        </React.Fragment>
    );

    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de drugs</div>

            <div className="grid">
                <InputText id="busqueda" className="col-6 mr-2" onChange={onBusquedaChange} />
                <Button label="Buscar por nombre" className="col-1 mr-2" onClick={buscarPorNombre} />
                <Button label="Buscar todos" className="col-1 mr-2" onClick={buscarTodos} />
            </div>


            <div className="flex justify-content-end">
                <Button label="Nuevo drug" icon="pi pi-plus" className="p-button-lg" onClick={nuevoDrug} tooltip="Crear un nuevo drug" tooltipOptions={{ position: 'bottom' }} />
            </div>


            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={drugs} responsiveLayout="scroll" stripedRows emptyMessage="No hay drugs que mostrar">
                    <Column field="atc" header="ATC" sortable/>
                    <Column field="activePrinciple" header="Principio Activo" sortable />
                    <Column field="reasonToAvoid" header="Razón para evitar"/>
                    <Column field="alternative" header="Alternativa" />
                    <Column field="isPrimaryCare" header="Atención Primaria?" sortable />
                    <Column body={accionesDrug} />
                </DataTable>
            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirmar borrado" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {drugActual && <span>Confirmar el borrado de <b>{drugActual.activePrinciple}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}