<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card
      class="column no-shadow"
      style="border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <q-card-section class="col-auto q-py-md q-px-lg" style="background-color: #004aad">
        <div class="row items-left text-left justify-left text-uppercase">
          <div>
            <div
              class="text-h6 text-white text-weight-bold"
              style="letter-spacing: -0.5px"
            >
              Emergency List Search
            </div>
            <div class="text-caption text-grey-5">
              Search database for emergency patient records
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="col-auto q-py-md q-px-lg bg-grey-1">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Enter Name or ID"
          @keyup.enter="handleSearch"
          :disable="loading"
          class="bg-white"
          @update:model-value="debouncedSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-grey-5" />
          </template>
          <template v-slot:after>
            <q-btn
              unelevated
              color="blue-10"
              label="Search"
              class="q-px-lg"
              @click="handleSearch"
              :loading="loading"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="col q-pa-none q-mx-lg q-mb-md">
        <q-table
          bordered
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          flat
          :dense="$q.screen.lt.xl"
          :grid="$q.screen.lt.sm"
          virtual-scroll
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-patient_id="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 150px">
              <div class="ellipsis text-grey-7">
                {{ props.row.addressPresent }}
                <q-tooltip>{{ props.row.addressPresent }}</q-tooltip>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                color="grey-7"
                icon="visibility"
                size="md"
                class="q-mr-sm hover-blue"
                @click="viewPatient(props.row)"
              >
                <q-tooltip class="bg-blue-10">View Profile</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="grey-7"
                icon="print"
                size="md"
                class="hover-green"
                @click="printPatient(props.row)"
              >
                <q-tooltip class="bg-green-8">Print Record</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.lastName }}, {{ props.row.firstName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.patient_id }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn size="sm" flat round color="grey" icon="more_vert" />
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="blue-10" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width column flex-center text-grey-5 q-pa-xl">
              <q-icon size="4em" name="person_search" class="q-mb-md" />
              <div class="text-subtitle1" v-if="!hasSearched">
                Ready to Search Inpatients
              </div>
              <div class="text-subtitle1" v-else>
                No patients found matching "{{ searchQuery }}"
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="viewDialog" transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md">
          <div class="row items-center text-center justify-center justify-between">
            <div class="row items-center text-uppercase">
              <div class="text-subtitle2 text-weight-bold header-title">
                Patient Profile
              </div>
            </div>

            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              class="text-white opacity-70"
              aria-label="Close"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll" style="max-height: 60vh">
          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="person" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-body2 text-weight-medium">
                  {{ selectedPatient.lastName }}, {{ selectedPatient.firstName }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon
                  :name="selectedPatient.gender === 'Male' ? 'male' : 'female'"
                  color="grey-6"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Gender</q-item-label>
                <q-item-label class="text-body2">
                  {{ selectedPatient.gender }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate</q-item-label>
                <q-item-label class="text-body2">
                  {{ formatDate(selectedPatient.birthdate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Contact Information
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="place" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Present Address</q-item-label>
                <q-item-label class="text-body2">
                  {{ selectedPatient.addressPresent || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="phone" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Mobile Number</q-item-label>
                <q-item-label class="text-body2">
                  {{ selectedPatient.mobile || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Admission Details
          </div>
          <div class="bg-grey-1 q-pa-md rounded-borders text-grey-8">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <span class="text-weight-bold block q-mb-xs">Status:</span>
                <q-badge
                  :color="selectedPatient.patientType === 'Outpatient' ? 'green' : 'red'"
                >
                  {{ selectedPatient.patientType || "N/A" }}
                </q-badge>
              </div>
              <div class="col-12 col-sm-4">
                <span class="text-weight-bold block q-mb-xs">Date Admitted:</span>
                {{ formatDate(selectedPatient.createdAt) || "N/A" }}
              </div>
              <div class="col-12 col-sm-4">
                <span class="text-weight-bold block q-mb-xs">Attending Physician:</span>
                <div class="ellipsis">
                  Dr. {{ selectedPatient.physician || "N/A" }}
                  <q-tooltip>{{ selectedPatient.physician }}</q-tooltip>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Close" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Print Record"
            icon="print"
            color="blue-10"
            @click="printPatient(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from "quasar";
import axios from "axios";
import _ from "lodash";

export default {
  name: "EmergencyList",
  data() {
    return {
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],
      viewDialog: false,
      selectedPatient: {},

      columns: [
        {
          name: "patient_id",
          label: "ID",
          field: "patient_id",
          align: "left",
          sortable: true,
          style: "width: 80px",
        },
        {
          name: "fullName",
          label: "Patient Name",
          field: "fullName",
          align: "center",
          sortable: true,
        },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "birthdate",
          align: "right",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 180px",
        },
        {
          name: "gender",
          label: "Sex",
          field: "gender",
          align: "center",
          style: "width: 200px",
        },
        {
          name: "addressPresent",
          label: "Address",
          field: "addressPresent",
          align: "left",
          classes: "ellipsis",
          style: "max-width: 250px; min-width: 150px",
        },
        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
          style: "width: 150px",
        },
      ],
    };
  },

  mounted() {
    this.loadInitialData();
  },

  methods: {
    async loadInitialData() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3000/api/auth/fetchErpatient");
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load Inpatients",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      if (this.searchQuery === "") {
        this.loadInitialData();
        this.hasSearched = false;
        return;
      }

      if (this.searchQuery.length < 2) {
        this.$q.notify({
          type: "warning",
          message: "Please enter at least 2 characters",
          position: "top",
        });
        return;
      }

      this.performSearch();
    },

    debouncedSearch: _.debounce(function () {
      if (this.searchQuery && this.searchQuery.length >= 2) {
        this.performSearch();
      }
    }, 400),

    async performSearch() {
      this.loading = true;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/searchErpatient",
          {
            params: { query: this.searchQuery },
          }
        );

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          this.$q.notify({
            type: "info",
            message: "No records found.",
            icon: "info",
            position: "top",
          });
        }
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: "Search Failed",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewDialog = true;
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },
    printPatient(row) {
      this.$q.notify({
        type: "positive",
        message: `Generating PDF for ${row.lastName}...`,
      });
    },
  },
};
</script>

<style scoped>
.clean-table :deep(.q-table__top),
.clean-table :deep(.q-table__bottom),
.clean-table :deep(thead tr:first-child th) {
  border-bottom: 1px solid #f0f0f0;
}

.clean-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  background-color: #f8f9fa;
}

.clean-table :deep(tbody tr:hover) {
  background: #fafafa !important;
}

.clean-table :deep(td),
.clean-table :deep(th) {
  border-bottom: 1px solid #f5f5f5;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.hover-blue:hover {
  color: #1976d2 !important;
  background-color: #e3f2fd;
}

.hover-green:hover {
  color: #388e3c !important;
  background-color: #e8f5e9;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #004aad 0%, #002a66 100%);
}

.info-box {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.rounded-borders {
  border-radius: 12px;
}
.header-title {
  letter-spacing: 0.7px;
}
</style>
