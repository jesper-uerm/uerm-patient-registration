<template>
  <q-dialog
    v-model="showSearchDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1500px; max-width: 95vw; max-height: 87vh"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">RETURNING PATIENT</div>
        <div class="text-caption text-white-7 q-mt-xs" style="line-height: 1.2">
          Please enter valid name to search.
        </div>
        <q-btn icon="close" flat round v-close-popup class="absolute-right q-ma-lg" />
      </q-card-section>

      <q-card-section class="bg-grey-1 q-pa-md q-px-lg">
        <div class="row q-col-gutter-sm justify-center items-start">
          <div class="col-12 col-sm-3">
            <q-input
              outlined
              dense
              bg-color="white"
              v-model="searchQuery.firstName"
              :disable="loading"
              label-slot
              @keyup.enter="searchPatients"
              clearable
            >
              <template v-slot:label>
                First Name <span class="text-negative">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-3">
            <q-input
              outlined
              dense
              bg-color="white"
              v-model="searchQuery.lastName"
              label="Last Name"
              :disable="loading"
              label-slot
              @keyup.enter="searchPatients"
              clearable
            >
              <template v-slot:label>
                Last Name <span class="text-negative">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-3">
            <q-input
              outlined
              dense
              bg-color="white"
              v-model="searchQuery.birthdate"
              label="Birthdate"
              type="date"
              :disable="loading"
              label-slot
              @keyup.enter="searchPatients"
              clearable
            >
              <template v-slot:label>
                Birthdate <span class="text-negative">*</span>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-3 flex items-center">
            <q-btn
              label="Search"
              icon-right="search"
              color="yellow-10"
              class="full-width q-py-sm shadow-1 text-white"
              style="height: 40px"
              unelevated
              :loading="loading"
              @click="searchPatients"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="col q-pa-md q-px-lg relative-position">
        <q-table
          :dense="$q.screen.gt.xs"
          flat
          bordered
          :rows="patientList"
          :columns="columns"
          row-key="PATIENTNO"
          :loading="loading"
          separator="horizontal"
          virtual-scroll
          class="clean-table full-height"
          :rows-per-page-options="[0]"
          @row-click="(evt, row) => viewPatient(row)"
        >
          <template v-slot:body-cell-PATIENTNO="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-presentAddress="props">
            <q-td :props="props" style="max-width: 150px">
              <div class="ellipsis text-grey-7">
                {{ props.row.ADDRESS }}
                <q-tooltip>{{ props.row.ADDRESS }}</q-tooltip>
              </div>
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
                    <q-item-label caption>ID: {{ props.row.PATIENTNO }}</q-item-label>
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
                No patients found matching your search.
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

  props: {
    module: {
      type: [String, Array],
      default: () => [],
    },
  },

  data() {
    return {
      showSearchDialog: false,
      searchQuery: {
        firstName: "",
        lastName: "",
        birthdate: "",
      },
      patientList: [],
      loading: false,
      hasSearched: false,

      columns: [
        {
          name: "PATIENTNO",
          label: "Patient #",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
          style: "font-weight: 600; padding: 10px 16px;",
          headerStyle: "padding: 12px 16px;",
        },
        {
          name: "fullName",
          label: "Patient Name",
          field: "FULLNAME",
          align: "center",
          sortable: true,
          style: "padding: 10px 16px;",
          headerStyle: "padding: 12px 16px;",
        },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "DBIRTH",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : ""),
          style: "padding: 10px 16px;",
          headerStyle: "padding: 12px 16px;",
        },
        {
          name: "age",
          label: "Age",
          field: "AGE",
          align: "center",
          style: "padding: 10px 12px;",
          headerStyle: "padding: 12px;",
        },
        {
          name: "gender",
          label: "Gender",
          field: "SEX",
          align: "center",
          style: "padding: 10px 12px;",
          headerStyle: "padding: 12px;",
        },
      ],
    };
  },

  methods: {
    show() {
      this.showSearchDialog = true;
    },

    async searchPatients() {
      const hasInput = Object.values(this.searchQuery).some(
        (val) => val && val.trim() !== ""
      );

      if (!hasInput) {
        this.$q.notify({
          type: "warning",
          message: "Please enter at least one search criteria.",
          position: "top",
        });
        return;
      }

      this.loading = true;
      this.hasSearched = true;

      try {
        const params = {};
        if (this.searchQuery.firstName)
          params.firstName = this.searchQuery.firstName.trim();
        if (this.searchQuery.lastName) params.lastName = this.searchQuery.lastName.trim();
        if (this.searchQuery.birthdate) params.birthdate = this.searchQuery.birthdate;

        const response = await axios.get(
          `http://10.107.0.2:3000/api/patients/returning`,
          {
            params,
          }
        );

        this.patientList = response.data || [];
      } catch (error) {
        console.error("Failed to search patients:", error);
        this.$q.notify({
          type: "negative",
          message:
            error.response?.data?.message ||
            "Failed to fetch patients. Please check your connection.",
          position: "top",
        });
        this.patientList = [];
      } finally {
        this.loading = false;
      }
    },

    viewPatient(patient) {
      console.log("Selected Patient:", patient);

      this.showSearchDialog = false;

      if (this.module === "ER") {
        this.$emit("open-triage", patient);
        return;
      }

      this.$q
        .dialog({
          // title: '<div class="text-center">Select Registration Type</div>',
          message: '<div class="text-center">Choose patient type to continue.</div>',
          html: true,

          options: {
            type: "radio",
            model: "INPATIENT",
            // inline: true,
            class: "justify-center",

            items: [
              {
                label: "Inpatient",
                value: "INPATIENT",
              },
              {
                label: "Outpatient",
                value: "OUTPATIENT",
              },
              {
                label: "Emergency/Triage",
                value: "ER",
              },
            ],
          },

          cancel: true,
          persistent: true,
        })
        .onOk((selected) => {
          if (selected === "INPATIENT") {
            this.$emit("open-inpatient", patient);
          }

          if (selected === "OUTPATIENT") {
            this.$emit("open-outpatient", patient);
          }

          if (selected === "ER") {
            this.$emit("open-triage", patient);
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
.clean-table {
  max-height: calc(87vh - 220px);
}
.clean-table :deep(.q-table__top),
.clean-table :deep(.q-table__bottom),
.clean-table :deep(thead tr:first-child th) {
  border-bottom: 1px solid #f0f0f0;
}

.clean-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  color: #ffff;
  background-color: #004aad;
}

.clean-table :deep(tbody tr:hover) {
  background: #fafafa !important;
}

.clean-table :deep(td),
.clean-table :deep(th) {
  border-bottom: 1px solid #f5f5f5;
}
</style>
