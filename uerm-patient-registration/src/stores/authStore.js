import { defineStore } from 'pinia'
import { Cookies } from 'quasar'
import { jwtDecode } from 'jwt-decode'

const TOKEN_COOKIE = 'patientReg__token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: '',
    firstName: '',
    lastName: '',
    role: '',
    token: null
  }),
  getters: {
    fullName: (state) => {
      return `${state.firstName} ${state.lastName}`.trim();
    },
    isAuthenticated: (state) => !!state.token
  },
  persist: true,

  actions: {
    saveLoginData(token, userData) {
      this.token = token;
      this.username = userData.employeeCode;
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
      this.role = userData.role || '';

      Cookies.set(TOKEN_COOKIE, token, {
        sameSite: 'Strict',
        secure: process.env.APP_ENV !== 'dev'
      });
      console.log(process.env.APP_ENV)
    },

    restoreFromCookie() {
      const token = Cookies.get(TOKEN_COOKIE);
      if (!token) {
        return false;
      }

      try {
        const decoded = jwtDecode(token);
        this.token = token;
        this.username = decoded.employeeCode;
        this.firstName = decoded.firstName;
        this.lastName = decoded.lastName;
        this.role = decoded.role || '';
        return true;
      } catch (err) {
        console.error('Invalid token in cookie:', err);
        this.logout();
        return false;
      }
    },

    logout() {
      Cookies.remove(TOKEN_COOKIE);
      this.$reset();
    }
  }
})
