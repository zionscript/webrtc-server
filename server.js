const WebSocket = require('ws');

// Inicializa o WebSocket Server na porta 8080
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8000 });

console.log('Signaling server running on ws://0.0.0.0:8000');

// Função que envia uma mensagem para um cliente
function sendToClient(client, message) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    }
}

// Quando um cliente se conecta ao WebSocket
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Quando o servidor recebe uma mensagem de um cliente
    ws.on('message', (message) => {
        try {
            // Verifica se a mensagem é um objeto binário (Blob) ou string
            let data;
            if (typeof message === 'string') {
                data = JSON.parse(message); // Se a mensagem já for string
            } else {
                // Se for Blob, converte para string e depois faz o parse para JSON
                data = JSON.parse(message.toString());
            }

            console.log('Received:', data);

            // Reenvia a mensagem recebida para todos os outros clientes conectados
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    sendToClient(client, data);
                }
            });

        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Quando um cliente se desconecta
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Se houver erro na conexão do WebSocket
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
