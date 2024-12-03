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

export interface editUserData {
	name: string
	id: number
}

export const editUser = async (data: editUserData, token: string) => {
	const response = await api.post('/profile/edit', data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
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

export interface uploadGuestData {
	files: File[]
	storage_period: string
}

export const uploadFilesGuest = async (data: uploadGuestData) => {
	const formData = new FormData()

	// Добавляем файлы в FormData
	data.files.forEach(file => {
		formData.append('files[]', file)
	})

	// Добавляем storage_period
	formData.append('storage_period', data.storage_period)

	const response = await api.post('/upload-guest', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data
}
