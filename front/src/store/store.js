import {createStore} from 'vuex';

export default createStore({
    state: {
        conversationMessages: {},
        conversations: [],
        currentConversation: null,
        users: [],
        fetchMessages: true,
        showAddParticipantModal: false,
        showCreateConversationModal: false
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
        },
        updateFetchMessages(state, payload) {
            state.fetchMessages = payload;
        },
        showAddParticipantModal(state, payload) {
            state.showAddParticipantModal = payload;
        },
        showCreateConversationModal(state, payload) {
            state.showCreateConversationModal = payload;
        }
    }
})