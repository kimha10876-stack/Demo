import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "wss://tixclick.site/api/ws",
      reconnectDelay: 5000,
      debug: (str) => console.log("🐛 STOMP debug:", str),
      onConnect: () => {
        console.log("✅ Connected to STOMP WebSocket");

        client.subscribe("/all/messages", (msg) => {
          setMessage(msg.body);
        });
      },
      onStompError: (frame) => {
        console.log("❌ STOMP error:", frame);
      },
    });

    client.activate();

    return () => {
      // client.deactivate();
      setMessage(null);
    };
  });

  return message;
};

export default useWebSocket;
