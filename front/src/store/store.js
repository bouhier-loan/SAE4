import {createStore} from 'vuex';

export default createStore({
    state: {
        conversationMessages: {},
        conversations: [],
        currentConversation: null,
        usernames: {}
    },
    mutations: {
        updateCache(state, payload) {
            state.conversationMessages= payload;
        },
        updateConversationId(state, payload) {
            state.currentConversation = payload;
        },
        updateUsernames(state, payload) {
            state.usernames = payload;
        },
        updateConversations(state, payload) {
            state.conversations = payload;
        }
    }
})