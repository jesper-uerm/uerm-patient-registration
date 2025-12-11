<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card
      class="column shadow-1"
      style="border-radius: 12px; border: 1px solid #e0e0e0"
    >
      <q-card-section class="col-auto q-py-md q-px-lg">
        <div class="row items-center text-center justify-center text-uppercase">
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

      <q-card-section class="col-auto q-pt-none q-pb-md q-px-lg">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Enter Name or ID"
          @keyup.enter="handleSearch"
          :disable="loading"
          class="search-input"
          bg-color="white"
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
              @keyup.enter="handleSearch"
              @input="debouncedSearch"
              :loading="loading"
              style="border-top-left-radius: 0; border-bottom-left-radius: 0"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="col q-pa-none overflow-hidden q-mx-lg q-mb-lg">
        <q-table
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          flat
          bordered
          separator="horizontal"
          :dense="$q.screen.lt.xl"
          :grid="$q.screen.lt.sm"
          virtual-scroll
          :rows-per-page-options="[13]"
          class="clean-table fit"
        >
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
                <q-separator />
                <q-card-section class="q-pt-sm">
                  <div class="row items-center justify-between">
                    <span class="text-caption text-grey">Address</span>
                    <span
                      class="text-caption text-right ellipsis"
                      style="max-width: 150px"
                    >
                      {{ props.row.addressPresent }}
                    </span>
                  </div>
                  <div class="row items-center justify-between q-mt-sm">
                    <q-btn
                      color="blue-10"
                      outline
                      label="View"
                      size="sm"
                      class="full-width"
                      @click="viewPatient(props.row)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>

          <template v-slot:body-cell-presentAddress="props">
            <q-td :props="props" class="ellipsis" style="max-width: 250px">
              {{ props.row.addressPresent }}
              <q-tooltip>{{ props.row.addressPresent }}</q-tooltip>
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
          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner-gears size="80px" color="blue-10" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width column flex-center text-grey q-pa-xl">
              <q-icon size="4em" name="person_search" class="q-mb-md" />
              <div class="text-h6" v-if="!hasSearched">Ready to Search</div>
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
          label: "ID NO.",
          field: "patient_id",
          align: "left",
          sortable: true,
          style: "width: 100px",
        },
        {
          name: "fullName",
          label: "FULL NAME",
          field: "fullName",
          align: "left",
          sortable: true,
          classes: "col-2",
        },
        // {
        //   name: "firstName",
        //   label: "FIRST NAME",
        //   field: "firstName",
        //   align: "left",
        //   sortable: true,
        //   style: "width: 100px",
        // },
        // {
        //   name: "lastName",
        //   label: "LAST NAME",
        //   field: "lastName",
        //   align: "left",
        //   sortable: true,
        //   style: "width: 100px",
        // },
        {
          name: "birthdate",
          label: "BIRTHDATE",
          field: "birthdate",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
        },
        { name: "gender", label: "SEX", field: "gender", align: "center" },
        {
          name: "presentAddress",
          label: "ADDRESS",
          field: "addressPresent",
          align: "left",
          classes: "ellipsis text-grey-7",
        },
        { name: "actions", label: "ACTION", field: "actions", align: "center" },
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
          message: "Failed to load inpatients",
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
        this.$q.notify({ type: "negative", message: "Search Failed", position: "top" });
      } finally {
        this.loading = false;
      }
    },

    viewPatient(row) {
      this.$q.notify({ type: "primary", message: `Viewing details for ${row.lastName}` });
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

<style scoped lang="scss">
.search-input :deep(.q-field__control) {
  border-radius: 8px 0 0 8px;
}

.clean-table :deep(thead tr:first-child th) {
  background-color: $blue-grey-8;
  color: white;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 15px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 1;
}

.clean-table :deep(tbody tr:hover) {
  background-color: #f0f7ff;
  transition: background-color 0.2s;
}

.hover-blue:hover {
  color: #1976d2 !important;
  background-color: #e3f2fd;
}
.hover-green:hover {
  color: #388e3c !important;
  background-color: #e8f5e9;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
