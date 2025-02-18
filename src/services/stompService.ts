// src/services/stompService.ts
import { PetMatchNotification } from "@/lib/types/notification";
import { Client, Message } from "@stomp/stompjs";

const RABBITMQ_BROKER_URL = `ws://localhost:15674/ws`;
const WATCHLIST_EXCHANGE = "pet.watchlist";
const MATCH_EXCHANGE = "pet.matches";

export class PetMatchingService {
  private stompClient: Client | null = null;
  private messageHandlers: Map<
    string,
    ((data: PetMatchNotification) => void)[]
  > = new Map();
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  connect() {
    console.log("🔄 Initializing RabbitMQ STOMP connection...");

    this.stompClient = new Client({
      brokerURL: RABBITMQ_BROKER_URL,
      connectHeaders: {
        login: "guest",
        passcode: "guest",
        host: "/",
      },
      onConnect: () => this.handleConnect(),
      onStompError: (frame) => console.error("STOMP Error:", frame),
      onWebSocketClose: () => this.handleDisconnect(),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.activate();
  }

  private handleConnect() {
    console.log("✅ Connected to RabbitMQ");

    // Subscribe to user-specific watchlist queue
    const watchlistQueue = `/queue/watchlist.${this.userId}`;
    this.subscribeToQueue(watchlistQueue, "watchlist");

    // Subscribe to user-specific matches
    const matchesQueue = `/exchange/${MATCH_EXCHANGE}/matches.${this.userId}.#`;
    this.subscribeToQueue(matchesQueue, "matches");
  }

  private subscribeToQueue(queue: string, type: string) {
    console.log(`📬 Subscribing to ${type} queue: ${queue}`);

    this.stompClient?.subscribe(
      queue,
      (message: Message) => {
        try {
          const notification = JSON.parse(message.body) as PetMatchNotification;
          console.log(`📩 Received ${type} notification:`, notification);

          const handlers = this.messageHandlers.get(type) || [];
          handlers.forEach((handler) => handler(notification));
        } catch (error) {
          console.error(`❌ Failed to process ${type} message:`, error);
        }
      },
      {
        id: `${type}-${this.userId}`,
        ack: "client",
      }
    );
  }

  private handleDisconnect() {
    console.log("👋 Disconnected from RabbitMQ");
    setTimeout(() => {
      console.log("🔄 Attempting to reconnect...");
      this.connect();
    }, 5000);
  }

  subscribeToPetMatches(
    handler: (data: PetMatchNotification) => void
  ): () => void {
    return this.subscribeToType("matches", handler);
  }

  subscribeToWatchlist(
    handler: (data: PetMatchNotification) => void
  ): () => void {
    return this.subscribeToType("watchlist", handler);
  }

  private subscribeToType(
    type: string,
    handler: (data: PetMatchNotification) => void
  ): () => void {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);

    return () => {
      const updatedHandlers = (this.messageHandlers.get(type) || []).filter(
        (h) => h !== handler
      );
      this.messageHandlers.set(type, updatedHandlers);
    };
  }

  disconnect() {
    this.stompClient?.deactivate();
  }
}
