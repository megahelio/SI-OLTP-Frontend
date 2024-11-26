import api
    from "./drugsAPI";
class ProductService {
    buscarTodos() {
        return api.get("/products");
    }
    buscarPorId(id) {
        return api.get(`/products/${id}`);
    }

    buscarPorName(name) {
        return api.get(`/products?=name=${name}`);
    }
    crear(data) {
        return api.post("/products", data);
    }

    modificar(id, data) {
        return api.put(`/products/${id}`, data);
    }

    eliminar(id) {
        return api.delete(`/products/${id}`);
    }
}
const service = new ProductService();
export default service
