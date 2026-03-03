import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: '',
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    token: null
  }),
  persist: true,
  actions: {
    saveLoginData(userData) {
      this.username = userData.EmployeeCode;
      this.firstName = userData.FirstName;
      this.lastName = userData.LastName;
      this.role = userData.role || '';
      this.department = userData.Department_Description;
    },
    logout() {
      this.$reset();
    }
  }
})
