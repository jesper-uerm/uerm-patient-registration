<template>
  <q-layout view="lHh Lpr lFf" class="main-background">

    <!-- <q-header elevated class="bg-white text-primary">
      <q-toolbar class="q-py-sm"> <q-avatar square size="42px" class="q-mr-md">
          <img src="~assets/uermmc-white-logo.png">
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
    </q-header> -->

    <q-footer class="bg-transparent text-white text-center q-pb-md">
      <div class="text-caption">
        &copy; 2025 UERM Memorial Medical Center. All rights reserved.
      </div>
    </q-footer>

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
  min-height: 100vh;
  background-color:#004aad;
  background-image:
    linear-gradient(to bottom, rgba(0, 74, 173, 0.9), rgba(20, 74, 173, 0.7)),
    url('/bg-images/uermmmc_bg.jpg');
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}
</style>

