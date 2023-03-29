import React,{useEffect, useState} from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
import { useNavigate } from "react-router-dom";

function ChatRoom({socket,username,room}) {
    const [currentMessage, setCurrentMessage] =useState("");
    const [messageList, setMessageList] = useState([]);
    const api_key = "652966869711951";
    const cloud_name = "dzuro2zmw";
    const navigate = useNavigate();

    //create sent messages
    const sendMessage = async() =>{
        if(currentMessage !== ""){
            const messageData ={
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

        await socket.emit("send_message",messageData);
        setMessageList((list) => [...list,messageData]);
        setCurrentMessage("");
        }
    };

    const moveHome = () => {
        navigate("/")
      }

    const moveUpload = () => {
        navigate("/upload")
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
          setMessageList((list) => [...list,data]);
          console.log(data);
        })
      },[socket]);
      
  return (
    //Render messages
    <div className="chat-window">
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className='message-container'>
            {messageList.map((messageContent) => {
                return (
                <div className='message' id ={username === messageContent.author ? "you":"other"}>
                    <div> 
                        <div className='message-content'>
                            <p>{messageContent.message}</p>
                        </div>
                        <div className='message-meta'>
                            <p id="time">{messageContent.time}</p>
                            <p id="author">{messageContent.author}</p>
                        </div>
                    </div>
                </div>
                );
            })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input type="text" value={currentMessage} placeholder="Hey..."
            onChange={(event) => {
                setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event)=> {event.key === "Enter" && sendMessage();
            }}
            />     
            <button onClick={sendMessage}>&#9658;</button>
        </div>
        <div className="redirect">
        <button id="redirect" onClick={moveHome}>Click to return to home</button>
        </div>
        <div className="redirect">
        <button onClick={moveUpload}>Click to join image chat</button>
        </div>
    </div>
 
  )
}

export default ChatRoom