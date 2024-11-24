import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';


import { useNavigate } from 'react-router-dom';

import productService from '../../services/productService.js';

export default function ProductListado(props) {

    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [products, setProducts] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [productActual, setProductActual] = useState(null);
    const [dialogoBorrado, setDialogoBorrado] = useState(false);

    let navigate = useNavigate();


    useEffect(() => {
        productService.buscarTodos().then(res => {
            setProducts(res.data);
            setCargando(false);
        });
    }, [dialogoBorrado]); // vincula la recarga a cambios en dialogoBorrado (para forzar la recarga despues de un borrado)


    function nuevoProduct() {
        navigate("nuevo"); // navega a URL para creacion de nuevo product
    }

    function editarProduct(product) {
        // setProductActual(product); // no necesario
        navigate(product.gtin.toString()); // navega a URL del product
    }

    function confirmarBorradoProduct(product) {
        setProductActual(product);
        setDialogoBorrado(true);
    }

    function borrarProduct() {
        productService.eliminar(productActual.gtin).catch((err) => { //Captura error en peticion HTTP
            alert("Error borrando entidad.\n" + err.message);
        });
        ocultarDialogoBorrado();
    }

    function ocultarDialogoBorrado() {
        setProductActual(null);
        setDialogoBorrado(false);
    }

    function buscarTodos() {
        setCargando(true);
        productService.buscarTodos().then(res => {
            setProducts(res.data);
            setCargando(false);
        });
    }

    function onBusquedaChange(e) {
        setTextoBusqueda(e.target.value);
    }

    function accionesProduct(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editarProduct(rowData)} tooltip="Ver/editar el product" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarBorradoProduct(rowData)} tooltip="Eliminar el product" />
            </React.Fragment>
        );
    }
    const pieDialogoBorrado = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={ocultarDialogoBorrado} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={borrarProduct} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="text-3xl text-800 font-bold mb-4">Listado de products</div>

            <div className="grid">
                <InputText id="busqueda" className="col-6 mr-2" onChange={onBusquedaChange} />
                <Button label="Buscar todos" className="col-1 mr-2" onClick={buscarTodos} />
            </div>


            <div className="flex justify-content-end">
                <Button label="Nuevo product" icon="pi pi-plus" className="p-button-lg" onClick={nuevoProduct} tooltip="Crear un nuevo product" tooltipOptions={{ position: 'bottom' }} />
            </div>


            {cargando && <div> <ProgressSpinner /> Cargando... </div>}

            <div className="surface-card p-4 border-round shadow-2">
                <DataTable value={products} responsiveLayout="scroll" stripedRows emptyMessage="No hay products que mostrar">
                    <Column field="gtin" header="GTIN" sortable />
                    <Column field="name" header="Nombre" sortable />
                    <Column field="units" header="Units" sortable />
                    <Column field="mgs" header="MGS" sortable />
                    <Column body={accionesProduct} />
                </DataTable>

            </div>

            <Dialog visible={dialogoBorrado} style={{ width: '450px' }} header="Confirmar borrado" modal
                footer={pieDialogoBorrado} onHide={ocultarDialogoBorrado}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {productActual && <span>Confirmar el borrado de <b>{productActual.name}</b>?</span>}
                </div>
            </Dialog>

        </div>
    );
}