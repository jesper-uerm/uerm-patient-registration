<template>
  <q-layout view="lHh Lpr fff" class="main-background">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center">
        <div class="row q-pa-lg">
          <div class="row">
            <q-card
              class="shadow-24"
              style="width: 550px; max-width: 90vw; border-radius: 20px"
            >
              <q-card-section class="text-white" style="background-color: #004aad">
                <div class="column items-center justify-center q-my-sm">
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
                <div
                  class="text-subtitle1 text-weight-bold text-grey-8 text-center q-mb-lg"
                >
                  REGISTRATION FORM
                </div>
                <q-form @submit="onSubmit" class="q-gutter-y-xs">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-sm-6">
                      <q-input
                        outlined
                        dense
                        v-model="form.firstName"
                        label="First Name"
                        :rules="[(val) => !!val || 'Required']"
                      >
                        <template v-slot:prepend>
                          <q-icon name="person" style="color: #004aad" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        outlined
                        dense
                        v-model="form.lastName"
                        label="Last Name"
                        :rules="[(val) => !!val || 'Required']"
                      >
                        <template v-slot:prepend>
                          <q-icon name="person" style="color: #004aad" />
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <q-input
                    outlined
                    dense
                    v-model="form.empnumber"
                    label="Employee Number"
                    type="number"
                    :rules="[(val) => !!val || 'Required', isValidEmail]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" style="color: #004aad" />
                    </template>
                  </q-input>

                  <q-input
                    outlined
                    dense
                    v-model="form.email"
                    label="Email Address"
                    type="email"
                    :rules="[(val) => !!val || 'Required', isValidEmail]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" style="color: #004aad" />
                    </template>
                  </q-input>

                  <q-input
                    outlined
                    dense
                    v-model="form.password"
                    :type="isPwd ? 'password' : 'text'"
                    label="Password"
                    :rules="[(val) => val.length >= 6 || 'Min 6 characters']"
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

                  <q-input
                    outlined
                    dense
                    v-model="form.confirmPassword"
                    :type="isPwdConfirm ? 'password' : 'text'"
                    label="Confirm Password"
                    :rules="[
                      (val) => !!val || 'Required',
                      (val) => val === form.password || 'Passwords do not match',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_clock" style="color: #004aad" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwdConfirm = !isPwdConfirm"
                        color="grey-7"
                      />
                    </template>
                  </q-input>

                  <div class="q-mt-md text-center">
                    <q-btn
                      unelevated
                      type="submit"
                      color="blue-10"
                      label="REGISTER"
                      :loading="loading"
                      icon-right="arrow_forward"
                      class="login-btn full-width text-weight-bold"
                    />
                  </div>
                </q-form>
              </q-card-section>

              <q-card-section class="text-center q-pb-lg">
                <div class="q-mt-sm text-grey-8">
                  Already have an account?
                  <router-link
                    to="/login"
                    class="text-weight-bold cursor-pointer hover-underline"
                    style="color: #004aad; text-decoration: none"
                  >
                    Login
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
export default {
  name: "HospitalRegistrationPage",

  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      isPwd: true,
      isPwdConfirm: true,
      loading: false,
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(val) || "Invalid email address";
    },
    onSubmit() {
      this.loading = true;

      // Simulate API Call
      setTimeout(() => {
        this.loading = false;

        this.$q.notify({
          color: "green-7",
          textColor: "white",
          icon: "check_circle",
          message: "Registration Successful! Please check your email.",
        });

        // Redirect to Login after success
        // this.$router.push('/login');
      }, 2000);
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
