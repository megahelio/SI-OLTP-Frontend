import api from "./drugsAPI";

class DrugService {
  buscarTodos() {
    return api.get("/drugs");
  }

  buscarPorId(id) {
    return api.get(`/drug/${id}`);
  }

  crear(data) {
    return api.post("/drug", data);
  }

  modificar(id, data) {
    return api.put(`/drug/${id}`, data);
  }

  eliminar(id) {
    return api.delete(`/drug/${id}`);
  }

}

const service = new DrugService();
export default service
