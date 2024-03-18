import {createStore} from 'vuex';

export default createStore({
    state: {
        conversationMessages: {},
        conversations: [],
        currentConversation: null,
        users: []
    },
    mutations: {
        updateCache(state, payload) {
            state.conversationMessages= payload;
        },
        updateConversationId(state, payload) {
            state.currentConversation = payload;
        },
        updateUsers(state, payload) {
            state.users = payload;
        },
        updateConversations(state, payload) {
            state.conversations = payload;
        }
    }
})