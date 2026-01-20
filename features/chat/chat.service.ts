
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: number;
}

export const ChatService = {
  connect() { console.log('Chat Connected'); },
  async sendMessage(text: string): Promise<ChatMessage> {
    await new Promise(r => setTimeout(r, 800));
    return {
      id: Date.now().toString(),
      text: `Lamie received: "${text}". We will get back to you shortly!`,
      sender: 'bot',
      timestamp: Date.now()
    };
  }
};
