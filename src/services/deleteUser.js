import axios from "axios";

const deleteUser = async (id) => {
    try {
        await axios.delete(`https://reqres.in/api/users/${id}`);
        return true;

    } catch (error) {
        console.error('Error al eliminar usuario:', error)
        return false;
    }
};

export default deleteUser;