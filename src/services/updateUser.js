import axios from "axios";

const updatedUser = async (id, user) => {
    try {
        const response = await axios.put(`https://reqres.in/api/users/${id}`, user);
        return response.data;

    } catch (error) {
        console.error("Error en la actualización de usuario", error);
        return null;
    }
};

export default updatedUser;