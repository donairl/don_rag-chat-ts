import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Left Sidebar with Settings */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-center p-4">
          <h1 className="text-2xl font-bold">Don RAG Chat</h1>
        </div>
        <Sidebar />
        <Settings />
        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Chat />
      </div>
    </div>
  );
}

export default App;
