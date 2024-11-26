import api from "./drugsAPI";

class DrugService {
  buscarTodos() {
    return api.get("/drugs");
  }

  buscarPorId(id) {
    return api.get(`/drugs/${id}`);
  }
  
  buscarPorAtc(atc) {
    return api.get(`/drugs?atc=${atc}`);
  }

  buscarPorActivePrinciple(activePrinciple) {
    return api.get(`/drugs?activePrinciple=${activePrinciple}`);
  }

  buscarPorIsPrimaryCare(isPrimaryCare) {
    return api.get(`/drugs?isPrimaryCare=${isPrimaryCare}`);
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
