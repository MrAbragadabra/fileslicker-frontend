import axios, { AxiosRequestConfig } from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

// Создание экземпляра axios с базовым URL
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

// Интерфейс для редактирования пользователя
export interface editUserData {
	name: string
	id: number
}

// Интерфейс для добавления жалобы
export interface addComplaintData {
	comment: string
	upload_id: number
}

// Функция для добавления жалобы
export const addComplaint = async (data: addComplaintData) => {
	const response = await api.post('/complaint/add', data)
	return response.data
}

// Функция для редактирования данных пользователя
export const editUser = async (data: editUserData, token: string) => {
	const response = await api.post('/profile/edit', data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для регистрации нового пользователя
export const signupUser = async (data: signupData) => {
	const response = await api.post('/register', data)
	return response.data
}

// Функция для авторизации пользователя
export const loginUser = async (data: loginData) => {
	const response = await api.post('/login', data)
	return response.data
}

// Функция для получения данных пользователя
export const getUser = async (token: string) => {
	const response = await api.get('/profile', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для получения файлов
export const getFiles = async (upload_id: number) => {
	const response = await api.get(`/files/${upload_id}`)
	return response.data
}

// Функция для получения загрузок
export const getUploads = async (token: string, id: number) => {
	const response = await api.get(`/uploads/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для выхода пользователя из системы
export const logoutUser = async (token: string) => {
	const response = await api.post(
		'/logout',
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
}

// Функция для удаления загрузки
export const deleteUpload = async (id: number, token: string) => {
	const response = await api.post(
		`/upload/delete/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	return response.data
}

// Функция для удаления пользователя
export const deleteUser = async (token: string) => {
	const response = await api.post(
		`/profile/delete`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	return response.data
}

// Интерфейс для загрузки файлов гостем
export interface uploadGuestData {
	files: File[]
	storage_period: string
}

// Функция для загрузки файлов гостем
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

// Интерфейс для загрузки файлов зарегистрированным пользователем
export interface uploadUserData {
	files: File[]
	storage_period: string
}

// Функция для загрузки файлов зарегистрированным пользователем
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

// Функции для админа

// Функция для удаления загрузки администратором
export const deleteUploadAdmin = async (id: number, token: string) => {
	const response = await api.post(
		`/admin/upload/delete/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	return response.data
}

// Функция для получения списка пользователей администратором
export const getUsers = async (token: string) => {
	const response = await api.get(`/admin/users`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для получения списка жалоб администратором
export const getComplaints = async (token: string) => {
	const response = await api.get(`/admin/complaints`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для получения списка загрузок администратором
export const getUploadsAdmin = async (token: string) => {
	const response = await api.get(`/admin/uploads`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для получения списка пользователей администратором (повтор)
export const getUsersAdmin = async (token: string) => {
	const response = await api.get(`/admin/users`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для получения списка файлов администратором
export const getFilesAdmin = async (token: string) => {
	const response = await api.get(`/admin/files`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}

// Функция для предоставления прав администратора пользователю
export const userGrantAdmin = async (token: string, id: number) => {
	const response = await api.post(
		`/admin/users/grant/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
}

// Функция для отзыва прав администратора у пользователя
export const userRevokeAdmin = async (token: string, id: number) => {
	const response = await api.post(
		`/admin/users/revoke/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
}

// Функция для блокировки пользователя администратором
export const userBlock = async (token: string, id: number) => {
	const response = await api.post(
		`/admin/users/block/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
}

// Функция для разблокировки пользователя администратором
export const userUnblock = async (token: string, id: number) => {
	const response = await api.post(
		`/admin/users/unblock/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
}

// Функция для закрытия жалобы администратором
export const complaintClose = async (token: string, id: number) => {
	const response = await api.post(
		`/admin/complaint/close/${id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
}
