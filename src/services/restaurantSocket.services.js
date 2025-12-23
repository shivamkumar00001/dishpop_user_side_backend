// services/restaurantSocket.service.js
import { io } from "socket.io-client";

class RestaurantSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.restaurantBackendUrl = process.env.RESTAURANT_BACKEND_URL || "http://localhost:5001";
  }

  /**
   * Connect to restaurant backend
   */
  connect() {
    if (this.socket && this.isConnected) {
      console.log("✅ Already connected to restaurant backend");
      return;
    }

    try {
      this.socket = io(this.restaurantBackendUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      });

      this.socket.on("connect", () => {
        console.log("✅ Connected to restaurant backend:", this.socket.id);
        this.isConnected = true;
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Disconnected from restaurant backend:", reason);
        this.isConnected = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Restaurant backend connection error:", error.message);
        this.isConnected = false;
      });

      this.socket.on("order:created:success", (data) => {
        console.log("✅ Order confirmed by restaurant:", data);
      });

      this.socket.on("error", (error) => {
        console.error("❌ Socket error from restaurant:", error);
      });

    } catch (error) {
      console.error("❌ Failed to connect to restaurant backend:", error);
    }
  }

  /**
   * Send order to restaurant
   * @param {Object} orderData - Order details
   * @returns {Promise} Order creation promise
   */
  sendOrder(orderData) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        return reject(new Error("Not connected to restaurant backend"));
      }

      // Set timeout for order confirmation
      const timeout = setTimeout(() => {
        reject(new Error("Order confirmation timeout"));
      }, 10000); // 10 seconds

      // Listen for success
      this.socket.once("order:created:success", (response) => {
        clearTimeout(timeout);
        resolve(response);
      });

      // Listen for error
      this.socket.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      // Send order
      this.socket.emit("customer:order:create", orderData);
      console.log("📦 Order sent to restaurant:", orderData.username, "Table:", orderData.tableNumber);
    });
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID to cancel
   */
  cancelOrder(orderId) {
    if (!this.socket || !this.isConnected) {
      console.error("❌ Cannot cancel order: Not connected to restaurant backend");
      return;
    }

    this.socket.emit("customer:order:cancel", { orderId });
    console.log("❌ Order cancellation requested:", orderId);
  }

  /**
   * Disconnect from restaurant backend
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("🔌 Disconnected from restaurant backend");
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null,
    };
  }
}

// Export singleton instance
const restaurantSocketService = new RestaurantSocketService();
export default restaurantSocketService;