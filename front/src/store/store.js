import {createStore} from 'vuex';

export default createStore({
    state: {
        conversationCache: {},
        currentConversation: null
    },
    mutations: {
        updateCache(state, payload) {
            state.conversationCache= payload;
        },
        updateConversationId(state, payload) {
            state.currentConversation = payload;
        }
    }
})