import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import { useParams, useNavigate } from "react-router-dom";

import drugService from '../../services/drugService';

export default function DrugDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('id' in params);

    const drugEmpty = {
        id: "", atc: {}, reasonToAvoid: "", alternative: "", isPrimaryCare: "", healthAlertList: [], productList: []
    };
    const [drug, setDrug] = useState(drugEmpty);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (!esNuevo) {
            drugService.buscarPorId(params.id).then(res => setDrug(res.data));
        }
    }, []); // Carga después del primer renderizado


    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _drug = { ...drug };
        if (name.startsWith('direccion')) {
            const campoDireccion = name.split('.')[1];
            _drug.direccion[`${campoDireccion}`] = val;

        } else {
            _drug[`${name}`] = val;
        }
        setDrug(_drug);
    }

    function onCancelar(event) {
        navigate("/drugs");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (datosdrugCorrectos(drug)) {
            if (esNuevo) {
                drugService.crear(drug);
            } else {
                drugService.modificar(drug.dni, drug);
            }
            navigate("/drugs");
        }
    }

    function datosdrugCorrectos(c) {
        return (c.dni && c.nombre);
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de drug</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo drug</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-fluid">
                           

                            {/* ATC */}
                            <div className="p-field">
                                <label htmlFor="atc">ATC</label>
                                <InputText
                                    id="grupoAnatomicoPrincipal"
                                    value={drug.atc?.grupoAnatomicoPrincipal || ''}
                                    onChange={(e) => onInputChange(e, 'atc.grupoAnatomicoPrincipal')}
                                    placeholder="Grupo Anatómico Principal"
                                />
                                <InputText
                                    id="subgrupoTerapeutico"
                                    value={drug.atc?.subgrupoTerapeutico || ''}
                                    onChange={(e) => onInputChange(e, 'atc.subgrupoTerapeutico')}
                                    placeholder="Subgrupo Terapéutico"
                                />
                                <InputText
                                    id="principioActivo"
                                    value={drug.atc?.principioActivo || ''}
                                    onChange={(e) => onInputChange(e, 'atc.principioActivo')}
                                    placeholder="Principio Activo"
                                />
                            </div>

                            {/* Razones y Alternativa */}
                            <div className="p-field">
                                <label htmlFor="reasonToAvoid">Razón para evitar</label>
                                <InputText
                                    id="reasonToAvoid"
                                    value={drug.reasonToAvoid || ''}
                                    onChange={(e) => onInputChange(e, 'reasonToAvoid')}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="alternative">Alternativa</label>
                                <InputText
                                    id="alternative"
                                    value={drug.alternative || ''}
                                    onChange={(e) => onInputChange(e, 'alternative')}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="isPrimaryCare">¿Es atención primaria?</label>
                                <Dropdown
                                    id="isPrimaryCare"
                                    value={drug.isPrimaryCare}
                                    options={[
                                        { label: 'Sí', value: true },
                                        { label: 'No', value: false },
                                    ]}
                                    onChange={(e) => onInputChange(e, 'isPrimaryCare')}
                                    placeholder="Seleccione una opción"
                                />
                            </div>


                            {/* Alertas */}
                            <div className="p-field">
                                <label>Alertas Sanitarias</label>
                                {drug.healthAlertList?.map((alert, index) => (
                                    <div key={index} className="p-mb-3">
                                        <span>{alert.organization}</span>
                                        <a href={alert.alertLink} target="_blank" rel="noopener noreferrer">
                                            Ver alerta
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {/* Productos */}
                            <div className="p-field">
                                <label>Productos</label>
                                {drug.productList?.map((product, index) => (
                                    <div key={index} className="p-mb-3">
                                        <span>{product.name} ({product.units} unidades, {product.mgs}mg)</span>
                                        <span> - Fabricante: {product.manufacturer.name}</span>
                                    </div>
                                ))}
                            </div>
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
