<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card
      class="column no-shadow"
      style="border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <q-card-section class="col-auto q-py-md q-px-lg border-bottom">
        <div class="row items-center justify-between">
          <div>
            <div
              class="text-h6 text-blue-10 text-weight-bold"
              style="letter-spacing: -0.5px"
            >
              Inpatient Search
            </div>
            <div class="text-caption text-grey-6">
              Search database for admitted patient records
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

      <q-card-section class="col q-pa-none">
        <q-table
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          flat
          :dense="$q.screen.lt.xl"
          :grid="$q.screen.lt.sm"
          virtual-scroll
          :rows-per-page-options="[13]"
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
              <div class="text-weight-medium text-blue-10">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-presentAddress="props">
            <q-td :props="props" style="max-width: 250px">
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
                size="sm"
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
                size="sm"
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
  </q-page>
</template>

<script>
import { date } from "quasar";
import axios from "axios";
import _ from "lodash";

export default {
  name: "InpatientList",
  data() {
    return {
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],

      columns: [
        {
          name: "patient_id",
          label: "ID",
          field: "patient_id",
          align: "left",
          sortable: true,
          style: "width: 100px",
        },
        {
          name: "fullName",
          label: "Patient Name",
          field: "fullName",
          align: "left",
          sortable: true,
        },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "birthdate",
          align: "right",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 140px",
        },
        {
          name: "gender",
          label: "Sex",
          field: "gender",
          align: "center",
          style: "width: 200px",
        },
        {
          name: "presentAddress",
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
        const response = await axios.get("http://localhost:3000/api/auth/fetchInpatient");
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
      if (!this.searchQuery || this.searchQuery.length < 2) {
        if (this.searchQuery === "") {
          this.loadInitialData();
          this.hasSearched = false;
          return;
        }
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
          "http://localhost:3000/api/auth/searchInpatient",
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
      this.$q.notify({
        type: "primary",
        message: `Viewing details for ${row.lastName}`,
      });
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
</style>
