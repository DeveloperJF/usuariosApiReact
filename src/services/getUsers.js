import axios from "axios";

const getUsers = async () => {
    try {
        let page = 1;
        let users = [];
        let response;
        
        do {
            response = await axios.get(`https://reqres.in/api/users?page=${page}`);
            users = users.concat(response.data.data);
            page++;
            
        } while (response.data.page < response.data.total_pages);
        return users;       

    } catch (error) {
        console.error("Error en la búsqueda de usuarios:", error);
        return [];
    }
};

export default getUsers;