import { create } from "zustand";
import { API } from "../axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  tournaments: [],
  isLoadingTournaments: false,

  signup: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.post(`/users/signup`, payload);
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.post(`/users/login`, {
        email,
        password,
      });
      if (response.data.success === true) {
        localStorage.setItem("authToken", response.data.data.token);
      }
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error logged in.",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({ isLoading: true, error: null });
    try {
      localStorage.removeItem("authToken");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Error logging out.",
        isLoading: "false",
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await API.get(`/users/checkAuth`, {
        headers: {
          authorization: `${localStorage.getItem("authToken")}`,
        },
      });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem("authToken");
      }
      set({
        error: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
  getTournaments: async () => {
    set({ isLoadingTournaments: true, error: null });
    try {
      const response = await API.get(`/tournaments/all`, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
      set({
        tournaments: response.data.data,
        isLoadingTournaments: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error fetching tournaments",
        isLoadingTournaments: false,
      });
    }
  },
}));
