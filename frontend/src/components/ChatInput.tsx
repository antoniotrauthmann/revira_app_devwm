import { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string, imageUrl?: string) => void; // Assinatura atualizada
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verifica se o arquivo é uma imagem
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onSendMessage('', imageUrl); // Envia a imagem sem texto
      } else {
        // Se for PDF, docx, etc., envia como texto
        onSendMessage(`📎 Arquivo anexado: ${file.name}`);
      }
      event.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept="image/*, application/pdf" // Sugere procurar imagens e PDFs primeiro
      />

      <button 
        onClick={() => fileInputRef.current?.click()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#8d8d99', padding: '0 5px' }}
      >
        📎
      </button>

      <input 
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Digite sua mensagem..."
        style={{
          flex: 1,
          padding: '12px 20px',
          borderRadius: '25px',
          border: '1px solid #323238',
          background: '#121214',
          color: '#fff',
          outline: 'none',
          fontSize: '15px'
        }}
      />
      
      <button 
        onClick={handleSend}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: '#00b37e',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}
      >
        ➤
      </button>
    </div>
  );
}