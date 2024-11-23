import api
 from "./drugsAPI";
class ManufacturerService {
    buscarTodos() {
        return api.get("/manufacturers");
    }

    buscarPorId(id) {
        return api.get(`/manufacturers/${id}`);
    }
    buscarPorCIF(cif) {
        return api.get(`/manufacturers?cif=${cif}`);
    }
    crear(data) {
        return api.post("/manufacturers", data);
    }

    modificar(id, data) {
        return api.put(`/manufacturers/${id}`, data);
    }

    eliminar(id) {
        return api.delete(`/manufacturers/${id}`);
    }

}

const service = new ManufacturerService();
export default service
