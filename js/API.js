
let baseUrl = '';

chrome.storage.local.get(['baseUrl'], function(result) {
	baseUrl = result.baseUrl;
});

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