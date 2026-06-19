// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../contexts/AuthProvider";
// import { Client } from "@stomp/stompjs";

// const ChatApp: React.FC = () => {
//   const context = useContext(AuthContext);
//   const [stompClient, setStompClient] = useState<Client | null>(null);
//   const [message, setMessage] = useState("");
//   const [privateMessage, setPrivateMessage] = useState("");
//   const [toUser, setToUser] = useState("");
//   const [messages, setMessages] = useState<string[]>([]);
//   const [connectionStatus, setConnectionStatus] = useState("Disconnected");
//   const [currentUser, setCurrentUser] = useState<string>("");

//   useEffect(() => {
//     // Nếu có token, lấy username từ token
//     if (context?.accessToken) {
//       try {
//         const tokenParts = context.accessToken.split(".");
//         if (tokenParts.length === 3) {
//           const payload = JSON.parse(atob(tokenParts[1]));
//           setCurrentUser(payload.sub || "unknown");
//           console.log("👤 Current user:", payload.sub);
//         }
//       } catch (e) {
//         console.error("Error parsing token:", e);
//       }
//     }

//     // Kết nối WebSocket khi component được mount
//     connectWebSocket();

//     // Cleanup khi component unmount
//     return () => {
//       if (stompClient) {
//         stompClient.deactivate();
//         console.log("🔌 WebSocket disconnected");
//       }
//     };
//   }, [context?.accessToken]);

//   const connectWebSocket = () => {
//     const brokerURL = wss://localhost:8443/ws?token=${context?.accessToken};
//     console.log("🔗 WebSocket URL:", brokerURL);

//     const client = new Client({
//       brokerURL,
//       debug: (str: any) => console.log(str),
//       onConnect: (frame: any) => {
//         console.log("✅ Connected to WebSocket:", frame);
//         setConnectionStatus("Connected");

//         // Đăng ký nhận tin nhắn riêng tư
//         client.subscribe("/user/specific/messages", (message: any) => {
//           try {
//             console.log("📩 Received private message:", message.body);
//             const messageData = JSON.parse(message.body);
//             // Format: From {sender}: {content}
//             setMessages((prev) => [
//               ...prev,
//               From ${messageData.sender}: ${messageData.content},
//             ]);
//           } catch (e) {
//             console.error("Error parsing private message:", e);
//             // Fallback for old format
//             setMessages((prev) => [...prev, `Private: ${message.body}`]);
//           }
//         });
//       },
//       onStompError: (frame: any) => {
//         console.error("❌ Broker error: ", frame.headers["message"]);
//         setConnectionStatus("Error: " + frame.headers["message"]);
//       },
//       onDisconnect: () => {
//         console.log("🔌 Disconnected from WebSocket");
//         setConnectionStatus("Disconnected");
//       },
//     });

//     client.activate();
//     setStompClient(client);
//   };

//   const sendMessage = () => {
//     if (stompClient && message) {
//       try {
//         stompClient.publish({
//           destination: "/app/application",
//           body: JSON.stringify({ text: message }),
//         });
//         console.log("📤 Sent broadcast message:", message);
//       } catch (error) {
//         console.error("❌ Error sending message:", error);
//       }
//     } else {
//       console.warn("⚠️ StompClient not connected or message is empty");
//     }
//   };

//   const sendPrivateMessage = () => {
//     if (stompClient && privateMessage && toUser) {
//       try {
//         stompClient.publish({
//           destination: "/app/private",
//           body: JSON.stringify({ text: privateMessage, to: toUser }),
//         });
//         console.log📤 Sent private message to ${toUser}:`, privateMessage);
//         setMessages((prev) => [
//           ...prev,
//           Sent to ${toUser}: ${privateMessage},
//         ]);
//         setPrivateMessage("");
//       } catch (error) {
//         console.error("❌ Error sending private message:", error);
//       }
//     } else {
//       console.warn(
//         "⚠️ StompClient not connected or message/recipient is empty"
//       );
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl space-y-4">
//       <div className="text-center space-y-2">
//         <span
//           className={`px-2 py-1 rounded text-white ${
//             connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"
//           }`}
//         >
//           {connectionStatus}
//         </span>
//         {currentUser && (
//           <div className="text-sm">
//             Logged in as: <strong>{currentUser}</strong>
//           </div>
//         )}
//       </div>

//       <div className="space-y-2">
//         <h3 className="font-bold">Broadcast Message</h3>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Message to all"
//           className="border p-2 rounded w-full text-black placeholder-gray-500"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
//           disabled={!stompClient || !message}
//         >
//           Send to All
//         </button>
//       </div>

//       <div className="space-y-2">
//         <h3 className="font-bold">Private Message</h3>
//         <input
//           type="text"
//           value={toUser}
//           onChange={(e) => setToUser(e.target.value)}
//           placeholder="Recipient username"
//           className="border p-2 rounded w-full text-black placeholder-gray-500"
//         />
//         <input
//           type="text"
//           value={privateMessage}
//           onChange={(e) => setPrivateMessage(e.target.value)}
//           placeholder="Private message"
//           className="border p-2 rounded w-full text-black placeholder-gray-500"
//         />
//         <button
//           onClick={sendPrivateMessage}
//           className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
//           disabled={!stompClient || !privateMessage || !toUser}
//         >
//           Send Private
//         </button>
//       </div>

//       <div className="mt-4 space-y-2">
//         <h2 className="text-lg font-bold">Messages</h2>
//         <div className="border p-4 rounded bg-gray-100 max-h-60 overflow-y-auto">
//           {messages.length > 0 ? (
//             messages.map((msg, index) => (
//               <p
//                 key={index}
//                 className="p-2 mb-2 bg-white shadow rounded text-black"
//               >
//                 {msg}
//               </p>
//             ))
//           ) : (
//             <p className="text-gray-500 italic">No messages yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatApp;





//Api chạy cho tạo ticketPurchase trong thẳng api đó và channel lấy theo Id

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// import { Client } from '@stomp/stompjs';
// import WebSocket from 'ws';

// const websocketChannel = '198'; // ← thay bằng ticketPurchase_id

// const client = new Client({
//   brokerURL: 'wss://localhost:8443/ws',
//   webSocketFactory: () => {
//     console.log("🔌 Attempting to connect to WebSocket...");
//     return new WebSocket('wss://localhost:8443/ws');
//   },
//   onConnect: () => {
//     console.log('✅ WebSocket connected');

//     const destination = `/all/${websocketChannel}/ticket-purchase-expired`;
//     console.log(`📩 Subscribing to: ${destination}`);

//     client.subscribe(destination, (message) => {
//       try {
//         const body = JSON.parse(message.body);
//         console.log('📥 Received message:', body);
//       } catch (e) {
//         console.log('⚠️ Raw message:', message.body);
//       }
//     });
//   },
//   onStompError: (frame) => {
//     console.error('❌ STOMP error:', frame);
//   },
//   onWebSocketClose: () => {
//     console.log('🔌 WebSocket connection closed');
//   },
//   onWebSocketError: (error) => {
//     console.error('❌ WebSocket error:', error);
//   }
// });

// client.activate();
