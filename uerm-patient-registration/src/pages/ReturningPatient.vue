<template>
  <q-dialog
    v-model="ReturningPatientFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1300px; max-width: 95vw; max-height: 95vh"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">RETURNING PATIENT FORM</div>
        <div class="text-caption text-white-7" style="line-height: 1.2">
          Please input a valid name to search patient information.
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

      <q-card-section class="q-pa-md bg-grey-1">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-8">
            <q-input
              outlined
              dense
              v-model="searchQuery"
              label="Patient Name or ID"
              placeholder="Type name and press Enter..."
              @keyup.enter="searchPatients"
              :disable="loading"
            >
              <template v-slot:append>
                <q-icon name="search" class="cursor-pointer" @click="searchPatients" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              color="orange-8"
              label="Search Database"
              icon="search"
              class="full-width"
              :loading="loading"
              @click="searchPatients"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="col q-pa-md">
        <q-table
          flat
          bordered
          wrap-cells
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          separator="cell"
          virtual-scroll
          table-header-class="bg-orange"
          class="sticky-header-table"
          style="height: 100%"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center" auto-width>
              <div class="row q-gutter-sm">
                <q-btn
                  dense
                  unelevated
                  padding="5px"
                  color="amber-14"
                  icon="edit"
                  size="sm"
                  no-wrap
                />
                <q-btn
                  dense
                  unelevated
                  padding="5px"
                  color="positive"
                  icon="print"
                  size="sm"
                  no-wrap
                />
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey q-pa-md">
              <q-icon size="2em" name="person_off" />
              <span class="q-ml-sm">
                {{ hasSearched ? "No patients found." : "Enter a name to search." }}
              </span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "ReturningPatientForm",
  data() {
    return {
      ReturningPatientFormDialog: false,
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
        },
        {
          name: "lastName",
          label: "Last Name",
          field: "lastName",
          align: "left",
          sortable: true,
        },
        {
          name: "firstName",
          label: "First Name",
          field: "firstName",
          align: "left",
          sortable: true,
        },
        { name: "birthdate", label: "Birthday", field: "birthdate", align: "left" },
        { name: "age", label: "Age", field: "age", align: "center" },
        { name: "gender", label: "Sex", field: "gender", align: "center" },
        {
          name: "addressPresent",
          label: "Address",
          field: "addressPresent",
          align: "left",
          classes: "ellipsis",
          style: "max-width: 200px",
        },
        {
          name: "actions",
          label: "Action",
          field: "actions",
          align: "center",
          style: "width: 100px",
        },
      ],
    };
  },
  methods: {
    show() {
      this.ReturningPatientFormDialog = true;
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
        const response = await axios.get("http://localhost:3000/api/auth/search", {
          params: { query: this.searchQuery },
        });

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          this.$q.notify({ type: "info", position: "top", message: "No records found." });
        }
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "Failed to connect to database.",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.sticky-header-table {
  max-height: 100%;
}

.sticky-header-table :deep(thead tr:first-child th) {
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
