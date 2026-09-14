import './App.css'
import Chat from './views/chat/Chat'

function App() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      backgroundColor: '#121214', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <Chat />
    </div>
  )
}

export default App