import { Card } from 'primereact/card';
import React, { useState } from 'react';

export default function Home(props) {
    const [expandido, setExpandido] = useState(false);

    const handleToggle = () => {
        setExpandido(!expandido);
    };

    const textoCompleto = `
        En la era digital actual, la disponibilidad y accesibilidad de información precisa y fiable sobre medicamentos es fundamental para profesionales de la salud, pacientes y el público en general. 
        En la actualidad existen herramientas digitales que son usadas a diario por profesionales del sector sanitario. Además de las plataformas que permiten el seguimiento de las historias clínicas de pacientes de forma unificada, 
        como IANUS en la comunidad gallega o DIRAYA en la andaluza, es común entre los profesionales de la salud utilizar otros recursos. No caso de la especialidad de farmacia, la tarea más común es la revisión de hojas de medicación activas en pacientes polimedicados. 
        Para esto suelen emplear distintas herramientas que le aportan información relevante. Algunos ejemplos son Fisterra (con integración en el IANUS) o UpToDate. En este contexto, la identificación y lo manejo de medicamentos con un balance beneficio-riesgo negativo 
        (aquellos que presentan un riesgo para la salud mayor a su beneficio) representan un desafío significativo en el ámbito sanitario y se da la situación de que no hay información bien estructurada de fácil acceso y que en las veces ocurre que el medicamento autorizado, y que, por tanto, es el primero en recetarse, no tiene por qué ser el mejor.
        La gestión de información sobre medicamentos se caracteriza por la existencia de diversas fuentes y bases de datos que recopilan y actualizan información sobre la seguridad y eficacia de los tratamientos farmacológicos. Una de las fuentes en este ámbito es Prescrire, una publicación francesa que anualmente elabora y actualiza una lista de medicamentos que aconseja retirar del comprado por las autoridades sanitarias francesas debido a sus riesgos. Prescrire no solo identifica estos medicamentos, sino que también proporciona alternativas terapéuticas y explicaciones detalladas de las razones por las que estos fármacos deberían evitarse.
        A pesar de las recomendaciones de organizaciones como Prescrire, muchos de estos medicamentos continúan siendo prescritos en otros países, como España, donde algunos aún están en curso en el sistema nacional de salud. 
        Esto pone de relieve una brecha en la adopción de prácticas basadas en evidencia y la necesidad de una mejor diseminación y accesibilidad de la información actualizada y fiable sobre los riesgos y beneficios de los medicamentos.
        En este contexto, se hace evidente a necesidad de herramientas y plataformas que faciliten el acceso a esta información, permitiendo a los profesionales de la salud tomar decisiones informadas y reducir la exposición de los pacientes a tratamientos no óptimos o peligrosos.
    `;

    const textoResumido = `
        En la era digital actual, la disponibilidad y accesibilidad de información precisa y fiable sobre medicamentos es fundamental. 
        En este contexto, la identificación y manejo de medicamentos con un balance beneficio-riesgo negativo representan un desafío significativo...
    `;


    return (
        <div>
            <Card title={props.mensaje} style={{ width: '50rem', marginBottom: '2em' }}>
                <p className="p-m-0" style={{ lineHeight: '1.5' }}>
                    {expandido ? textoCompleto : textoResumido}
                </p>
                <button onClick={handleToggle} style={{ marginTop: '1em' }}>
                    {expandido ? 'Leer menos' : 'Leer más'}
                </button>
            </Card>
            <Card title="Entidad-Relación" style={{ width: '50rem', marginBottom: '2em' }}>
                <img src="Entidad_Relación.jpg" alt="Entidad-Relación" style={{ width: '100%' }} />
            </Card>
        </div>
    );
}
