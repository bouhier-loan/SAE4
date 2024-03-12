import {createStore} from 'vuex';

export default createStore({
    state: {
        userId: null,
        token: null
    },
    mutations: {
      setUserId(state, userId) {
          state.userId = userId;
      },
      setToken(state, token) {
          state.token = token;
      }
    },
})