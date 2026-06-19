const BASE_URL = "https://tixclick.site/api/account";

export class PinApi {
    static async registerPin(pinCode: string): Promise<boolean> {
        try {
            if (!pinCode) throw new Error("PIN code is required");

            const token = localStorage.getItem("accessToken2");
            if (!token) throw new Error("Authentication token missing");

            const response = await fetch(`${BASE_URL}/register-pin-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ pinCode }),
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();

            if (data.code === 0) {
                localStorage.setItem("has_pin", "true");
                return true;
            }

            throw new Error(data.message || "Không thể đăng ký mã PIN");
        } catch (error: any) {
            console.error("Lỗi khi đăng ký PIN:", error.message || error);
            return false;
        }
    }

    static async loginWithPin(pinCode: string): Promise<boolean> {
        try {
            if (!pinCode) throw new Error("PIN code is required");

            const response = await fetch(`${BASE_URL}/login-with-pin-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken2")}`,
                },
                body: JSON.stringify({ pinCode }),
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();

            if (data.code === 0) {
                sessionStorage.setItem("pin_verified", "true");
                return true;
            }

            throw new Error(data.message || "Mã PIN không đúng");
        } catch (error: any) {
            console.error("Lỗi khi đăng nhập bằng PIN:", error.message || error);
            return false;
        }
    }

    static hasPin(): boolean {
        return localStorage.getItem("has_pin") === "true";
    }

    static isPinVerified(): boolean {
        return sessionStorage.getItem("pin_verified") === "true";
    }
}
