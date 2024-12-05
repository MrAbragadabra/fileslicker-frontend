import axios, { AxiosRequestConfig } from 'axios'

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

export const getFiles = async (upload_id: number) => {
	const response = await api.get(`/files/${upload_id}`)
	return response.data
}

export const getUploads = async (token: string, id: number) => {
	const response = await api.get(`/uploads/${id}`, {
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

export const uploadFilesGuest = async (
	data: uploadGuestData,
	config: AxiosRequestConfig = {}
) => {
	const formData = new FormData()

	// Добавляем файлы и storage_period в FormData
	data.files.forEach(file => {
		formData.append('files[]', file)
	})
	formData.append('storage_period', data.storage_period)

	const response = await api.post('/upload-guest', formData, {
		...config,
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data
}

export interface uploadUserData {
	files: File[]
	storage_period: string
}

export const uploadFilesUser = async (
	token: string,
	data: uploadGuestData,
	config: AxiosRequestConfig = {}
) => {
	const formData = new FormData()

	// Добавляем файлы и storage_period в FormData
	data.files.forEach(file => {
		formData.append('files[]', file)
	})
	formData.append('storage_period', data.storage_period)

	const response = await api.post('/upload-user', formData, {
		...config,
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}
