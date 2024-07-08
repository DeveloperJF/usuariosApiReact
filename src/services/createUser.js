import axios from "axios";

const createUser = async (user) => {
    try {
        const response = await axios.post('https://reqres.in/api/users', user);
        return response.data;

    } catch (error) {
        console.error('Error en la creación de usuario:', error);
        return null;
    }
};

export default createUser;