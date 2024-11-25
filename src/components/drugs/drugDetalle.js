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
        id: null, activePrinciple: "", atc: "", reasonToAvoid: "", alternative: "", isPrimaryCare: null
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
        _drug[`${name}`] = val;
        setDrug(_drug);
    }
    function onIsPrimaryCareChange(e){
        const val = e.target.value;
        let _drug = { ...drug };
        _drug["isPrimaryCare"] = val;
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
                drugService.modificar(drug.id, drug);
            }
            navigate("/drugs");
        }
    }

    function datosdrugCorrectos(c) {
        return (c.atc && c.activePrinciple && c.reasonToAvoid &&
            c.alternative);
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de drug</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo drug</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-fluid">
                            <div className="p-field">
                                <label htmlFor="id">ID</label>
                                <InputText
                                    id="id"
                                    value={drug.id || ''}
                                    onChange={(e) => onInputChange(e, 'id')}
                                    placeholder="ID"
                                    readOnly disabled
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="activePrinciple">Principio Activo</label>
                                <InputText
                                    id="activePrinciple"
                                    value={drug.activePrinciple || ''}
                                    onChange={(e) => onInputChange(e, 'activePrinciple')}
                                    placeholder="Principio Activo"
                                    required
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="atc">ATC</label>
                                <InputText
                                    id="atc"
                                    value={drug.atc || ''}
                                    onChange={(e) => onInputChange(e, 'atc')}
                                    placeholder="ATC"
                                    required
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="reasonToAvoid">Razón para evitar</label>
                                <InputText
                                    id="reasonToAvoid"
                                    value={drug.reasonToAvoid || ''}
                                    onChange={(e) => onInputChange(e, 'reasonToAvoid')}
                                    placeholder="Razón para evitar"
                                    required
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="alternative">Alternativa</label>
                                <InputText
                                    id="alternative"
                                    value={drug.alternative || ''}
                                    onChange={(e) => onInputChange(e, 'alternative')}
                                    placeholder="Alternativa"
                                    required
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
                                    onChange={(e) => onIsPrimaryCareChange(e)}
                                    placeholder="Seleccione una opción"
                                    required
                                />
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
