<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-blue-10" height-hint="64">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-weight-bold row items-center">
          <span class="text-blue-10" style="letter-spacing: -0.5px"> UERMMC </span>
          <q-separator vertical spaced class="gt-xs" />
          <div class="text-caption text-grey-7 gt-xs" style="line-height: 1.2">
            Patient Online Registration System
          </div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <div class="column items-end q-mr-sm">
            <div class="text-weight-bold text-blue-10" style="font-size: 0.85rem">
              {{ formattedTime }}
            </div>
            <div
              class="text-caption text-grey-7"
              style="font-size: 0.7rem; line-height: 1"
            >
              {{ formattedDate }}
            </div>
          </div>

          <q-icon name="schedule" color="blue-10" size="md" class="q-mr-sm" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="260"
      class="bg-white text-grey-9 shadow-1"
      :breakpoint="600"
    >
      <div
        class="column flex-center q-pa-md q-mt-md relative-position"
        style="height: 200px"
      >
        <q-avatar size="160px" class="q-mb-sm shadow-3">
          <img
            src="~assets/uermmc-white-logo.png"
            alt="UERM Logo"
            style="
              object-fit: contain;
              background: linear-gradient(145deg, #004aad 10%, #003078 100%);
              padding: 15px;
            "
          />
        </q-avatar>
      </div>

      <q-list padding class="text-grey-8">
        <q-item-label header class="text-uppercase text-caption text-weight-bold q-pt-sm">
          Main Menu
        </q-item-label>

        <q-item
          clickable
          v-ripple
          to="/finance/"
          exact
          active-class="active-link"
          class="q-mx-sm rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/finance/PatientList"
          active-class="active-link"
          class="q-mx-sm rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="emergency" />
          </q-item-section>
          <q-item-section>For Approval</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to=""
          active-class="active-link"
          class="q-mx-sm rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="bed" />
          </q-item-section>
          <q-item-section>Admission Logs</q-item-section>
        </q-item>

        <q-separator spaced class="q-mx-md" />

        <q-item
          clickable
          aria-label="Logout"
          v-ripple
          @click="logout"
          class="q-mx-sm rounded-borders text-red-9 hover-red"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Logout</q-item-section>
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
import { date } from "quasar";
export default defineComponent({
  name: "EmergencyLayout",

  data() {
    return {
      leftDrawerOpen: false,
      now: Date.now(),
      timer: null,
    };
  },
  computed: {
    formattedTime() {
      return date.formatDate(this.now, "h:mm:ss A");
    },
    formattedDate() {
      return date.formatDate(this.now, "ddd, MMM D, YYYY");
    },
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  mounted() {
    if (this.$q.screen.lt.sm) {
      this.leftDrawerOpen = false;
    }
    this.timer = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    logout() {
      this.$router.push("/login");
    },
  },
});
</script>

<style scoped lang="scss">
.bg-uerm-blue {
  background-color: #004aad;
}

.active-link {
  color: #004aad !important;
  background-color: #e3f2fd;
  border-left: 3px solid #004aad;
}

.q-item:hover:not(.active-link):not(.hover-red) {
  color: #004aad;
  background-color: #f5f5f5;
}

.opacity-80 {
  opacity: 0.8;
}

.q-header {
  border-bottom: 1px solid #e0e0e0;
}
</style>
