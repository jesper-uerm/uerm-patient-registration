<template>
  <q-layout view="lHh Lpr lFf" class="main-background">

    <!-- <q-header elevated class="bg-white text-primary">
      <q-toolbar class="q-py-sm"> <q-avatar square size="42px" class="q-mr-md">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          UERM Admission Portal
          <div class="text-caption text-grey-7" style="line-height: 1.2;">
            Patient Registration System
          </div>
        </q-toolbar-title>

        <q-btn flat round icon="help_outline" color="grey-7">
          <q-tooltip>Need Help?</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer class="bg-transparent text-grey-7 text-center q-pa-md">
      <div class="text-caption">
        &copy; 2025 UERM Memorial Medical Center. All rights reserved.
      </div>
    </q-footer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  // No script logic needed for this simple layout
})
</script>
<style scoped>
.main-background {
  background-color:#f5f5f5;
  background-image:
    linear-gradient(to bottom, rgba(25, 118, 210, 0.8), rgba(255, 255, 255, 0.9)),
    url('/bg-images/uermmmc_bg.jpg');
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}
</style>

