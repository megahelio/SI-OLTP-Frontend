import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import Home from './components/home';

import DrugListado from "./components/drugs/drugListado";
import DrugDetalle from "./components/drugs/drugDetalle";
import ManufacturerDetalle from "./components/manufacturers/manufacturerDetalle";
import ManufacturerListado from "./components/manufacturers/manufacturerListado";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
//import './App.css';

function App() {
  return (
    <div>

      <BrowserRouter forceRefresh>

        <nav className="flex">
          <NavLink to="/" className="px-5 py-3 no-underline text-900 text-xl border-bottom-2 border-300 hover:border-500">Home</NavLink>
          <NavLink to="/drugs" className="px-5 py-3 no-underline text-700 text-xl border-bottom-2 border-300 hover:border-500">Drugs</NavLink>
          <NavLink to="/manufacturers" className="px-5 py-3 no-underline text-700 text-xl border-bottom-2 border-300 hover:border-500">Manufacturers</NavLink>
        </nav>

        <div className="p-5">
            <Routes>
              <Route path="/" element={<Home mensaje="Página principal" />} />
              <Route path="drugs" >
                <Route index element={<DrugListado />} />
                <Route path="nuevo" element={<DrugDetalle />} />
                <Route path=":id" element={<DrugDetalle />} />
              </Route>

            <Route path="manufacturers" >
              <Route index element={<ManufacturerListado />} />
              <Route path="nuevo" element={<ManufacturerDetalle />} />
              <Route path=":cif" element={<ManufacturerDetalle />} />
            </Route>
            </Routes>
        </div>

      </BrowserRouter >
    </div >
  );
}

export default App;
