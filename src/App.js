import React, { useEffect, useState } from 'react';
import getUsers from './services/getUsers';
import createUser from './services/createUser';
import updateUser from './services/updateUser';
import deleteUser from './services/deleteUser';
import 'tailwindcss/tailwind.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2';


function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '', job: '', avatar: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5); // 5 usuarios X pág
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  /* Cargar usuario */
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    };
    fetchUsers();
  }, []);

  /* Filtrar usuario de acuerdo a la búsqueda */
  useEffect(() => {
    const filtered = users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || (user.job && user.job.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reiniciar a la primera página cuando el término de búsqueda cambia
  }, [searchTerm, users]);

  /* Crea datos de usuario */
  const handleCreateUser = async () => {
    let avatarUrl = newUser.avatar;

    /* Nuevo archivo para foto */
    if (file) {
      avatarUrl = await uploadFile(file);
    }

    const createdUser = await createUser({ ...newUser, avatar: avatarUrl });
    if (createdUser) {
      setUsers([...users, createdUser]);
      setNewUser({ first_name: '', last_name: '', email: '', job: '', avatar: '' });
      setFile(null);
      setOpenModalCreate(false); // Cerrar el modal después de creado usu
    }
  };

  /* Edita los datos de usuario */
  const handleUpdateUser = async (id) => {
    let avatarUrl = newUser.avatar;

    if (file) {
      avatarUrl = await uploadFile(file);
    }

    const updatedUser = await updateUser(selectedUser.id, { ...newUser, avatar: avatarUrl });
    if (updatedUser) {
      setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
      setNewUser({ first_name: '', last_name: '', email: '', job: '', avatar: '' });
      setFile(null);
      setSelectedUser(null);
      setOpenModalUpdate(false) /* Cierra el modal despues de actualizar */
    }
  };

  /* Elimina usuario */
  const handleDeleteUser = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No se podrá revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter(user => user.id !== id));
        Swal.fire(
          'Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );
      }
    });
  };

  /* Edición de usuario: abre modal con datos del usuario */
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({ ...user });
    setOpenModalUpdate(true);
  };

  // Realiza cambio de archivo foto
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Sube archivo simulado (Provisionalmente)
  const uploadFile = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  // Paginación 
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="flex-1 flex items-center space-x-2">
              <h5>
                <span className="text-gray-500">Registro de Usuarios</span>
              </h5>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar"
                    required=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
              </form>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              {/* Botón para abrir el modal de creación de usuarios */}
              <button
                type="button"
                id="createUserButton"
                onClick={() => setOpenModalCreate(true)} // Al hacer clic, se establece el estado del modal en verdadero
                className="flex items-center justify-center text-black bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg className="h-3.5 w-3.5 mr-1.5 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Crear Usuarios
              </button>
              {
                openModalCreate && (
                  // Contenido del modal que se muestra si openModalCreate es verdadero
                  <div
                    id="createProductModal"
                    tabindex="-1"
                    aria-hidden="true"
                    className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50"
                  >
                    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Crear Usuario
                          </h3>
                          <button
                            type="button"
                            onClick={() => setOpenModalCreate(false)}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="createProductModal"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="p-6 space-y-6">
                          <form>
                            <div className="grid gap-6 mb-6 lg:grid-cols-2">
                              <div>
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                                <input
                                  type="text"
                                  id="first_name"
                                  value={newUser.first_name}
                                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  placeholder="Nombre"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
                                <input
                                  type="text"
                                  id="last_name"
                                  value={newUser.last_name}
                                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  placeholder="Apellido"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo Electrónico</label>
                                <input
                                  type="email"
                                  id="email"
                                  value={newUser.email}
                                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  placeholder="Correo Electrónico"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="job" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ocupación</label>
                                <input
                                  type="text"
                                  id="job"
                                  value={newUser.job}
                                  onChange={(e) => setNewUser({ ...newUser, job: e.target.value })}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  placeholder="Ocupación"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avatar</label>
                                <input
                                  type="file"
                                  id="avatar"
                                  onChange={handleFileChange}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  placeholder="Avatar"
                                  required
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                          <button type="button" id="createUserButton" onClick={handleCreateUser} className="text-white bg-green-500 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10">
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenModalCreate(false)}
                            className="text-white bg-rose-600 hover:bg-rose-900 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>

          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="w-full bg-gray-100 dark:bg-gray-700">
                  <th scope="col" className="px-4 py-3">Avatar</th>
                  <th scope="col" className="px-4 py-3">Nombre</th>
                  <th scope="col" className="px-4 py-3">Correo Electrónico</th>
                  <th scope="col" className="px-4 py-3">Ocupación</th>
                  <th scope="col" className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-4 py-3">{`${user.first_name} ${user.last_name}`}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.job}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:underline">Editar</button>
                        {
                          openModalUpdate && (
                            // Contenido del modal que se muestra si openModalCreate es verdadero
                            <div
                              id="createProductModal"
                              tabindex="-1"
                              aria-hidden="true"
                              className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50"
                            >
                              <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                  <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                      Editar Usuario
                                    </h3>
                                    <button
                                      type="button"
                                      onClick={() => setOpenModalUpdate(false)}
                                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                      data-modal-toggle="createProductModal"
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  <div className="p-6 space-y-6">
                                    <form>
                                      <div className="grid gap-6 mb-6 lg:grid-cols-2">
                                        <div>
                                          <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                                          <input
                                            type="text"
                                            id="first_name"
                                            value={newUser.first_name}
                                            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Nombre"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
                                          <input
                                            type="text"
                                            id="last_name"
                                            value={newUser.last_name}
                                            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Apellido"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo Electrónico</label>
                                          <input
                                            type="email"
                                            id="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Correo Electrónico"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="job" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ocupación</label>
                                          <input
                                            type="text"
                                            id="job"
                                            value={newUser.job}
                                            onChange={(e) => setNewUser({ ...newUser, job: e.target.value })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Ocupación"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avatar</label>
                                          <input
                                            type="file"
                                            id="avatar"
                                            onChange={handleFileChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Avatar"
                                            required
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                  <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                    <button type="button" id="createUserButton" onClick={ handleUpdateUser } className="text-white bg-green-500 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10">
                                      Actualizar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOpenModalUpdate(false)}
                                      className="text-white bg-rose-600 hover:bg-rose-900 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:underline">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage === 1 ? 1 : currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => paginate(currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? currentPage : currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando <span className="font-medium">{indexOfFirstUser + 1}</span> a <span className="font-medium">{indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}</span> de <span className="font-medium">{filteredUsers.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <a
                    href="#"
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-medium ${currentPage === 1
                      ? 'text-gray-400'
                      : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Primera</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.293 5.293a1 1 0 011.414 0L13 9.586V11a1 1 0 11-2 0V9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 010-1.414zM4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                      />
                    </svg>
                  </a>
                  {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${currentPage === index + 1
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } border border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </a>
                  ))}
                  <a
                    href="#"
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-medium ${currentPage === Math.ceil(filteredUsers.length / usersPerPage)
                      ? 'text-gray-400'
                      : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    onClick={() => paginate(Math.ceil(filteredUsers.length / usersPerPage))}
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                  >
                    <span className="sr-only">Última</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.707 14.707a1 1 0 01-1.414 0L7 10.414V9a1 1 0 112 0v1.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 010 1.414zM16 10a1 1 0 00-1-1H5a1 1 0 100 2h10a1 1 0 001-1z"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;