
const port=3000;
const url = 'https://0dfe2fe0.eu.ngrok.io';
// creates an interface for client side to connect with server
const createApiClient = () => {
	return {
		register: (registerRequest) => {
			return axios.post(`${url}/api/users`, registerRequest).then((res) => res.data);
        },
		
		login: (logInRequest) => {
			return axios.post(`${url}/api/users/login`, logInRequest).then((res) => res.data);
		},

		deleteUser: (deleteRequest) => {
			return axios.delete(`${url}/api/users`, {data: deleteRequest}).then((res) => res.data);
		},

		uploadUserData: (domain, uploadRequest) => {
			return axios.put(`${url}/api/data/${domain}`, uploadRequest).then((res) => res.data);
		},

		uploadAllUserData: (uploadRequest) => {
			return axios.put(`${url}/api/data`, uploadRequest).then((res) => res.data);
		}
	}
}

// const createApiClient = () => {
// 	return {
// 		register: (registerRequest) => {
// 			return axios.post(`http://localhost:${port}/api/users`, registerRequest).then((res) => res.data);
//         },
		
// 		login: (logInRequest) => {
// 			return axios.post(`http://localhost:${port}/api/users/login`, logInRequest).then((res) => res.data);
// 		},

// 		deleteUser: (deleteRequest) => {
// 			return axios.delete(`http://localhost:${port}/api/users`, {data: deleteRequest}).then((res) => res.data);
// 		},

// 		uploadUserData: (domain, uploadRequest) => {
// 			return axios.put(`http://localhost:${port}/api/data/${domain}`, uploadRequest).then((res) => res.data);
// 		},

// 		uploadAllUserData: (uploadRequest) => {
// 			return axios.put(`http://localhost:${port}/api/data`, uploadRequest).then((res) => res.data);
// 		}
// 	}
// }