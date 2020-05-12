
const port=3000;
const url = chrome.runtime.getURL('./baseUrl.json');
let baseUrl = '';
fetch(url)
    .then((response) => response.json())
	.then((json) => baseUrl = json.baseUrl); //nakes sure we update the base url of the server (free version of ngrok gives randon url each time)

// creates an interface for client side to connect with server
const createApiClient = () => {
	return {
		register: (registerRequest) => {
			return axios.post(`${baseUrl}/api/users`, registerRequest).then((res) => res.data);
        },
		
		login: (logInRequest) => {
			return axios.post(`${baseUrl}/api/users/login`, logInRequest).then((res) => res.data);
		},

		deleteUser: (deleteRequest) => {
			return axios.delete(`${baseUrl}/api/users`, {data: deleteRequest}).then((res) => res.data);
		},

		uploadUserData: (domain, uploadRequest) => {
			return axios.put(`${baseUrl}/api/data/${domain}`, uploadRequest).then((res) => res.data);
		},

		uploadAllUserData: (uploadRequest) => {
			return axios.put(`${baseUrl}/api/data`, uploadRequest).then((res) => res.data);
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