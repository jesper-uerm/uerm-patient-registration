<template>
  <q-layout view="lHh Lpr lFf" class="main-background">
    <q-header elevated class="bg-uerm-blue text-white">
      <q-toolbar class="q-py-md">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-weight-bold">
          UERM Admission Portal
          <div class="text-caption text-grey-4" style="line-height: 1.2">
            Patient Registration System
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="text-white"
      style="background-color: #004aad"
    >
      <div class="column flex-center q-py-md q-mb-md">
        <q-avatar square size="180px" class="cursor-pointer">
          <img src="~assets/uermmc-white-logo.png" alt="UERM Logo" />
        </q-avatar>
        <div class="text-h7 text-uppercase opacity-fade">Hi / Welcome, User!</div>
      </div>

      <q-list padding>
        <q-item clickable v-ripple to="/admin/" active-class="">
          <q-item-section avatar>
            <q-icon name="dashboard" color="white" />
          </q-item-section>
          <q-item-section> Home </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/InpatientList" active-class="bg-blue-9">
          <q-item-section avatar>
            <q-icon name="people" color="white" />
          </q-item-section>
          <q-item-section> Inpatient </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/OutpatientList" active-class="bg-blue-9">
          <q-item-section avatar>
            <q-icon name="people" color="white" />
          </q-item-section>
          <q-item-section> Outpatient </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/" active-class="bg-blue-9">
          <q-item-section avatar>
            <q-icon name="logout" color="white" />
          </q-item-section>
          <q-item-section> Logout </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminLayout",

  data() {
    return {
      leftDrawerOpen: false,
    };
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
});
</script>

<style scoped>
.bg-uerm-blue {
  background-color: #004aad;
}

.main-background {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
