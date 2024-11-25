import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';


import { useParams, useNavigate } from "react-router-dom";

import alertService from '../../services/alertService';
import drugService from '../../services/drugService';

export default function AlertDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('idHealthAlert' in params);

    const alertEmpty = {
        idHealthAlert: null,
        alertLink: "",
        organization: "",
        drug: {
            id: null,
            activePrinciple: "",
            atc: "",
            reasonToAvoid: "",
            alternative: "",
            isPrimaryCare: null
        }

    }

    const [alert, setAlert] = useState(alertEmpty);
    const [submitted, setSubmitted] = useState(false);
    const [drugs, setDrugs] = useState([]);
    const [activePrinciples, setActivePrinciples] = useState([]);

    useEffect(() => {
        if (!esNuevo) {
            alertService.buscarPorId(params.idHealthAlert).then(res => setAlert(res.data));
        }
        drugService.buscarTodos().then(res => {
            const activePrinciples = res.data.map(drug => drug.activePrinciple);
            setDrugs(res.data);
            setActivePrinciples(activePrinciples);
            console.log(res);
        });
    }, []); // Carga después del primer renderizado

    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _alert = { ...alert };
        _alert[`${name}`] = val;
        setAlert(_alert);
    }

    function onDrugChange(e) {
        let _alert = { ...alert };
        _alert.drug = drugs.find(drug => drug.activePrinciple === e.value);
        setAlert(_alert);
    }

    function onCancelar(event) {
        navigate("/alerts");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (datosAlertCorrectos(alert)) {
            if (esNuevo) {
                alertService.crear(alert)
                    .then(navigate("/alerts"))
                    .catch((error) => alert("Error creating alert:", error));

            } else {
                alertService.modificar(alert.idHealthAlert, alert)
                    .then(navigate("/alerts"))
                    .catch((error) => alert("Error modificating alert:", error));
            }

        }

    }

    function datosAlertCorrectos(c) {
        return (c.alertLink);
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de alert</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo alert</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="idHealthAlert">ID</label>
                            <InputText
                                id="idHealthAlert"
                                value={alert.idHealthAlert || ''}
                                onChange={(e) => onInputChange(e, 'idHealthAlert')}
                                placeholder="ID de la alerta"
                                readOnly disabled
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="alertLink">Enlace</label>
                            <InputText
                                id="alertLink"
                                value={alert.alertLink || ''}
                                onChange={(e) => onInputChange(e, 'alertLink')}
                                placeholder="Enlace de la alerta"
                                required
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="organization">Organización</label>
                            <InputText
                                id="organization"
                                value={alert.organization || ''}
                                onChange={(e) => onInputChange(e, 'organization')}
                                placeholder="Organización emisora"
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="drug">Drug</label>
                        <Dropdown value={alert.drug?.activePrinciple} options={activePrinciples} onChange={onDrugChange} optionLabel="principioActivo"
                            filter showClear filterBy="principioActivo" placeholder="Seleccionar drug" />
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