import React, { useState, useEffect } from "react";
import { triggerEvent, listenEvent } from "../socket/index";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router'

function Chat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roomMessage, setRoomMessage] = useState("");
  const [secondUserName, setSecondUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const name = location?.state?.name;
  const roomId = location?.state?.roomId;

  // Join Room
  useEffect(() => {
    if (!roomId) {
      navigate('/') // Redirect to home page if roomId is not provided
      return;
    }
    triggerEvent(JoinRoom);
    eventListener();
  }, [roomId]);

  //Trigger Join Room Event
  const JoinRoom = { event_name: "join_room", data: { name, roomId } }; // Join Room
  const handleSendMessage = {
    event_name: "chat_message",
    data: { roomId, message, name },
  }; // Send Message
  const handleStartTyping = {
    event_name: "typing",
    data: { roomId, status: true },
  }; // Update Typing Status Start
  const handleStopTyping = {
    event_name: "typing",
    data: { roomId, status: false },
  }; // Update Typing Status Stop
  const eventListener = () => {
    listenEvent(userJoinedRoom);
    listenEvent(chatStarted);
    listenEvent(userReceivedMessage);
    listenEvent(userTypingStatus);
    listenEvent(userOfflineStatus);
  };

  // Listen for User Joined Room Event
  const userJoinedRoom = {
    event_name: "joinRoom",
    handler: (data) => setRoomMessage(data),
  };

  // Listen for New User Joined Room Event
  const chatStarted = {
    event_name: "start_chat",
    handler: (data) => {
      const { name } = data;
      setLoading(false);
      setUserOnline(true);
      setSecondUserName(name);
      setMessages([]); // When a new user joins, clear the messages
    },
  };

  // Online Offline Status
  const userOfflineStatus = {
    event_name: "user_offline",
    handler: (data) => {
      setTyping(data);
      setUserOnline(data);
    },
  };

  // Listen for User Typing Status Event
  const userTypingStatus = {
    event_name: "typing_status",
    handler: (status) => setTyping(status),
  };

  // Listen for User Received Message Event
  const userReceivedMessage = {
    event_name: "send_message",
    handler: (data) => {
      const { message, name } = data;
      setTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { userName: name, message },
      ]);
    },
  };

  // If Room is not loaded, show a loading message
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center gap-2">
        <p className="text-2xl font-semibold underline">{roomMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex items-center justify-between w-full bg-[#026f8f] px-2 py-3">
        <div className="flex items-center gap-2">
          <span className=" bg-slate-800 text-white py-2 px-4 rounded-full">
            {secondUserName?.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-lg font-semibold text-white">{secondUserName}</p>
            <p
              className={`font-semibold text-xs capitalize ${
                userOnline ? " text-green-400" : "text-red-500"
              }`}
            >
              {userOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {typing && (
          <p className="text-xs font-normal text-gray-200">typing...</p>
        )}
      </div>
      {/* Chat Box */}
      <div className="flex-1 w-full h-full overflow-y-auto">
        <ul className="flex flex-col space-y-5 px-4 py-2 mt-2">
          {messages?.map((data, index) => (
            <li
              key={index}
              className={`${
                data.userName == name ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`bg-[#e1e5eb] inline-block rounded-lg px-4 py-1.5 m-2`}
              >
                {data.message}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex  items-center justify-between w-full bg-[#f1f6f7]">
        <input
          value={message}
          type="text"
          onFocus={() => triggerEvent(handleStartTyping)}
          onBlur={() => !message && triggerEvent(handleStopTyping)}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent px-2 py-3 rounded-md outline-none"
          placeholder="Type your message here..."
        />
        <button
          onClick={() => {
            if (message) {
              setMessage("");
              setMessages((prevMessages) => [
                ...prevMessages,
                { userName: name, message },
              ]);
              triggerEvent(handleSendMessage);
            }
          }}
          className="bg-[#026f8f] text-white px-4 py-2 rounded-md hover:bg-[#298fae] transition-colors ease-linear duration-150"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
