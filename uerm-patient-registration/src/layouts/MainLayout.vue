<template>
  <q-layout view="lHh Lpr lFf" class="main-background">
    <q-header class="bg-uerm-blue text-white">
      <q-toolbar class="q-py-sm">
        <q-avatar
          square
          size="70px"
          class="q-mr-xs"
          @click="$router.push('/')"
          style="cursor: pointer"
        >
          <img src="~assets/uermmc-white-logo.png" alt="UERM Logo" />
        </q-avatar>

        <q-toolbar-title class="text-weight-bold header-title">
          UERM Admission Portal
          <div class="text-caption text-grey-4" style="line-height: 1.2">
            Patient Online Registration System
          </div>
        </q-toolbar-title>

        <q-btn
          to="/admin"
          class="bg-white text-blue-10 text-weight-bold q-py-sm q-mr-md header-btn"
          icon-right="login"
          label="Login As AIS"
        >
          <q-tooltip>Sign In</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent text-white text-center q-pb-md">
      <div class="text-caption">
        &copy; {{ currentYear }} UERM Memorial Medical Center. All rights reserved.
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.bg-uerm-blue {
  background-color: #0d47a1;
}

.main-background {
  min-height: 100vh;
  background-color: #004aad;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 74, 173, 0.9),
      rgba(20, 74, 173, 0.7)
    ),
    url("/bg-images/uermmmc_bg.jpg");
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}

@media (max-width: 900px) {
  .header-title {
    font-size: 17px;
  }
  .header-btn {
    padding: 7px;
    font-size: 11px;
  }
}
</style>
