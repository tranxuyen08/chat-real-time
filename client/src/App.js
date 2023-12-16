import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import './App.css'
const host = "http://localhost:8000";

function App() {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host)

    socketRef.current.on('getId', data => {
      setId(data)
    })

    socketRef.current.on('sendDataServer', dataGot => {
      setMess(oldMsgs => [...oldMsgs, dataGot.data])
      scrollToBottom()
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
        timestamp: Date.now()
      }
      socketRef.current.emit('sendDataClient', msg)
      setMessage('')
    }
  }

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }


  const renderMess = mess.map((m, index) =>
    <div key={index} className={`${m.id === id ? 'your-message' : 'other-people'} chat-item`}>
      {m.content}
    </div>
  )

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage()
    }
  }

  return (
    <div className="container">
      <h1>Box Chat</h1>
      <div class="box-chat">
        <div class="box-chat_message">
          {renderMess}
          <div style={{ float: "left", clear: "both" }}
            ref={messagesEnd}>
          </div>
        </div>
        <div class="send-box">
          <textarea
            value={message}
            onKeyDown={onEnterPress}
            onChange={handleChange}
            placeholder="Nhập tin nhắn ..."
          />
          <button onClick={sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16"
              height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
              <path
                d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;