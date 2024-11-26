import api
    from "./drugsAPI";
class AlertService {
    buscarTodos() {
        return api.get("/health-alerts");
    }
    buscarPorId(id) {
        return api.get(`/health-alerts/${id}`);
    }
    buscarPorOrg(org) {
        return api.get(`/health-alerts?organization=${org}`);
    }
    crear(data) {
        return api.post("/health-alerts", data);
    }

    modificar(id, data) {
        return api.put(`/health-alerts/${id}`, data);
    }

    eliminar(id) {
        return api.delete(`/health-alerts/${id}`);
    }
}
const service = new AlertService();
export default service
