import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
	baseURL: API_URL,
})

// Интерфейс для регистрации
export interface signupData {
	name: string
	email: string
	password: string
}

// Интерфейс для авторизации
export interface loginData {
	email: string
	password: string
}

export const signupUser = async (data: signupData) => {
	const response = await api.post('/register', data)
	return response.data
}

export const loginUser = async (data: loginData) => {
	const response = await api.post('/login', data)
	return response.data
}

export const getUser = async (token: string) => {
	const response = await api.get('/profile', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

export const logoutUser = async (token: string) => {
	const response = await api.post('/logout', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}