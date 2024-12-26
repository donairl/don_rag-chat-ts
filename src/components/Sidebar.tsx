import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useChatStore } from '../store';

export const Sidebar = () => {
  const { chatHistory, currentChat, setCurrentChat, createNewChat } = useChatStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={createNewChat}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <IconPlus size={20} />
            New Chat
          </button>
          {currentChat && (
            <button
              onClick={() => setCurrentChat(null)}
              className="btn btn-outline text-red-500 hover:bg-red-50"
              title="Clear current chat"
            >
              <IconTrash size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setCurrentChat(chat)}
            className={`w-full p-3 rounded-lg text-left transition-colors duration-200 ${
              currentChat?.id === chat.id
                ? 'bg-primary-100 text-primary-900'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="font-medium truncate">{chat.title}</div>
            <div className="text-sm text-gray-500 truncate">
              {chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].content
                : 'No messages yet'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 