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
              <div class="text-weight-medium text-uppercase">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-isAdmitted="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value == 1"
                color="red-6"
                label="For Admission"
                outline
              />

              <q-badge
                v-else-if="props.value == 2"
                color="green-6"
                label="Admitted"
                outline
              />

              <q-badge v-else color="grey-6" label="Emergency Patient" outline />
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
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item
                      v-if="props.row.isAdmitted == 1"
                      clickable
                      @click="showAdmissionForm(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="edit" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Admission Form</q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item clickable @click="handlePrint(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Patient Information</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrintTriage(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Triage</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrintConsent(props.row)">
                      <q-item-section avatar>
                        <q-icon name="download" color="green-8" />
                      </q-item-section>
                      <q-item-section>Download Consent</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item clickable v-ripple @click="viewPatient(props.row)">
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="blue-10" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.firstName }} {{ props.row.lastName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.patient_id }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                      <q-menu cover auto-close>
                        <q-list style="min-width: 150px">
                          <q-item clickable @click="showAdmissionForm(props.row)">
                            <q-item-section avatar>
                              <q-icon name="edit" color="blue-10" />
                            </q-item-section>
                            <q-item-section>Admission Form</q-item-section>
                          </q-item>

                          <q-item clickable @click="handlePrintConsent(props.row)">
                            <q-item-section avatar>
                              <q-icon name="download" size="xs" />
                            </q-item-section>
                            <q-item-section>Download Consent</q-item-section>
                          </q-item>

                          <q-item clickable @click="handlePrint(props.row)">
                            <q-item-section avatar>
                              <q-icon name="print" size="xs" />
                            </q-item-section>
                            <q-item-section>Print Triage</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
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
    <registration-form ref="regForm" />
  </q-page>
</template>

<script>
import { date } from "quasar";
import axios from "axios";

import RegistrationForm from "pages/RegistrationForm.vue";

import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printEmergencyPatientInformation } from "src/composables/printEmergencyPatientInformation";
import { printPatientConsent } from "src/composables/printPatientConsent";

export default {
  components: {
    RegistrationForm,
  },
  name: "EmergencyList",

  setup() {
    const { generatePatientPdf } = printInpatientInformation();
    const { generateTriagePatientPdf } = printEmergencyPatientInformation();
    const { generatePatientConsentPdf } = printPatientConsent();

    return { generateTriagePatientPdf, generatePatientConsentPdf, generatePatientPdf };
  },

  data() {
    return {
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],
      showAdmissionDialog: false,
      selectedPatient: {},

      columns: [
        {
          name: "patient_id",
          label: "ID",
          field: "patient_id",
          align: "left",
          sortable: true,
          style: "width: 80px; font-weight: bold",
        },
        {
          name: "fullName",
          label: "Patient Name",
          field: "fullName",
          align: "center",
          sortable: true,
          style: "width: 250px",
        },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "birthdate",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 180px",
        },
        {
          name: "isAdmitted",
          label: "Status",
          field: "isAdmitted",
          align: "center",
          sortable: true,
          style: "width: 120px",
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
        const response = await axios.get(
          "http://10.107.0.2:3000/api/auth/fetchAdmitErpatient"
        );
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load Emergency List",
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

    async performSearch() {
      this.loading = true;
      try {
        const response = await axios.get(
          "http://10.107.0.2:3000/api/auth/searchErpatient",
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

    showAdmissionForm(row) {
      this.selectedPatient = row;
      this.$refs.regForm.openFormDialog(row);
    },

    async handlePrint(row) {
      this.loading = true;

      try {
        const response = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${row.patient_id}`
        );

        const fullPatientData = {
          ...response.data,
          patientId: row.patient_id,
        };

        await this.generatePatientPdf(fullPatientData);
      } catch (error) {
        console.error("Print Error:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to fetch full details for printing",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async handlePrintTriage(row) {
      this.loading = true;

      try {
        const response = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${row.patient_id}`
        );

        const fullPatientData = {
          ...response.data,
          patientId: row.patient_id,
        };

        await this.generateTriagePatientPdf(fullPatientData);
      } catch (error) {
        console.error("Print Error:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to fetch full details for printing",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    async handlePrintConsent(row) {
      this.loading = true;

      try {
        const response = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${row.patient_id}`
        );

        const fullPatientData = {
          ...response.data,
          patientId: row.patient_id,
        };

        await this.generatePatientConsentPdf(fullPatientData);
      } catch (error) {
        console.error("Print Error:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to fetch full details for printing",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },

    formatFullName(p) {
      if (!p) return "";
      const parts = [p.firstName, p.middleName, p.lastName].filter(Boolean);
      let fullName = parts.join(" ");

      if (p.suffix) {
        fullName += ` ${p.suffix}`;
      }
      return fullName;
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
