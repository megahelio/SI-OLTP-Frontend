import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import { useParams, useNavigate } from "react-router-dom";

import alertService from '../../services/alertService';

export default function AlertDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('idHealthAlert' in params);

    const alertEmpty = {
        idHealthAlert: null,
        alertLink: "",
        organization: ""
    };
    const [alert, setAlert] = useState(alertEmpty);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!esNuevo) {
            alertService.buscarPorId(params.idHealthAlert).then(res => setAlert(res.data));
        }
    }, []); // Carga después del primer renderizado

    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _alert = { ...alert };
        _alert[`${name}`] = val;
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
                alertService.modificar(alert.idhealthalert, alert)
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
