# Ejemplo REACT (SI-2023, semana 5)

Ejemplo de IU para el API pedidos-rest-24 usando REACT.

Versión simplificada del ejemplo `cra-crud`de PrimeReact (ver https://github.com/primefaces/primereact-examples)

## Requisitos

* Instalación reciente de node.js (https://nodejs.org/es/) [versión > 16.8]
* Usa API REST del proyecto [pedidos-rest-23](https://github.com/esei-si-dagss/pedidos-rest-23)

## Librerias usadas

* [PrimeReact](https://primereact.org): componentes de interfaz (incluye [PrimeFlex](https://primeflex.org/))
* [react-router-dom](https://reactrouter.com/en/main): rutas y navegación de la aplicación
* [axios](https://axios-http.com/es/docs/intro): acceso al API REST

## Creación del proyecto (ya hecho)

```sh
npx create-react-app pedidos-react

cd pedidos-react
npm install react-router-dom
npm install axios
npm install primereact
npm install primeicons
npm install primeflex
```


## Ejecución del proyecto descargado

```sh
git clone https://github.com/esei-si-dagss/pedidos-react-23.git
cd pedidos-react-23
npm install
npm start
```

Arranca servidor de desarrollo en (http://localhost:3000)

## Estructura y elementos del proyecto

* `src/App.js`: punto de entrada a la aplicaicón, contiene las _rutas_ de `react-router-dom` hacia los componentes que implementan las diferentes vistas
   **Nota:** Añadido parámetro `forceRefresh` en componente `BrowserRouter` de `App.js` para forzar a repintar las vistas al "navegar" entre URIs en el cliente.

* `src/components`: código de los componentes
  * un directorio por cada entidad
  * `[entidad]Listado.js`: vista del listado de entidades 
     **Nota:** En la mayor parte de las entidades la acción de borrado falla y no se realiza el borrado realmente, debido a las restricciones de claves foráneas.
* En la llamada al método `xxxxService.eliminar()` se ha añadido la captura del error (función `catch(...)`) y se muestra un mensaje.
  * `[entidad]Detalle.js`: vista de detalle de cada entidad
* `src/services`: clases que encapsulan las operaciones de acceso a los _endpoint_ REST mediante la libreria _axios_ 
  * `pedidosAPI.js` encapsula el objeto _axios_ para realizar las peticiones REST sobre http://localhost:8080/api
  *  `[entidad]Service.js` encapsula las operaciones sobre cada entidad

## Aspectos a revisar
* Gestión de `articulos` (ejemplo de manejo de relación 1:N con `familia`)
* Gestión de `almacenes` (ejemplo de manejo de relaciones N:M con atributos y reutilización de componentes)

