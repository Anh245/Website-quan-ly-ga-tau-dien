import { create } from "zustand";
import { toast } from "sonner";
//import { authService } from "@/services/authServiceAPI";


export const useAuthStore = create((set, get) => ({
 accessToken: null,
 user: null,
 loading: false,
    signUp: async(firstname,lastname,username, email, password) => {
        try {
            set({ loading: true });

            //goi API signup
            await authService.signUp(firstname,lastname,username, email, password);
            toast.success("Signup successful!");
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error("Signup failed. Please try again.");
        } finally {
            set({ loading: false });
        }

    }
}));