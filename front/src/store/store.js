import {createStore} from 'vuex';

export default createStore({
    state: {
        conversations: [],
        currentConversation: null,
        users: [],
        updateView: false,
        showAddParticipantModal: false,
        showCreateConversationModal: false
    },
    mutations: {
        updateCurrentConversation(state, payload) {
            state.currentConversation = payload;
        },
        updateUsers(state, payload) {
            state.users = payload;
        },
        updateConversation(state, payload) {
            // Find the conversation in the list of conversations
            let conversation = state.conversations.find(conversation => conversation.id === payload.id);

            // If the conversation already exists, update the unread messages count
            if (conversation) {
                conversation.unreadMessages = state.currentConversation === conversation.id ? 0 : conversation.unreadMessages + payload.messages.length;
                conversation.messages.push(...payload.messages);
            } else {
                payload.unreadMessages = state.currentConversation === payload.id ? 0 : payload.messages.length;
                state.conversations.push(payload);
            }
        },
        updateView(state, payload) {
            state.updateView = payload;
        },
        showAddParticipantModal(state, payload) {
            state.showAddParticipantModal = payload;
        },
        showCreateConversationModal(state, payload) {
            state.showCreateConversationModal = payload;
        }
    }
})