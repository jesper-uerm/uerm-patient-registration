<template>
  <q-dialog
    v-model="ReturningOutpatientDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      style="
        width: 1500px;
        max-width: 95vw;
        display: flex;
        flex-direction: column;
        height: 70vh;
      "
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">RETURNING OUTPATIENT FORM</div>
        <div class="text-caption text-white-7" style="line-height: 1.2">
          Please enter valid name to search.
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="absolute-right q-ma-lg"
        />
      </q-card-section>

      <q-card-section class="bg-grey-1 q-pb-none">
        <div class="row q-col-gutter-md justify-center">
          <div class="col-12 col-md-8">
            <q-input
              outlined
              dense
              bg-color="white"
              v-model="searchQuery"
              label="Search Patient"
              placeholder="Enter Patient Name or ID"
              @keyup.enter="searchPatients"
              :disable="loading"
              clearable
              autofocus
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:after>
                <q-btn
                  color="primary"
                  label="Search"
                  class="q-px-lg"
                  unelevated
                  :loading="loading"
                  @click="searchPatients"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-mt-md" />
      <q-card-section class="col q-pa-none relative-position">
        <q-table
          flat
          bordered
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          separator="horizontal"
          virtual-scroll
          class="sticky-header-table q-ma-md"
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-presentAddress="props">
            <q-td :props="props" class="ellipsis" style="max-width: 250px">
              {{ props.row.addressPresent }}
              <q-tooltip>{{ props.row.addressPresent }}</q-tooltip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center" auto-width>
              <div class="row justify-center items-center" style="gap: 5px">
                <q-btn
                  flat
                  round
                  dense
                  color="amber-9"
                  icon="visibility"
                  size="md"
                  @click="viewPatient(props.row)"
                >
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  unelevated
                  color="green-7"
                  icon="print"
                  size="md"
                  @click="printPatient(props.row)"
                >
                  <q-tooltip>Print Record</q-tooltip>
                </q-btn>
              </div>
            </q-td>
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
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import axios from "axios";

export default {
  name: "ReturningInpatient",
  data() {
    return {
      ReturningOutpatientDialog: false,
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],

      columns: [
        {
          name: "patient_id",
          label: "Patient ID",
          field: "patient_id",
          align: "center",
          sortable: true,
          style: "font-weight: bold",
        },
        {
          name: "lastName",
          label: "Last Name",
          field: "lastName",
          align: "center",
          sortable: true,
        },
        {
          name: "firstName",
          label: "First Name",
          field: "firstName",
          align: "center",
          sortable: true,
        },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "birthdate",
          align: "center",
          format: (val) => date.formatDate(val, "MMMM D, YYYY"),
        },
        { name: "age", label: "Age", field: "age", align: "center" },
        { name: "gender", label: "Sex", field: "gender", align: "center" },
        {
          name: "presentAddress",
          label: "Address",
          field: "addressPresent",
          align: "left",
          classes: "ellipsis",
          style: "max-width: 250px",
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
  methods: {
    show() {
      this.ReturningOutpatientDialog = true;
      this.searchQuery = "";
      this.patientList = [];
      this.hasSearched = false;
    },

    async searchPatients() {
      if (!this.searchQuery || this.searchQuery.length < 2) {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Please enter at least 2 characters",
        });
        return;
      }

      this.loading = true;

      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/searchOutpatient",
          {
            params: { query: this.searchQuery },
          }
        );

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          this.$q.notify({
            type: "info",
            position: "top",
            message: "No records found.",
            icon: "search_off",
          });
        }
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "Database Connection Failed",
        });
      } finally {
        this.loading = false;
      }
    },

    viewPatient(row) {
      console.log("Viewing Patient:", row);
      this.$q.notify({ type: "primary", message: `Viewing details for ${row.lastName}` });
    },

    printPatient(row) {
      console.log("Printing Patient:", row);
      this.$q.notify({
        type: "positive",
        message: `Generating PDF for ${row.lastName}...`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.sticky-header-table {
  max-height: 100%;
}

.sticky-header-table :deep(thead tr:first-child th) {
  background-color: $blue-grey-14;
  color: #ffff;
  text-transform: uppercase;
  font-size: 10px;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 2px solid #ddd;
  height: 40px;
}

.sticky-header-table :deep(tbody tr:hover) {
  background-color: #ffff;
}
</style>
