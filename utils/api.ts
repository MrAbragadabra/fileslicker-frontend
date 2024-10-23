import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
	baseURL: API_URL,
})

export interface signupData {
	name: string
	email: string
	password: string
}

export const signupUser = async (data: signupData) => {
	const response = await api.post('/users/signup', data)
	return response.data
}
