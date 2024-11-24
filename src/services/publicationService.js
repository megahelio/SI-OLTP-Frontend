import api
 from "./drugsAPI";
class PublicationService {
    buscarTodos() {
        return api.get("/prescrire-publications");
    }

    buscarPorId(id) {
        return api.get(`/prescrire-publications/${id}`);
    }
    crear(data) {
        return api.post("/prescrire-publications", data);
    }

    modificar(id, data) {
        return api.put(`/prescrire-publications/${id}`, data);
    }

    eliminar(id) {
        return api.delete(`/prescrire-publications/${id}`);
    }

}

const service = new PublicationService();
export default service
