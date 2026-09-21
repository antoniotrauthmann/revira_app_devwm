## Requisitos Não Funcionais

## Segurança 

* As senhas dos usuários devem ser obrigatoriamente armazenadas no banco de dados MySQL utilizando algoritmos de hash criptográfico, nunca em texto plano.

* A comunicação entre o aplicativo mobile e a API Node.js deve ser feita por meio de conexões seguras (HTTPS) em ambiente de produção para proteger os dados pessoais e as negociações no chat.


## Desempenho 

* O tempo de resposta das requisições ao servidor Express, como o carregamento do histórico de mensagens ou da lista de coletas, não deve ultrapassar 2 segundos na maioria das conexões.

* As fotos dos materiais recicláveis anexadas no chat ou nos anúncios devem ser comprimidas pelo aplicativo antes do envio.



## Usabilidade

* A interface deve ser focada em dispositivos móveis (Mobile-First), garantindo que os campos de digitação nunca sejam encobertos pelo teclado nativo do celular.

* O design deve ser inclusivo e fácil de operar para diferentes perfis (pessoas que querem descartar lixo em casa, catadores autônomos e empresas de reciclagem), mantendo contraste de cores legível e áreas de clique (touch targets) suficientemente grandes.


## Manutenibilidade

* O código frontend no React Native deve manter uma separação clara entre a navegação do Expo Router, os componentes visuais e a lógica de comunicação com a API, facilitando que múltiplos colegas do grupo trabalhem no mesmo repositório sem gerar muitos conflitos.

* O código deve ser padronizado e comentado nas funções mais complexas, especialmente no tratamento de datas e conversão de arquivos.
