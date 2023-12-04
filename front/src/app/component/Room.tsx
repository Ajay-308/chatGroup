import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Moment from 'react-moment';
import { io, Socket } from "socket.io-client";

interface Message {
    time: Date;
    msg: string;
    name: string;
}

interface LocationState {
    room: string;
    name: string;
}

const ChatRoom: React.FC = () => {
    const location = useLocation();
    const typedLocation = location as { state: LocationState };
    const msgBoxRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<LocationState>();
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [allMessages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | undefined>();

    useEffect(() => {
        const socketClient = io("https://back3-awmj.onrender.com/");
        setSocket(socketClient);

        socketClient.on("connect", () => {
            socketClient.emit("joinRoom", location.state.room);
        });

        return () => {
            socketClient.disconnect();
        };
    }, [location]);
    const scrollToBottom = () => {
        if (msgBoxRef.current) {
            const scrollOptions: ScrollIntoViewOptions = {
                behavior: 'smooth',
                block: 'end',
            };
            msgBoxRef.current.lastElementChild?.scrollIntoView(scrollOptions);
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    },[allMessages])
    useEffect(() => {
        if (socket) {
            socket.on("getLatestMessage", (newMessage: Message) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                if (msgBoxRef.current) {
                    msgBoxRef.current.scrollIntoView({ behavior: "smooth" });
                }
                setMsg("");
                setLoading(false);
            });
        }
    }, [socket]);

    useEffect(() => {
        setData(location.state);
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value);
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
            scrollToBottom(); 
        }
    };
    const onSubmit = () => {
        if (msg && socket) {
            setLoading(true);
            const newMessage: Message = { time: new Date(), msg, name: data?.name || "" };
            socket.emit("newMessage", { newMessage, room: data?.room });
            setMsg("")
        }
    };
    return (
<div className="container-fluid bg-black bg-gradient text-dark min-h-screen flex flex-col items-center justify-center">
  <div className="py-2 m-5 w-[15rem] shadow bg-white text-black border-warning  border-3 rounded">
    <h1 className="text-warning mb-2 mx-4">{data?.room} Chat Room</h1>
  </div>
  <div className="bg-light border rounded p-3 w-[23rem] h-[35rem] mb-4 overflow-y-scroll">
    {allMessages.map((msg, index) => (
      <div
        key={index}
        className={`row ${
          data && data.name === msg.name
            ? "justify-content-end pl-5"
            : "justify-content-start"
        }`}
      >
        <div
          className={`d-flex flex-column m-2 p-2 shadow ${
            data && data.name === msg.name ? "bg-info" : "bg-white text-black"
          } border rounded w-auto`}
        >
          <div>
            <strong className="m-1">{msg.name}</strong>
            <small className="text-muted m-1">
              <Moment fromNow>{msg.time}</Moment>
            </small>
          </div>
          <h4 className="m-1">{msg.msg}</h4>
        </div>
      </div>
    ))}
    <div ref={msgBoxRef}></div>
  </div>
  <div className="form-group bg-blue-400 border-5 flex w-[23rem]">
    <input
      type="text"
      className="form-control bg-light flex-grow text-black"
      name="message"
      onKeyDown={handleEnter}
      placeholder="Type your message"
      value={msg}
      onChange={handleChange}
    />
    <button
      type="button"
      className="btn btn-warning mx-2 flex-shrink-0"
      disabled={loading}
      onClick={onSubmit}
    >
      {loading ? (
        <div className="spinner-border spinner-border-sm text-primary"></div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-send"
          viewBox="0 0 16 16"
        >
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
        </svg>
      )}
    </button>
  </div>
  </div>
    );
}

export default ChatRoom;
