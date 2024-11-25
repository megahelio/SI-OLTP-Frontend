import api from "./drugsAPI";

class DrugService {
  buscarTodos() {
    return api.get("/drugs");
  }

  buscarPorId(id) {
    return api.get(`/drugs/${id}`);
  }

  crear(data) {
    return api.post("/drugs", data);
  }

  modificar(id, data) {
    return api.put(`/drugs/${id}`, data);
  }

  eliminar(id) {
    return api.delete(`/drugs/${id}`);
  }

}

const service = new DrugService();
export default service
