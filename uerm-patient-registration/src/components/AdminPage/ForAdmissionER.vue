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

                    <q-item clickable @click="handlePrintTriage(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Triage</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrintTreatment(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Treatment Sheet</q-item-section>
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

                          <q-item clickable @click="handlePrintTriage(props.row)">
                            <q-item-section avatar>
                              <q-icon name="print" color="green-8" />
                            </q-item-section>
                            <q-item-section>Print Triage</q-item-section>
                          </q-item>

                          <q-item clickable @click="handlePrintTreatment(props.row)">
                            <q-item-section avatar>
                              <q-icon name="print" color="green-8" />
                            </q-item-section>
                            <q-item-section>Treatment Sheet</q-item-section>
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
import { defineComponent } from "vue";
import { date } from "quasar";
import { mapState, mapWritableState, mapActions } from "pinia";
import { useTriageStore } from "src/stores/triageStore";

import RegistrationForm from "pages/RegistrationForm.vue";
import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printEmergencyPatientInformation } from "src/composables/printEmergencyPatientInformation";
import { printPatientConsent } from "src/composables/printPatientConsent";
import { printEmergencyTreatment } from "src/composables/printEmergencyTreatment";

export default defineComponent({
  name: "ForAdmissionER",
  components: { RegistrationForm },

  setup() {
    const { generatePatientPdf } = printInpatientInformation();
    const { generateTriagePatientPdf } = printEmergencyPatientInformation();
    const { generatePatientConsentPdf } = printPatientConsent();
    const { generateEmergencyTreatmentPdf } = printEmergencyTreatment();

    return {
      generateTriagePatientPdf,
      generatePatientConsentPdf,
      generatePatientPdf,
      generateEmergencyTreatmentPdf,
    };
  },

  data() {
    return {
      columns: [
        {
          name: "patient_no",
          label: "PATIENTNO",
          field: "patient_no",
          align: "center",
          sortable: true,
          style: "width: 80px; font-weight: bold",
          format: (val) => (val ? val : "N/A"),
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

  computed: {
    ...mapState(useTriageStore, ["patientList", "loading", "hasSearched"]),

    ...mapWritableState(useTriageStore, [
      "searchQuery",
      "selectedPatient",
      "viewPatientValidationDialog",
      "showAdmissionDialog",
    ]),
  },

  mounted() {
    this.fetchAdmitPatients();
  },

  methods: {
    ...mapActions(useTriageStore, [
      "fetchAdmitPatients",
      "searchPatients",
      "getPatientFullDetails",
      "setSelectedPatient",
    ]),

    handleSearch() {
      if (!this.searchQuery) {
        this.fetchAdmitPatients();
        return;
      }
      if (this.searchQuery.length < 2) return;

      this.searchPatients(this.searchQuery);
    },

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewPatientValidationDialog = true;
    },

    showAdmissionForm(row) {
      this.selectedPatient = row;
      this.$refs.regForm.openFormDialog(row);
    },

    async handlePrint(row) {
      try {
        const fullData = await this.getPatientFullDetails(row.patient_id);
        await this.generatePatientPdf(fullData);
      } catch (error) {
        console.error("Print component error", error);
      }
    },

    async handlePrintTriage(row) {
      try {
        const fullData = await this.getPatientFullDetails(row.patient_id);
        await this.generateTriagePatientPdf(fullData);
      } catch (error) {
        console.error(error);
      }
    },

    async handlePrintConsent(row) {
      try {
        const fullData = await this.getPatientFullDetails(row.patient_id);
        await this.generatePatientConsentPdf(fullData);
      } catch (error) {
        console.error(error);
      }
    },

    async handlePrintTreatment(row) {
      const data = await this.getPatientFullDetails(row.patient_id);
      if (data) await this.generateEmergencyTreatmentPdf(data);
    },

    formatFullName(p) {
      if (!p) return "";
      const parts = [p.firstName, p.middleName, p.lastName].filter(Boolean);
      return parts.join(" ") + (p.suffix ? ` ${p.suffix}` : "");
    },
  },
});
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
