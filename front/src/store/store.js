import {createStore} from 'vuex';

export default createStore({
    state: {
        conversations: [],
        currentConversation: null,
        users: [],
        fetchMessages: true,
        showAddParticipantModal: false,
        showCreateConversationModal: false
    },
    mutations: {
        updateConversationId(state, payload) {
            state.currentConversation = payload;
        },
        updateUsers(state, payload) {
            state.users = payload;
        },
        updateConversation(state, payload) {
            // Find the conversation in the list of conversations
            let conversation = state.conversations.find(conversation => conversation.id === payload.id);

            /* Humanize the date */
            payload.messages.forEach(message => {
                // If the message is sent today, only show the relative time
                if (new Date(message.date).toDateString() === new Date().toDateString()) {
                    // If the message is sent today, only show the relative time (e.g. "Aujourd'hui à 14:30") without the seconds
                    message.date = "Aujourd'hui à " + new Date(message.date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }).replace(':', 'h');
                } else {
                    message.date = "Le " + new Date(message.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }) + " à " + new Date(message.date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }).replace(':', 'h');
                }
            });

            // If the conversation already exists, update the unread messages count
            if (conversation) {
                conversation.unreadMessages = state.currentConversation === conversation.id ? 0 : conversation.unreadMessages + payload.messages.length;
                conversation.messages.push(...payload.messages);
            } else {
                payload.unreadMessages = state.currentConversation === payload.id ? 0 : payload.messages.length;
                state.conversations.push(payload);
            }


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