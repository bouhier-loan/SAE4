import {createStore} from 'vuex';

export default createStore({
    state: {
        conversationCache: {},
        currentConversation: null,
        usernames: {}
    },
    mutations: {
        updateCache(state, payload) {
            state.conversationCache= payload;
        },
        updateConversationId(state, payload) {
            state.currentConversation = payload;
        },
        updateUsernames(state, payload) {
            state.usernames = payload;
        }
    }
})