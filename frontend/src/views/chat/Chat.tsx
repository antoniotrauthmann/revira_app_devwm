import { useState, useEffect } from 'react';
import MessageBubble from '../../components/MessageBubble';
import ChatInput from '../../components/ChatInput';

interface MensagemDB {
  id_mensagem: number;
  conteudo: string;
  id_remetente: number;
  enviado_em: string;
  url_imagem?: string; // 1. Nova coluna do banco de dados adicionada
}

export default function Chat() {
  const [messages, setMessages] = useState<MensagemDB[]>([]);
  
  const MEU_ID = 1; 
  const FORNECEDOR_ID = 2; 

  const carregarMensagens = () => {
    fetch('http://localhost:3000/mensagens')
      .then(res => res.json())
      .then(dados => {
        if (Array.isArray(dados)) {
          setMessages(dados);
        } else {
          console.error('O backend retornou um erro em vez de uma lista:', dados);
          setMessages([]); 
        }
      })
      .catch(erro => console.error('Erro de conexão:', erro));
  };

  useEffect(() => {
    carregarMensagens();
  }, []);

  // 2. Função atualizada para receber também a imagem
  const handleSendMessage = async (texto: string, imageUrl?: string) => {
    if (!texto && !imageUrl) return;

    await fetch('http://localhost:3000/mensagens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conteudo: texto || '', // Garante envio mesmo se for só uma imagem
        url_imagem: imageUrl || null, // Passa a imagem ou nulo
        id_remetente: MEU_ID,
        id_destinatario: FORNECEDOR_ID
      })
    });

    carregarMensagens();
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', background: '#202024', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '80vh', border: '1px solid #323238', overflow: 'hidden' }}>
      
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #323238', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#1a1a1e' }}>
        <span style={{ color: '#00b37e', fontSize: '24px', cursor: 'pointer' }}>←</span>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#00b37e', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>F</div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h3 style={{ margin: 0, color: '#e1e1e6', fontSize: '18px' }}>Fornecedor Atacadista</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ color: '#00b37e', fontSize: '13px', fontWeight: 'bold' }}>● Online agora</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg) => {
          const horarioFormatado = new Date(msg.enviado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <MessageBubble 
              key={msg.id_mensagem} 
              text={msg.conteudo} 
              isUser={msg.id_remetente === MEU_ID} 
              time={horarioFormatado} 
              imageUrl={msg.url_imagem} // 3. Passando a url para o balão renderizar
            />
          );
        })}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #323238' }}>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      
    </div>
  );
}