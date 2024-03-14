import {createStore} from 'vuex';

export default createStore({
    state: {
        conversationCache: {},
        currentConversation: null,
        usersNames: {},
    },
    mutations: {
        updateCache(state, payload) {
            state.conversationCache= payload;
        },
        updateConversationId(state, payload) {
            state.currentConversation = payload;
        },
        updateUsersNames(state, payload) {
            state.usersNames = payload;
        }
    },
})