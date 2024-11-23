import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import { useParams, useNavigate } from "react-router-dom";

import manufacturerService from '../../services/manufacturerService';

export default function ManufacturerDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('id' in params);

    const manufacturerEmpty = {
        id: "", atc: {}, reasonToAvoid: "", alternative: "", isPrimaryCare: "", healthAlertList: [], productList: []
    };
    const [manufacturer, setManufacturer] = useState(manufacturerEmpty);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (!esNuevo) {
            manufacturerService.buscarPorId(params.id).then(res => setManufacturer(res.data));
        }
    }, []); // Carga después del primer renderizado


    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _manufacturer = { ...manufacturer };
        if (name.startsWith('direccion')) {
            const campoDireccion = name.split('.')[1];
            _manufacturer.direccion[`${campoDireccion}`] = val;

        } else {
            _manufacturer[`${name}`] = val;
        }
        setManufacturer(_manufacturer);
    }

    function onCancelar(event) {
        navigate("/manufacturers");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (datosmanufacturerCorrectos(manufacturer)) {
            if (esNuevo) {
                manufacturerService.crear(manufacturer);
            } else {
                manufacturerService.modificar(manufacturer.dni, manufacturer);
            }
            navigate("/manufacturers");
        }
    }

    function datosmanufacturerCorrectos(c) {
        return (c.dni && c.nombre);
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de manufacturer</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo manufacturer</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        {/* Nombre */}
                        <div className="p-field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="name"
                                value={manufacturer.name || ''}
                                onChange={(e) => onInputChange(e, 'name')}
                                placeholder="Nombre del fabricante"
                                required
                            />
                        </div>

                        {/* CIF */}
                        <div className="p-field">
                            <label htmlFor="cif">CIF</label>
                            <InputText
                                id="cif"
                                value={manufacturer.cif || ''}
                                onChange={(e) => onInputChange(e, 'cif')}
                                placeholder="CIF del fabricante"
                                required
                            />
                        </div>

                        {/* Dirección */}
                        <div className="p-field">
                            <label htmlFor="address">Dirección</label>
                            <InputText
                                id="number"
                                value={manufacturer.address?.number || ''}
                                onChange={(e) => onInputChange(e, 'address.number')}
                                placeholder="Número"
                            />
                            <InputText
                                id="floor"
                                value={manufacturer.address?.floor || ''}
                                onChange={(e) => onInputChange(e, 'address.floor')}
                                placeholder="Piso"
                            />
                            <InputText
                                id="letra"
                                value={manufacturer.address?.letra || ''}
                                onChange={(e) => onInputChange(e, 'address.letra')}
                                placeholder="Letra"
                            />
                            <InputText
                                id="road"
                                value={manufacturer.address?.road || ''}
                                onChange={(e) => onInputChange(e, 'address.road')}
                                placeholder="Calle"
                            />
                            <InputText
                                id="city"
                                value={manufacturer.address?.city || ''}
                                onChange={(e) => onInputChange(e, 'address.city')}
                                placeholder="Ciudad"
                            />
                            <InputText
                                id="region"
                                value={manufacturer.address?.region || ''}
                                onChange={(e) => onInputChange(e, 'address.region')}
                                placeholder="Región"
                            />
                            <InputText
                                id="country"
                                value={manufacturer.address?.country || ''}
                                onChange={(e) => onInputChange(e, 'address.country')}
                                placeholder="País"
                            />
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
