<template>
  <q-dialog
    v-model="ReturningInpatientDialog"
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
        <div class="text-h6 text-bold">RETURNING INPATIENT FORM</div>
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
          :dense="$q.screen.gt.xs"
          flat
          bordered
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          separator="horizontal"
          virtual-scroll
          class="clean-table q-ma-md"
          :rows-per-page-options="[0]"
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
                <q-item clickable v-ripple @click="viewPatient(props.row)">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.lastName }}, {{ props.row.firstName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.patient_id }}</q-item-label>
                  </q-item-section>
                  <q-item-section side> </q-item-section>
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
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import axios from "axios";

export default {
  name: "ReturningInpatient",
  data() {
    return {
      ReturningInpatientDialog: false,
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
          align: "center",
          format: (val) => date.formatDate(val, "MMM D, YYYY"),
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
      this.ReturningInpatientDialog = true;
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
// .sticky-header-table {
//   max-height: 100%;
// }

// .sticky-header-table :deep(thead tr:first-child th) {
//   background-color: $blue-grey-14;
//   color: #ffff;
//   font-weight: bold;
//   text-transform: uppercase;
//   font-size: 10px;
//   position: sticky;
//   top: 0;
//   z-index: 1;
//   border-bottom: 2px solid #ddd;
//   height: 40px;
// }

// .sticky-header-table :deep(tbody tr:hover) {
//   background-color: #ffff;
// }

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
</style>
