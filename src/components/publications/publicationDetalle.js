import React, { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { MultiSelect } from 'primereact/multiselect';

import { useParams, useNavigate } from "react-router-dom";

import publicationService from '../../services/publicationService';
import drugService from '../../services/drugService';

export default function PublicationDetalle() {

    const params = useParams();
    const navigate = useNavigate();
    const esNuevo = !('id' in params);

    const publicationEmpty = {
        id: null, year: "", publicationLink: "", drugList: []
    };
    const [publication, setPublication] = useState(publicationEmpty);
    const [submitted, setSubmitted] = useState(false);
    const [drugs, setDrugs] = useState([]);

    useEffect(() => {
        if (!esNuevo) {
            publicationService.buscarPorId(params.id).then(res => setPublication(res.data));
        }
        drugService.buscarTodos().then(res => setDrugs(res.data))
    }, []); // Carga después del primer renderizado

    function onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let _publication = { ...publication };
        _publication[`${name}`] = val;
        setPublication(_publication);
    }
    function onDrugListChange(e) {
        let _publication = { ...publication };
        _publication.drugList = e.value;
        setPublication(_publication);
    }

    function onCancelar(event) {
        navigate("/publications");
    }

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
        if (datosPublicationCorrectos(publication)) {
            if (esNuevo) {
                publicationService.crear(publication)
                    .then(navigate("/publications"))
                    .catch((error) => alert("Error creating publication:", error));

            } else {
                publicationService.modificar(publication.id, publication)
                    .then(navigate("/publications"))
                    .catch((error) => alert("Error modificating publication:", error));
            }

        }
    }

    function datosPublicationCorrectos(c) {
        return (c.year && c.publicationLink);
    }

    return (
        <div>
            <div className="surface-card border-round shadow-2 p-4">
                {!esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Detalle de publication</span>}
                {esNuevo && <span className="text-900 text-2xl font-medium mb-4 block">Nuevo publication</span>}

                <form onSubmit={handleSubmit} >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="id">ID</label>
                            <InputText
                                id="id"
                                value={publication.id || ''}
                                onChange={(e) => onInputChange(e, 'id')}
                                placeholder="ID de la publicación"
                                readOnly disabled
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="year">Año</label>
                            <InputText
                                id="year"
                                value={publication.year || ''}
                                onChange={(e) => onInputChange(e, 'year')}
                                placeholder="Año de la publicación"
                                required
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="publicationLink">Enlace</label>
                            <InputText
                                id="publicationLink"
                                value={publication.publicationLink || ''}
                                onChange={(e) => onInputChange(e, 'publicationLink')}
                                placeholder="Enlace de la publicación"
                                required
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="drugIds">Drugs</label>
                            <MultiSelect id="drugIds"
                                value={publication.drugList}
                                options={drugs}
                                onChange={onDrugListChange}
                                optionLabel="activePrinciple"
                                placeholder="Select Drugs"
                                display="chip" filter />
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
