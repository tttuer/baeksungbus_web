import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import qs from "qs";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token"));
  const user = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.username === "bsbus");

  const login = async (credentials) => {
    try {
      isLoading.value = true;
      const response = await api.post(
        "/api/users/login",
        qs.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.access_token) {
        token.value = response.data.access_token;
        localStorage.setItem("token", token.value);
        return;
      }
      
      const loginError = new Error("로그인에 실패했습니다.");
      loginError.response = { status: 401 };
      throw loginError;
    } catch (error) {
      isLoading.value = false;
      
      if (error.message === "로그인에 실패했습니다.") {
        throw error;
      }
      
      const authError = new Error(
        error.response?.data?.detail || error.message || "로그인 중 오류가 발생했습니다."
      );
      authError.response = error.response;
      throw authError;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      if (token.value) {
        await api.post("/api/users/logout");
      }
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("token");
    }
  };

  const isTokenExpired = () => {
    if (!token.value) return true;
    
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]));
      const currentTime = Date.now() / 1000;
      console.log("토큰 만료 확인:", {
        expires: payload.expires,
        currentTime: currentTime,
        isExpired: payload.expires < currentTime
      });
      return payload.expires < currentTime;
    } catch (error) {
      console.error("토큰 파싱 오류:", error);
      return true;
    }
  };

  const checkTokenAndLogout = async () => {
    if (isTokenExpired()) {
      await logout();
      return true;
    }
    return false;
  };

  const getUserInfo = async () => {
    try {
      const response = await api.get("/api/users/me");
      user.value = response.data;
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      logout();
    }
  };

  const initAuth = async () => {
    if (token.value) {
      // getUserInfo 호출 제거 - API가 없으므로
    }
  };

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getUserInfo,
    initAuth,
    isTokenExpired,
    checkTokenAndLogout,
  };
});
