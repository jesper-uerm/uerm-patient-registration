<template>
  <q-layout view="lHh Lpr fff" class="main-background">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center">
        <div class="row q-pa-lg">
          <div class="row">
            <q-card
              class="shadow-24"
              style="border-radius: 20px"
              :style="{ width: $q.screen.lt.md ? '550px' : '', maxWidth: '100%' }"
            >
              <q-card-section class="text-white" style="background-color: #004aad">
                <div class="column items-center justify-center q-py-md">
                  <div>
                    <q-img
                      src="~assets/uermmc-white-logo.png"
                      alt="UERM Medical Center Logo"
                      contain
                      width="140px"
                      class="cursor-pointer"
                      @click="$router.push('/')"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-lg q-px-lg">
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <q-input
                    outlined
                    v-model="username"
                    label="Employee Number"
                    hint="Enter your employee number"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" style="color: #004aad" />
                    </template>
                  </q-input>

                  <q-input
                    outlined
                    v-model="password"
                    :type="isPwd ? 'password' : 'text'"
                    label="Password"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" style="color: #004aad" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                        color="grey-7"
                      />
                    </template>
                  </q-input>

                  <div class="q-mt-md text-center">
                    <q-btn
                      unelevated
                      type="submit"
                      color="blue-10"
                      label="Login"
                      :loading="loading"
                      icon-right="login"
                      class="login-btn full-width text-weight-bold"
                    />
                  </div>
                </q-form>
              </q-card-section>

              <q-card-section class="text-center q-pb-lg">
                <div class="q-mt-md text-grey-8">
                  New Patient?
                  <router-link
                    to="/"
                    class="text-weight-bold cursor-pointer hover-underline"
                    style="color: #004aad; text-decoration: none"
                  >
                    Registration Forms
                  </router-link>
                </div>
                <q-separator spaced />
                <div class="q-mt-lg text-grey-1">
                  <q-footer class="bg-transparent text-grey text-center q-mb-md">
                    <div class="text-caption">
                      &copy; {{ currentYear }} UERM Memorial Medical Center. All rights
                      reserved.
                    </div>
                  </q-footer>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";

export default {
  name: "HospitalLoginPage",

  data() {
    return {
      username: "",
      password: "",
      isPwd: true,
      loading: false,
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    async onSubmit() {
      this.loading = true;

      try {
        const response = await axios.post("http://10.107.0.2:3000/api/auth/login", {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem("userRole", response.data.user.role);

        const targetPath = response.data.redirectPath;

        this.$q.notify({
          type: "positive",
          message: `Login Successful!`,
        });

        this.$router.push(targetPath);
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: error.response?.data?.message || "Login failed",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.main-background {
  min-height: 100vh;
  background-color: #ffffff;

  background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.9),
      rgba(20, 74, 173, 0.9)
    ),
    url("/bg-images/uermmmc_bg.jpg");

  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}
.login-btn {
  height: 45px;
  border-radius: 8px;
}
.hover-underline:hover {
  text-decoration: underline;
}
</style>
