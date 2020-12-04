import axios from 'axios'
import { sortingBy } from '@/utils/sorting.js'

export default {
	state: {
		items: [],
		isLoading: false,
		currentSortBy: 'expireDate',
	},
	mutations: {
		fetchItems(state, items) {
			state.items = items
		},
		addItem(state, item) {
			state.items.unshift(item)
		},
		deleteItem(state, id) {
			state.items = state.items.filter(item => item._id !== id)
		},
		setCurrentSortBy(state, payload) {
			state.currentSortBy = payload
		},
		setItemsLoading(state, payload) {
			state.isLoading = payload
		}
	},
	actions: {
		async fetchItems({ commit, dispatch }) {
			commit('setItemsLoading', true)

			try {
				const token = localStorage.getItem('auth-token')
				await axios
					.get(`${process.env.VUE_APP_URL}/items/all`, {
						headers: {
							'x-auth-token': token,
						},
					})
					.then(res => {
						commit('fetchItems', res.data)
						commit('setItemsLoading', false)
					})
					.catch(error => console.log('error', error))
			} catch (error) {
				dispatch('setNotification', { text: error.response.data.msg, type: 'danger' }, { root: true })
			}
		},
		async addItem({ commit, dispatch }, item) {
			try {
				const token = localStorage.getItem('auth-token')
				if (token) {
					await axios
						.post(`${process.env.VUE_APP_URL}/items/`, item, {
							headers: { 'x-auth-token': token },
						})
						.then(res => commit('addItem', res.data))
						.catch(error => console.log('error', error))
				}
			} catch (error) {
				dispatch('setNotification', { text: error.response.data.msg, type: 'danger' }, { root: true })
			}
		},
		async deleteItem({ commit, dispatch }, id) {
			try {
				const token = localStorage.getItem('auth-token')
				if (token) {
					await axios
						.delete(`${process.env.VUE_APP_URL}/items/${id}`, {
							headers: { 'x-auth-token': token },
						})
						.catch(error => console.log('error', error))
					commit('deleteItem', id)
				}
			} catch (error) {
				dispatch('setNotification', { text: error.response.data.msg, type: 'danger' }, { root: true })
			}
		},
	},
	getters: {
		allItems: state => state.items,
		sortedItems: state => [...state.items].sort(sortingBy(state.currentSortBy)),
		isLoading: state => state.isLoading
	},
}
