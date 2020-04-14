
const port=3000;
const createApiClient = () => {
	return {
		register: (registerRequest) => {
			return axios.post(`http://localhost:${port}/api/users`, registerRequest).then((res) => res.data);
        },
		
		login: (logInRequest) => {
			return axios.put(`http://localhost:${port}/api/users/login`, logInRequest).then((res) => res.data);
		},

		deleteUser: (deleteRequest) => {
			console.log(deleteRequest);
			return axios.delete(`http://localhost:${port}/api/users`, {data: deleteRequest}).then((res) => res.data);
		},

		uploadUserData: (deleteRequest) => {
			return axios.delete(`http://localhost:${port}/api/data`, deleteRequest).then((res) => res.data);
		},
	}
}