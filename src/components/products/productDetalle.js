import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { useParams, useNavigate } from "react-router-dom";
import manufacturerService from '../../services/manufacturerService.js';
import productService from '../../services/productService';

export default function ProductDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('gtin' in params);

    const productEmpty = {
        gtin: null, name: "", units: null, mgs: null,
        manufacturer: { name: "", cif: "", address: { number: "", floor: "", letra: "", road: "", city: "", country: "", region: "" } },
        // drug: { id: null, activePrinciple: "", atc: "", reasonToAvoid: "", alternative: "", isPrimaryCare: null }
    };
    const [product, setProduct] = useState(productEmpty);
    const [submitted, setSubmitted] = useState(false);
    const [manufacturers, setManufacturer] = useState([]);
    const [manufacturersNameSet, setManufacturerNameSet] = useState([]);

    useEffect(() => {
        if (!esNuevo) {
            productService.buscarPorId(params.gtin).then(res => setProduct(res.data));
        }
        manufacturerService.buscarTodos().then(res => {
            const nameSet = res.data.map(manufacturer => manufacturer.name);
            setManufacturer(res.data);
            setManufacturerNameSet(nameSet);
            console.log(res);
        });
    }, []); // Carga después del primer renderizado

    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    }
    function onManufacturerChange(e){
        let _product = { ...product };
        _product.manufacturer = manufacturers.find(manufacturer => manufacturer.name === e.value);
        setProduct(_product);
    }

    function onCancelar(event) {
        navigate("/products");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (datosProductCorrectos(product)) {
            if (esNuevo) {
                productService.crear(product)
                    .then(navigate("/products"))
                    .catch((error) => alert("Error creating product:", error));

            } else {
                productService.modificar(product.gtin, product)
                    .then(navigate("/products"))
                    .catch((error) => alert("Error modificating product:", error));
            }
        }
    }

    function datosProductCorrectos(c) {
        return (c.gtin && c.name);
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de product</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo product</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="gtin">GTIN</label>
                            <InputText
                                id="gtin"
                                value={product.gtin || ''}
                                onChange={(e) => onInputChange(e, 'gtin')}
                                placeholder="GTIN del producto"
                                required
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="name"
                                value={product.name || ''}
                                onChange={(e) => onInputChange(e, 'name')}
                                placeholder="Nombre del producto"
                                required
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="units">Unidades</label>
                            <InputText
                                id="units"
                                value={product.units || ''}
                                onChange={(e) => onInputChange(e, 'units')}
                                placeholder="Unidades de dosis"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="mgs">Mgs</label>
                            <InputText
                                id="mgs"
                                value={product.mgs || ''}
                                onChange={(e) => onInputChange(e, 'mgs')}
                                placeholder="Mgs por dosis"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="manufacturer">Fabricante</label>
                            <Dropdown value={product.manufacturer.name} options={manufacturersNameSet} onChange={onManufacturerChange} optionLabel="nombre"
                                filter showClear placeholder="Seleccionar fabricante" />
                        </div>
                    </div>
                    <Divider />
                    <div className="p-p-3">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined mr-2" onClick={onCancelar} />
                        <Button label="Guardar" icon="pi pi-check" type="submit" />
                    </div>
                </form>
            </div>
        </div>
    );
}
