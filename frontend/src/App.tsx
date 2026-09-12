import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // Estado com TypeScript para guardar a mensagem do backend
  const [mensagemBackend, setMensagemBackend] = useState<string>('Carregando dados do servidor...')

  // O useEffect roda assim que a página carrega no navegador
  useEffect(() => {
    // Fazendo a requisição HTTP para a API do seu Node.js
    fetch('http://localhost:3000/')
      .then((resposta) => resposta.json())
      .then((dados) => {
        // Guarda a resposta do backend no estado do React
        setMensagemBackend(dados.mensagem)
      })
      .catch((erro) => {
        console.error('Erro ao conectar com o backend:', erro)
        setMensagemBackend('Não foi possível conectar ao servidor backend.')
      })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Meu Primeiro Site com React + TypeScript</h1>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: '#202024', 
        color: '#00b37e', 
        borderRadius: '8px',
        display: 'inline-block'
      }}>
        <h3>📢 Mensagem vinda do Backend:</h3>
        <p><strong>{mensagemBackend}</strong></p>
      </div>
    </div>
  )
}

export default App
