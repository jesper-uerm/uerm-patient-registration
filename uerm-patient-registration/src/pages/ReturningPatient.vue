<template>
  <q-dialog
    v-model="ReturningPatientFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      style="width: 1500px; max-width: 95vw; display: flex; flex-direction: column"
      :style="{ height: $q.screen.lt.md ? '55vh' : '80vh' }"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">RETURNING PATIENT</div>
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
          row-key="PATIENTNO"
          :loading="loading"
          separator="horizontal"
          virtual-scroll
          class="clean-table q-ma-md"
          :rows-per-page-options="[0]"
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
              <q-item-section side>
                <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                  <q-menu cover auto-close>
                    <q-list style="min-width: 150px">
                      <q-item clickable @click="updateTriage(props.row)">
                        <q-item-section avatar>
                          <q-icon name="edit" size="xs" />
                        </q-item-section>
                        <q-item-section>Update Triage Form</q-item-section>
                      </q-item>

                      <q-item clickable @click="handlePrintConsent(props.row)">
                        <q-item-section avatar>
                          <q-icon name="download" size="xs" />
                        </q-item-section>
                        <q-item-section>Download Consent</q-item-section>
                      </q-item>

                      <q-item clickable @click="handlePrintTriage(props.row)">
                        <q-item-section avatar>
                          <q-icon name="print" size="xs" />
                        </q-item-section>
                        <q-item-section>Print Triage Form</q-item-section>
                      </q-item>

                      <q-item clickable @click="handlePrint(props.row)">
                        <q-item-section avatar>
                          <q-icon name="print" size="xs" />
                        </q-item-section>
                        <q-item-section>Print Information</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
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
                No patients found matching "{{ searchQuery }}"
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="triageDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        style="width: 1500px; max-width: 95vw; display: flex; flex-direction: column"
        :style="{ height: $q.screen.lt.md ? '55vh' : '80vh' }"
      >
        <q-card-section
          class="column text-center text-white q-py-md relative-position"
          style="background-color: #004aad"
        >
          <div class="text-h6 text-bold">UPDATE TRIAGE FORM</div>
          <div class="text-caption text-white-7" style="line-height: 1.2">
            Please input valid information.
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

        <q-card-section class="scroll" style="max-height: 65vh">
          <q-form ref="personalInfoTriage" @submit="updateTriageRecord" class="q-pa-sm">
            <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>

            <input type="hidden" v-model="localForm.patientId" />

            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="localForm.lastNameTriage"
                  label="Last Name *"
                  :rules="[(val) => !!val || 'Required']"
                  readonly
                />
              </div>
              <div class="col-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="localForm.firstNameTriage"
                  label="First Name *"
                  :rules="[(val) => !!val || 'Required']"
                  readonly
                />
              </div>
              <div class="col-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="localForm.middleNameTriage"
                  label="Middle Name"
                  readonly
                />
              </div>
              <div class="col-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="localForm.suffixTriage"
                  :options="['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI']"
                  label="Suffix"
                  lazy-rules
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.birthdateTriage"
                  label="Birthdate *"
                  mask="date"
                  :rules="[
                    'date',
                    (val) => new Date(val) <= new Date() || 'Future date invalid',
                  ]"
                  readonly
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="localForm.birthdateTriage">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model="localForm.ageTriage"
                  label="Age"
                  readonly
                  bg-color="grey-2"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="localForm.genderTriage"
                  :options="['Male', 'Female', 'Prefer not to say']"
                  label="Gender"
                  lazy-rules
                  :rules="[(val) => !!val || 'Please select gender']"
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12">
                <q-input
                  outlined
                  dense
                  v-model="localForm.chiefComplaintTriage"
                  label="Chief Complaint"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />
            <div class="text-subtitle1 text-bold q-mb-md">Vital Signs:</div>
            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.tempTriage"
                  label="Temperature *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(c)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.heartRateTriage"
                  label="Heart Rate *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(bpm)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.oxygenTriage"
                  label="Oxygen Saturation *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(%)"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.bpTriage"
                  label="Blood Pressure *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(mmHg)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.respiRateTriage"
                  label="Respiratory Rate *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(cpm)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="localForm.painScoreTriage"
                  label="Pain Score *"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6">
                <q-select
                  outlined
                  dense
                  v-model="localForm.avpuTriage"
                  :options="[
                    'Alert',
                    'Verbally Responsive',
                    'Painfully Responsive',
                    'Unresponsive',
                  ]"
                  label="AVPU Scale"
                  lazy-rules
                  :rules="[(val) => !!val || 'Please select AVPU Scale']"
                />
              </div>
              <div class="col-6 col-md-6">
                <q-select
                  outlined
                  dense
                  v-model="localForm.contagiousTriage"
                  :options="[
                    'Symptom/s suggestive of COVID-19',
                    'Symptom/s suggestive of a VIRAL EXANTHEM',
                    'None',
                  ]"
                  label="Screening for Contagious Infectious Disease"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Please select screening for contagious disease.',
                  ]"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="localForm.isolationPrecautionTriage"
                  :options="['COVID Complex (Old ER)', 'COVID Complex Extension (OPD)']"
                  label="Transfer Immediately to:"
                  lazy-rules
                  :rules="[(val) => !!val || 'Please select precaution.']"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="localForm.cpdTriage"
                  :options="['Yes', 'No']"
                  label="Cardio-Pulmonary Distress"
                  lazy-rules
                  :rules="[(val) => !!val || 'Required.']"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="localForm.levelTriage"
                  :options="['1 - (Emergent)', '2 - (Urgent)', '3 - (Non-Urgent)']"
                  label="Triage Level"
                  lazy-rules
                  :rules="[(val) => !!val || 'Please select triage level.']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6">
                <q-select
                  outlined
                  dense
                  v-model="localForm.checkforPresense"
                  multiple
                  :options="[
                    'Fever',
                    'Cough',
                    'Sore Throat',
                    'Headache',
                    'Diarrhea',
                    'Shortness of Breath',
                    'Joint pains',
                    'Muscle pains',
                    'Decreased sense of taste/smell',
                    'Rash',
                  ]"
                  label="Check for Presence of symptoms"
                />
              </div>
              <div class="col-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="localForm.remarksTriage"
                  label="Remarks"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="localForm.personnelTriage"
                  label="Name of Triage Personnel *"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
              <div class="col-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="localForm.dateTriage"
                  label="Date Accomplished *"
                  mask="date"
                  :rules="[
                    'date',
                    (val) =>
                      new Date(val) <= new Date() || 'Date cannot be in the future',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="localForm.dateTriage">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="text-primary q-py-md">
          <q-btn flat label="Cancel" v-close-popup />

          <q-btn
            color="blue-10"
            icon-right="update"
            style="width: 100%; height: 45px; max-width: 200px"
            label="Update Record"
            :loading="loading"
            @click="updateTriageRecord"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import axios from "axios";

import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printPatientInfo } from "src/composables/printPatientInfo";
import { printPatientConsent } from "src/composables/printPatientConsent";
import { printEmergencyPatientInformation } from "src/composables/printEmergencyPatientInformation";

export default {
  name: "ReturningInpatient",

  setup() {
    const { generatePatientPdf } = printInpatientInformation();
    const { generatePatientInfoPdf } = printPatientInfo();
    const { generatePatientConsentPdf } = printPatientConsent();
    const { generateTriagePatientPdf } = printEmergencyPatientInformation();

    return {
      generatePatientPdf,
      generatePatientInfoPdf,
      generatePatientConsentPdf,
      generateTriagePatientPdf,
    };
  },

  data() {
    return {
      ReturningPatientFormDialog: false,
      triageDialog: false,
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],

      columns: [
        {
          name: "patient_id",
          label: "Patient #",
          field: "PATIENTNO",
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
        { name: "age", label: "Age", field: "AGE", align: "center" },
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

      localForm: {
        patientId: null,
        patientNo: null,
        lastNameTriage: "",
        firstNameTriage: "",
        middleNameTriage: "",
        suffixTriage: "",
        birthdateTriage: "",
        ageTriage: "",
        genderTriage: "",
        chiefComplaintTriage: "",
        tempTriage: "",
        heartRateTriage: "",
        oxygenTriage: "",
        bpTriage: "",
        respiRateTriage: "",
        painScoreTriage: "",
        avpuTriage: "",
        contagiousTriage: "",
        isolationPrecautionTriage: "",
        cpdTriage: "",
        levelTriage: "",
        checkforPresense: [],
        remarksTriage: "",
        personnelTriage: "",
        dateTriage: "",
      },
    };
  },

  methods: {
    show() {
      this.ReturningPatientFormDialog = true;
      this.searchQuery = "";
      this.patientList = [];
      this.hasSearched = false;
    },

    updateTriage(row) {
      this.triageDialog = true;

      this.localForm.patientId = row.PATIENTNO;
      this.localForm.lastNameTriage = row.LASTNAME;
      this.localForm.firstNameTriage = row.FIRSTNAME;
      this.localForm.middleNameTriage = row.MIDDLENAME || "";
      this.localForm.suffixTriage = row.SUFFIX || "";

      this.localForm.ageTriage = row.AGE;
      this.localForm.genderTriage = row.gender;

      if (row.birthdate) {
        this.localForm.birthdateTriage = date.formatDate(row.birthdate, "YYYY/MM/DD");
      }

      this.localForm.tempTriage = "";
      this.localForm.bpTriage = "";
      this.localForm.heartRateTriage = "";
      this.localForm.oxygenTriage = "";
      this.localForm.respiRateTriage = "";
      this.localForm.painScoreTriage = "";
      this.localForm.remarksTriage = "";
      this.localForm.checkforPresense = [];
      this.localForm.dateTriage = date.formatDate(new Date(), "YYYY/MM/DD");
    },

    async updateTriageRecord() {
      const valid = await this.$refs.personalInfoTriage.validate();

      if (!valid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill out missing fields before updating.",
          position: "top",
        });
        return;
      }

      if (!this.localForm.patientId) {
        this.$q.notify({
          type: "negative",
          message: "Error: No Patient ID found. Cannot update.",
        });
        return;
      }

      this.loading = true;

      try {
        const response = await axios.put(
          "http://10.107.0.2:3000/api/auth/updateTriage",
          this.localForm
        );

        if (response.status === 200) {
          this.$q.notify({
            type: "positive",
            message: "Patient record updated successfully!",
            position: "top",
          });

          this.$emit("submit");
          this.triageDialog = false;
        }
      } catch (error) {
        console.error("Update Error:", error);

        const errMsg =
          error.response && error.response.data
            ? error.response.data.message
            : "Failed to update record.";

        this.$q.notify({
          type: "negative",
          message: errMsg,
        });
      } finally {
        this.loading = false;
      }
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
          "http://10.107.0.2:3000/api/auth/searchInpatient",
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

    async handlePrint(row) {
      if (!row || !row.PATIENTNO) {
        this.$q.notify({ type: "warning", message: "Invalid Patient ID" });
        return;
      }

      this.loading = true;

      try {
        const checkResponse = await axios.get(
          `http://10.107.0.2:3000/api/auth/checkPatientExists/${row.PATIENTNO}`
        );

        const { exists, source } = checkResponse.data;

        if (!exists) {
          this.$q.notify({
            type: "warning",
            message: "Patient not found in Registration or Info tables.",
            position: "top",
          });
          return;
        }

        const dataResponse = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${row.PATIENTNO}`
        );
        const patientData = dataResponse.data;

        if (source === "REGISTRATION") {
          await this.generatePatientPdf(patientData);
        } else if (source === "INFO") {
          await this.generatePatientInfoPdf(patientData);
        }
      } catch (error) {
        console.error("Print Error:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while processing.",
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
          `http://10.107.0.2:3000/api/auth/getPatient/${row.PATIENTNO}`
        );

        const fullPatientData = {
          ...response.data,
          patientId: row.PATIENTNO,
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

    async handlePrintTriage(row) {
      this.loading = true;

      try {
        const response = await axios.get(
          `http://10.107.0.2:3000/api/auth/getPatient/${row.PATIENTNO}`
        );

        const fullPatientData = {
          ...response.data,
          patientId: row.PATIENTNO,
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
  },
};
</script>

<style scoped lang="scss">
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

.hover-green:hover {
  color: #388e3c !important;
  background-color: #e8f5e9;
}
</style>
