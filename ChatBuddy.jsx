import React, {useState } from 'react';
import axios from 'axios';
const AI_URL= 'http://localhost:5000/api';
const ChatBuddy = ({ token}) => {
    const [input, setInput] = useState('');
    const[messages, setMessages] = useState([]);
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim())return;
        const userMessage ={ role:'user',content: input };
        setmessages((prev) => [...prev, userMessage]);
        setInput('');
        try{
            const config ={
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            };
            const res= await axios.post(`${AI_URL}/chat`,{ query: userMessage.content },config);
            const aiMessage={role: 'ai', content: res.data.response };
            setMessages((prev) => [...prev, aiMessage]);
        }catch (error){
            console.error('AI chat failed:', error);
            setMessages((prev) => [
            ...prev,
            { role: 'error', content: 'Could not connect to AI. Unauthorized or server error.'}
            ]);
        }
    };
    return(
        <div className="chat-interface">
        <h3>AI Study Buddy</h3>
        <div className="message-history">
            {messages.map((msg, index) =>(
                <div key={index} className={`message ${msg.role}`}>
                    <strong>{msg.role === 'user' ? 'You:' : 'Buddy:'}</strong>{msg.content}
                    </div>
    ))}
    </div>
    <form onSubmit={handleSend}>
        <input 
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
        />
        <button type="submit">Send</button>
        </form>
        </div>
      );
    };
     export default ChatBuddy;