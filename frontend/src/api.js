import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

export function getStoredUserId() {
  return localStorage.getItem('hackteam1.userId') || ''
}

export function setStoredUserId(userId) {
  if (userId) {
    localStorage.setItem('hackteam1.userId', userId)
  } else {
    localStorage.removeItem('hackteam1.userId')
  }
}

export function apiErrorMessage(error, fallback) {
  return error.response?.data?.error || fallback
}

export async function fetchProfile(userId) {
  const { data } = await api.get(`/profiles/${userId}`)
  return data
}

export async function fetchProfileByFirebaseUid(firebaseUid) {
  const { data } = await api.get(`/profiles/firebase/${encodeURIComponent(firebaseUid)}`)
  return data
}

export async function saveProfile(payload) {
  const { data } = await api.put('/profiles', payload)
  setStoredUserId(data.id)
  return data
}

export async function createGroup(payload) {
  const { data } = await api.post('/groups', payload)
  return data
}

export async function joinGroup(payload) {
  const { data } = await api.post('/groups/join', payload)
  return data
}
