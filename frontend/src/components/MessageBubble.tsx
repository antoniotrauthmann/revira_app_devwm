interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  time: string;
  imageUrl?: string; // Propriedade nova
}

export default function MessageBubble({ text, isUser, time, imageUrl }: MessageBubbleProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      width: '100%'
    }}>
      <span style={{ color: '#8d8d99', fontSize: '12px', marginBottom: '5px', marginLeft: '5px', marginRight: '5px' }}>
        {isUser ? 'Você' : 'Fornecedor'}
      </span>
      
      <div style={{
        background: isUser ? '#00b37e' : '#323238',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: isUser ? '8px 8px 0px 8px' : '8px 8px 8px 0px',
        maxWidth: '75%',
        textAlign: 'left',
        fontSize: '15px',
        lineHeight: '1.4'
      }}>
        
        {/* Renderiza a imagem se ela existir */}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Anexo" 
            style={{ 
              maxWidth: '100%', 
              borderRadius: '6px', 
              marginBottom: text ? '8px' : '0' // Dá um espaço se houver texto logo abaixo
            }} 
          />
        )}

        {/* Renderiza o texto se ele não for vazio */}
        {text && <div style={{ marginBottom: '4px' }}>{text}</div>}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: isUser ? '#e1e1e6' : '#8d8d99' }}>{time}</span>
          {isUser && <span style={{ fontSize: '12px', color: '#fff' }}>✓✓</span>}
        </div>
      </div>
    </div>
  );
}