// src/services/stompService.ts
import { PetMatchNotification } from "@/lib/types/notification";
import { Client, Message } from "@stomp/stompjs";

const RABBITMQ_BROKER_URL = "ws://localhost:15674/ws";
const MATCH_QUEUE = "/exchange/snif.events/pet.matches.*";

let stompClient: Client | null = null;

const messageHandlers: ((data: PetMatchNotification) => void)[] = [];

export const connectToRabbitMQ = () => {
  console.log("🔄 Initializing RabbitMQ STOMP connection...");

  try {
    stompClient = new Client({
      brokerURL: RABBITMQ_BROKER_URL,
      connectHeaders: {
        login: "guest",
        passcode: "guest",
        host: "/",
      },
      onStompError: (frame) => console.error("STOMP Error:", frame),
      onWebSocketClose: (event) => console.log("WebSocket Closed:", event),
      onWebSocketError: (event) => console.log("WebSocket Error:", event),
      onDisconnect: (frame) => console.log("STOMP Disconnect:", frame),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("✅ Successfully connected to RabbitMQ");

      try {
        console.log(`📬 Subscribing to queue: ${MATCH_QUEUE}`);
        stompClient?.subscribe(
          MATCH_QUEUE,
          (message: Message) => {
            console.log("📨 Raw message received:", message);
            try {
              const notification = JSON.parse(
                message.body
              ) as PetMatchNotification;
              console.log("📩 Parsed notification:", notification);
              messageHandlers.forEach((handler) => {
                console.log("🔔 Calling handler with notification");
                handler(notification);
              });
            } catch (error) {
              console.error(
                "❌ Failed to process message:",
                error,
                message.body
              );
            }
          },
          {
            id: "match-sub",
            ack: "client",
          }
        );
        console.log("✅ Successfully subscribed to queue");
      } catch (subscribeError) {
        console.error("❌ Failed to subscribe to queue:", subscribeError);
      }
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame);
    };

    stompClient.activate();

    return () => {
      console.log("👋 Disconnecting from RabbitMQ...");
      stompClient?.deactivate();
    };
  } catch (error) {
    console.error("❌ Failed to initialize STOMP connection:", error);
    throw error;
  }
};

export const subscribeToMatches = (
  handler: (data: PetMatchNotification) => void
) => {
  try {
    console.log("➕ Adding new match notification subscriber");
    messageHandlers.push(handler);
    return () => {
      console.log("➖ Removing match notification subscriber");
      const index = messageHandlers.indexOf(handler);
      if (index > -1) {
        messageHandlers.splice(index, 1);
      }
    };
  } catch (error) {
    console.error("❌ Error in subscription handling:", error);
    throw error;
  }
};
