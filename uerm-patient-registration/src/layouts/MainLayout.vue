<template>
  <q-layout view="lHh Lpr lFf" class="main-background">
    <q-header class="bg-uerm-blue text-white">
      <q-toolbar>
        <q-avatar
          square
          :class="$q.screen.lt.sm ? '' : 'q-mr-xs'"
          @click="$router.push('/')"
          style="cursor: pointer"
          :style="{
            fontSize: $q.screen.lt.sm ? '50px' : '80px',
          }"
        >
          <img src="~assets/uermmc-white-logo-header.png" alt="UERM Logo" />
        </q-avatar>

        <q-toolbar-title
          class="text-weight-bold header-title"
          :style="{
            fontSize: $q.screen.lt.sm ? '12px' : '',
          }"
        >
          UERM Admission Portal
          <div
            class="text-caption text-grey-4"
            style="line-height: 1.2"
            :style="{
              fontSize: $q.screen.lt.sm ? '10px' : '',
            }"
          >
            Patient Online Registration System
          </div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <div class="column items-end" :class="$q.screen.lt.sm ? '' : 'q-mr-sm'">
            <div
              class="text-weight-bold text-white-10"
              :style="{
                fontSize: $q.screen.lt.sm ? '9px' : '0.85rem',
              }"
            >
              {{ formattedTime }}
            </div>
            <div
              class="text-caption text-white-7"
              style="line-height: 1"
              :style="{
                fontSize: $q.screen.lt.sm ? '9px' : '0.7rem',
              }"
            >
              {{ formattedDate }}
            </div>
          </div>

          <q-icon
            name="schedule"
            color="white-10"
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
            :class="$q.screen.lt.sm ? '' : 'q-mr-sm'"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent text-white text-center q-pb-md">
      <div
        class="text-caption"
        :style="{
          fontSize: $q.screen.lt.sm ? '10px' : '',
        }"
      >
        &copy; {{ currentYear }} UERM Memorial Medical Center. All rights reserved.
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { date } from "quasar";

export default {
  name: "MainLayout",

  data() {
    return {
      now: Date.now(),
    };
  },

  mounted() {
    this.timer = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    formattedTime() {
      return date.formatDate(this.now, "h:mm:ss A");
    },
    formattedDate() {
      return date.formatDate(this.now, "ddd, MMM D, YYYY");
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
