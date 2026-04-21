<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0; border-radius: 8px">
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
          debounce="500"
          @update:model-value="handleSearch"
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
          row-key="ID"
          :loading="loading"
          flat
          :dense="$q.screen.lt.xl"
          :grid="$q.screen.lt.sm"
          virtual-scroll
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-PATIENTNO="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium text-uppercase">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-ISADMITTED="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value == 0"
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
                    <q-item clickable @click="openCaseNumberDialog(props.row)">
                      <q-item-section avatar>
                        <q-icon name="post_add" color="green-8" />
                      </q-item-section>
                      <q-item-section>Assign Case Number</q-item-section>
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
                    <q-item-label caption>ID: {{ props.row.ID }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                      <q-menu cover auto-close>
                        <q-list style="min-width: 150px">
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

      <q-dialog
        v-model="caseNumberDialog"
        backdrop-filter="blur(4px)"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card
          style="width: 1500px; max-width: 95vw; display: flex; flex-direction: column"
          :style="{ height: $q.screen.lt.md ? '90vh' : '80vh' }"
          class="rounded-borders"
        >
          <q-card-section
            class="column text-center text-white q-py-md relative-position"
            style="background-color: #004aad"
          >
            <div class="text-h6 text-bold">CASE NUMBER FORM</div>
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

          <q-card-section class="scroll q-px-xl" style="max-height: 65vh">
            <q-form ref="casenumberForm" @submit="handleCaseNumber" class="q-pa-sm">
              <div
                class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase"
              >
                Patient Information:
              </div>
              <input type="hidden" v-model="formData.patientId" />
              <input type="hidden" v-model="formData.patientNo" />
              <div class="row q-col-gutter-xs">
                <div class="col-12 col-sm-3 col-md-3">
                  <q-input
                    outlined
                    dense
                    v-model="formData.casefullname"
                    label="Full Name *"
                    :rules="[(val) => !!val || 'Required']"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-3 col-md-3">
                  <q-input
                    outlined
                    dense
                    v-model="formData.casepatientno"
                    label="Patient No. *"
                    :rules="[(val) => !!val || 'Required']"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                  <q-input
                    outlined
                    dense
                    v-model="formData.caseBirthdate"
                    label="Birthdate *"
                    mask="date"
                    readonly
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="formData.caseBirthdate">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                  <q-input
                    outlined
                    dense
                    type="number"
                    v-model="formData.caseAge"
                    label="Age"
                    readonly
                  />
                </div>
              </div>

              <div class="row q-col-gutter-xs">
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input
                    outlined
                    dense
                    v-model="formData.caseSeniorId"
                    type="number"
                    label="Senior Citizen No."
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                  <q-input
                    outlined
                    dense
                    v-model="formData.casepwdId"
                    type="number"
                    label="PWD No."
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                  <q-input
                    outlined
                    dense
                    v-model="formData.casedtAdmission"
                    label="Date of Admission *"
                    mask="date"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="formData.casedtAdmission">
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

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-3 col-md-3">
                  <q-input
                    outlined
                    dense
                    v-model="formData.chiefComplaintTriage"
                    label-slot
                    :rules="[(val) => !!val || 'Required']"
                  >
                    <template v-slot:label>
                      Chief Complaint <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-3 col-md-3">
                  <q-input
                    outlined
                    dense
                    v-model="formData.caseadmDiagnosis"
                    label-slot
                    :rules="[(val) => !!val || 'Required']"
                  >
                    <template v-slot:label>
                      Admission Diagnosis <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-3 col-md-3">
                  <q-input outlined dense v-model="formData.casefromER" label-slot>
                    <template v-slot:label>
                      Admission Type <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-3 col-md-3">
                  <q-select
                    outlined
                    dense
                    v-model="formData.caseserviceType"
                    :options="[
                      { label: 'PRIVATE PATIENT', value: 'PAY' },
                      { label: 'CHARITY/SERVICE PATIENT', value: 'CHA' },
                    ]"
                    label-slot
                    emit-value
                    map-options
                  >
                    <template v-slot:label>
                      Service Type <span class="text-red">*</span>
                    </template>
                  </q-select>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-12">
                  <q-input outlined dense v-model="formData.casepdfRemarks" label-slot>
                    <template v-slot:label>
                      Pre Defined Remarks: <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row q-col-gutter-xs">
                <div class="col-12 col-sm-3 col-md-3">
                  <q-input outlined dense v-model="formData.caseRemarks" label-slot>
                    <template v-slot:label>
                      Remarks: <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-3 col-md-3">
                  <q-select
                    outlined
                    dense
                    v-model="formData.caseerPhysician"
                    :options="allDoctors || []"
                    emit-value
                    map-options
                    label
                    @update:model-value="onDoctorSelected"
                  >
                    <template v-slot:label>
                      ER Physician <span class="text-red">*</span>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No doctors found
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-sm-3 col-md-3">
                  <q-input outlined dense v-model="formData.caseAllergies" label-slot>
                    <template v-slot:label>
                      Allergies <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-3 col-md-3">
                  <q-input outlined dense v-model="formData.caseAdmittedBy" label-slot>
                    <template v-slot:label>
                      Admitted By<span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
              </div>

              <q-separator class="q-my-md" />
              <div
                class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase"
              >
                Infirmary:
              </div>

              <div class="row q-col-gutter-xs">
                <div class="col-12 col-sm-12 col-md-6 q-mb-md">
                  <q-input
                    outlined
                    dense
                    v-model="formData.caseCensusInfirmary"
                    label-slot
                  >
                    <template v-slot:label>
                      UERM Census <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-12 col-md-6">
                  <q-input outlined dense v-model="formData.caseDepartment" label-slot>
                    <template v-slot:label>
                      Department <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
              </div>

              <q-separator class="q-my-md" />
              <div
                class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase"
              >
                Payment Plan:
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                  <q-input outlined dense v-model="formData.caseCompany" label-slot>
                    <template v-slot:label>
                      Company <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input outlined dense v-model="formData.caseHmo" label-slot>
                    <template v-slot:label>
                      HMO <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input outlined dense v-model="formData.caseEmployer" label-slot>
                    <template v-slot:label>
                      Employer <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input outlined dense v-model="formData.caseCardNo" label-slot>
                    <template v-slot:label>
                      Card No <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input outlined dense v-model="formData.casecovAmount" label-slot>
                    <template v-slot:label>
                      Coverage Amount <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input outlined dense v-model="formData.caseappCode" label-slot>
                    <template v-slot:label>
                      Approval Code <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    outlined
                    dense
                    v-model="formData.caseEffectivity"
                    label="Effectivity *"
                    mask="date"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="formData.caseEffectivity">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input outlined dense v-model="formData.casermPlan" label-slot>
                    <template v-slot:label>
                      Room Plan <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input outlined dense v-model="formData.caseLoa" label-slot>
                    <template v-slot:label>
                      LOA No <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input outlined dense v-model="formData.caseApprov" label-slot>
                    <template v-slot:label>
                      Approval No<span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
              </div>

              <q-separator class="q-my-md" />
              <div
                class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase"
              >
                Informant:
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                  <q-input outlined dense v-model="formData.caseInformantName" label-slot>
                    <template v-slot:label>
                      Full Name <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <q-input outlined dense v-model="formData.caseInfAddress" label-slot>
                    <template v-slot:label>
                      Home Address <span class="text-red">*</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <q-select
                    outlined
                    dense
                    v-model="formData.caseInfRelationship"
                    :options="appOptions.relationships"
                    label-slot
                    :rules="[(val) => !!val || 'Required']"
                  >
                    <template v-slot:label>
                      Relation to Patient <span class="text-red">*</span>
                    </template>
                  </q-select>
                </div>
              </div>
            </q-form>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center" class="text-primary q-my-md">
            <q-btn flat label="Cancel" v-close-popup />

            <q-btn
              color="blue-10"
              icon-right="upload"
              style="width: 100%; height: 45px; max-width: 150px"
              label="Submit"
              :loading="loading"
              @click="handleCaseNumber"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { date } from "quasar";
import { mapState, mapWritableState, mapActions } from "pinia";
import { useTriageStore } from "src/stores/triageStore";
import { useFinanceStore } from "src/stores/financeStore";

import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printEmergencyPatientInformation } from "src/composables/printEmergencyPatientInformation";
import { printPatientConsent } from "src/composables/printPatientConsent";
import { printEmergencyTreatment } from "src/composables/printEmergencyTreatment";

function getDefaultFormData() {
  return {
    patientId: null,
    patientNo: null,
    casefullname: "",
    casepatientno: "",
    caseBirthdate: "",
    caseAge: null,
    caseSeniorId: "",
    casepwdId: "",
    casedtAdmission: "",
    chiefComplaintTriage: "",
    caseadmDiagnosis: "",
    casefromER: "FER",
    caseserviceType: "",
    casepdfRemarks: "",
    caseRemarks: "",
    caseerPhysician: "",
    caseAllergies: "",
    caseAdmittedBy: "",
    caseCensusInfirmary: "",
    caseDepartment: "",
    caseCompany: "",
    caseHmo: "",
    caseEmployer: "",
    caseCardNo: "",
    casecovAmount: "",
    caseappCode: "",
    caseEffectivity: "",
    casermPlan: "",
    caseLoa: "",
    caseApprov: "",
    caseInformantName: "",
    caseInfAddress: "",
    caseInfRelationship: null,
  };
}

export default defineComponent({
  name: "ForAdmissionER",

  setup() {
    const { generatePatientPdf } = printInpatientInformation();
    const { generateTriagePatientPdf } = printEmergencyPatientInformation();
    const { generatePatientConsentPdf } = printPatientConsent();
    const { generateEmergencyTreatmentPdf } = printEmergencyTreatment();

    return {
      generatePatientPdf,
      generateTriagePatientPdf,
      generatePatientConsentPdf,
      generateEmergencyTreatmentPdf,
    };
  },

  data() {
    return {
      formData: getDefaultFormData(),

      columns: [
        {
          name: "PATIENTNO",
          label: "PATIENTNO",
          field: "PATIENTNO",
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
          name: "birthdateStr",
          label: "Birthdate",
          field: "birthdateStr",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 180px",
        },
        {
          name: "ISADMITTED",
          label: "Status",
          field: "ISADMITTED",
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
    ...mapState(useTriageStore, ["patientList", "loading", "hasSearched", "appOptions"]),
    ...mapWritableState(useTriageStore, [
      "searchQuery",
      "selectedPatient",
      "viewPatientValidationDialog",
      "caseNumberDialog",
    ]),
    ...mapState(useFinanceStore, ["allDoctors"]),
  },

  mounted() {
    this.fetchAdmitPatients();
    this.fetchDoctors();
  },

  methods: {
    ...mapActions(useTriageStore, [
      "fetchAdmitPatients",
      "searchPatientsAdmitted",
      "getPatientFullDetails",
      "setSelectedPatient",
      "casenumForm",
      "submitCaseNumber",
    ]),

    ...mapActions(useFinanceStore, ["fetchDoctors"]),

    resetForm() {
      this.formData = getDefaultFormData();
    },

    openCaseNumberDialog(row) {
      this.resetForm();
      this.formData.patientId = row.ID;
      this.casenumForm(this.formData, row);

      const timeStamp = Date.now();
      const currentDateTime = date.formatDate(timeStamp, "YYYY/MM/DD HH:mm:ss");

      if (!this.formData.dateTriage) this.formData.dateTriage = currentDateTime;
      if (!this.formData.caseBirthdate) this.formData.caseBirthdate = currentDateTime;
      if (!this.formData.caseEffectivity) this.formData.caseEffectivity = currentDateTime;
      if (!this.formData.casedtAdmission) this.formData.casedtAdmission = currentDateTime;

      this.caseNumberDialog = true;
    },

    async handleCaseNumber() {
      const valid = await this.$refs.casenumberForm.validate();
      if (!valid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill out the missing fields.",
          position: "top",
        });
        return;
      }
      await this.submitCaseNumber(this.formData);
    },

    onDoctorSelected(selectedValue) {
      const selectedDoctor = this.allDoctors.find((doc) => doc.value === selectedValue);

      if (selectedDoctor) {
        this.formData.fnDepartment = selectedDoctor.department;
      } else {
        this.formData.fnDepartment = "";
      }
    },

    handleSearch() {
      const query = this.searchQuery?.trim();

      if (!query) {
        this.fetchAdmitPatients();
        return;
      }

      this.searchPatientsAdmitted(query);
    },

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewPatientValidationDialog = true;
    },

    async handlePrintAction(row, generator) {
      try {
        const data = await this.getPatientFullDetails(row.ID);
        if (data) await generator(data);
      } catch (error) {
        console.error("Print error:", error);
      }
    },

    handlePrintTriage(row) {
      this.handlePrintAction(row, this.generateTriagePatientPdf);
    },

    handlePrintConsent(row) {
      this.handlePrintAction(row, this.generatePatientConsentPdf);
    },

    handlePrintTreatment(row) {
      this.handlePrintAction(row, this.generateEmergencyTreatmentPdf);
    },

    formatFullName(p) {
      if (!p) return "";
      return [p.firstName, p.middleName, p.lastName, p.suffix].filter(Boolean).join(" ");
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
