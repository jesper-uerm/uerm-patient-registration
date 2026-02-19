<template>
  <q-dialog
    v-model="store.showSearchDialog"
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
              v-model="store.searchQuery"
              label="Search Patient"
              placeholder="Enter Patient Name or ID"
              @keyup.enter="store.searchPatients()"
              :disable="store.loading"
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
                  :loading="store.loading"
                  @click="store.searchPatients()"
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
          :rows="store.patientList"
          :columns="columns"
          row-key="PATIENTNO"
          :loading="store.loading"
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
                      <q-item clickable @click="store.prepareTriageForm(props.row)">
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
              <div class="text-subtitle1" v-if="!store.hasSearched">
                Ready to Search Inpatients
              </div>
              <div class="text-subtitle1" v-else>
                No patients found matching "{{ store.searchQuery }}"
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- <q-dialog
      v-model="store.showTriageDialog"
      backdrop-filter="blur(4px)"
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
          <q-form ref="personalInfoTriage" @submit="validateAndSubmit" class="q-pa-sm">
            <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>

            <input type="hidden" v-model="store.triageForm.patientId" />

            <div class="row q-col-gutter-md">
              <div class="col-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.lastNameTriage"
                  label="Last Name *"
                  readonly
                />
              </div>
              <div class="col-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.firstNameTriage"
                  label="First Name *"
                  readonly
                />
              </div>
              <div class="col-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.middleNameTriage"
                  label="Middle Name"
                  readonly
                />
              </div>
              <div class="col-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.suffixTriage"
                  :options="['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI']"
                  label="Suffix"
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.birthdateTriage"
                  label="Birthdate *"
                  readonly
                >
                  <template v-slot:append>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model="store.triageForm.ageTriage"
                  label="Age"
                  readonly
                  bg-color="grey-2"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.genderTriage"
                  :options="['Male', 'Female', 'Prefer not to say']"
                  label="Gender"
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.chiefComplaintTriage"
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
                  v-model="store.triageForm.tempTriage"
                  label="Temperature *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(c)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.heartRateTriage"
                  label="Heart Rate *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(bpm)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.oxygenTriage"
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
                  v-model="store.triageForm.bpTriage"
                  label="Blood Pressure *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(mmHg)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.respiRateTriage"
                  label="Respiratory Rate *"
                  :rules="[(val) => !!val || 'Required']"
                  hint="(cpm)"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.painScoreTriage"
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
                  v-model="store.triageForm.avpuTriage"
                  :options="[
                    'Alert',
                    'Verbally Responsive',
                    'Painfully Responsive',
                    'Unresponsive',
                  ]"
                  label="AVPU Scale"
                  :rules="[(val) => !!val || 'Please select AVPU Scale']"
                />
              </div>
              <div class="col-6 col-md-6">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.contagiousTriage"
                  :options="[
                    'Symptom/s suggestive of COVID-19',
                    'Symptom/s suggestive of a VIRAL EXANTHEM',
                    'None',
                  ]"
                  label="Screening for Contagious Infectious Disease"
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
                  v-model="store.triageForm.isolationPrecautionTriage"
                  :options="['COVID Complex (Old ER)', 'COVID Complex Extension (OPD)']"
                  label="Transfer Immediately to:"
                  :rules="[(val) => !!val || 'Please select precaution.']"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.cpdTriage"
                  :options="['Yes', 'No']"
                  label="Cardio-Pulmonary Distress"
                  :rules="[(val) => !!val || 'Required.']"
                />
              </div>
              <div class="col-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.levelTriage"
                  :options="['1 - (Emergent)', '2 - (Urgent)', '3 - (Non-Urgent)']"
                  label="Triage Level"
                  :rules="[(val) => !!val || 'Please select triage level.']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-6">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.checkforPresense"
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
                  v-model="store.triageForm.remarksTriage"
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
                  v-model="store.triageForm.personnelTriage"
                  label="Name of Triage Personnel *"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
              <div class="col-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.dateTriage"
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
                        <q-date v-model="store.triageForm.dateTriage">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <div class="text-caption text-center text-grey-8 q-mb-xs">
                  Triage Personnel Signature *
                </div>
                <div
                  class="rounded-borders q-pa-sm"
                  :class="store.signatureError ? 'bg-red-1' : 'bg-grey-1'"
                  style="border: 1px solid #dcdcdc"
                >
                  <SignaturePad v-model="localSignature" />

                  <div
                    v-if="store.signatureError"
                    class="text-negative text-caption q-mt-xs text-center"
                  >
                    <q-icon name="warning" class="q-mr-xs" /> Signature is required
                  </div>
                </div>
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
            :loading="store.loading"
            @click="validateAndSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->

    <q-dialog
      v-model="store.showTriageDialog"
      backdrop-filter="blur(4px)"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        style="width: 1500px; max-width: 95vw; display: flex; flex-direction: column"
        :style="{ height: $q.screen.lt.md ? '90vh' : '80vh' }"
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
          <q-form ref="personalInfoTriage" @submit="validateAndSubmit" class="q-pa-sm">
            <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>

            <input type="hidden" v-model="store.triageForm.patientId" />

            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.lastNameTriage"
                  label="Last Name *"
                  :rules="[(val) => !!val || 'Required']"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.firstNameTriage"
                  label="First Name *"
                  :rules="[(val) => !!val || 'Required']"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.middleNameTriage"
                  label="Middle Name"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.suffixTriage"
                  :options="['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI']"
                  label="Suffix"
                  lazy-rules
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.birthdateTriage"
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
                        <q-date v-model="store.triageForm.birthdateTriage">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model="store.triageForm.ageTriage"
                  label="Age"
                  readonly
                  bg-color="grey-2"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.genderTriage"
                  :options="['Male', 'Female']"
                  label="Gender"
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  type="number"
                  dense
                  v-model="store.triageForm.weightTriage"
                  label-slot
                  :rules="[(val) => !!val || 'Required']"
                  suffix="kg"
                >
                  <template v-slot:label>
                    Weight <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.broughtBy"
                  :options="['Self', 'Ambulance', 'Relative', 'Police', 'Others']"
                  label-slot
                >
                  <template v-slot:label>
                    Brought By <span class="text-red">*</span>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-sm-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.philHealthCateg"
                  :options="['Member', 'Non-member', 'Dependent', 'OFW']"
                  label="PhilHealth Category"
                />
              </div>

              <div class="col-12 col-sm-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.ptCondition"
                  :options="[
                    'Ambulatory',
                    'Stuporous',
                    'Unconscious',
                    'Violent',
                    'Assisted',
                    'Others',
                  ]"
                  label-slot
                >
                  <template v-slot:label>
                    Patient's Condition upon admission <span class="text-red">*</span>
                  </template>
                </q-select>
              </div>
            </div>

            <q-separator class="q-my-md" />
            <div class="text-subtitle1 text-bold q-mb-md">Vital Signs:</div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.chiefComplaintTriage"
                  label-slot
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Chief Complaint <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.tempTriage"
                  label-slot
                  suffix="°C"
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Temperature <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.heartRateTriage"
                  label-slot
                  suffix="bpm"
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Heart Rate <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.oxygenTriage"
                  label-slot
                  suffix="%"
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Oxygen Saturation <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.bpTriage"
                  label-slot
                  suffix="mmHg"
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Blood Pressure <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.respiRateTriage"
                  label-slot
                  suffix="cpm"
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Respiratory Rate <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.painScoreTriage"
                  label="Pain Score *"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>

              <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.contagiousTriage"
                  :options="[
                    'Symptom/s suggestive of COVID-19',
                    'Symptom/s suggestive of a VIRAL EXANTHEM',
                    'None',
                  ]"
                  label="Screening for Contagious Infectious Disease"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.isolationPrecautionTriage"
                  :options="['COVID Complex (Old ER)', 'COVID Complex Extension (OPD)']"
                  label="Transfer Immediately to:"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.cpdTriage"
                  :options="['Yes', 'No']"
                  label="Cardio-Pulmonary Distress"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.levelTriage"
                  :options="['1 - (Emergent)', '2 - (Urgent)', '3 - (Non-Urgent)']"
                  label-slot
                  lazy-rules
                  :rules="[(val) => !!val || 'Please select triage level.']"
                >
                  <template v-slot:label>
                    Triage Level <span class="text-red">*</span>
                  </template>
                </q-select>
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6 col-md-6">
                <q-select
                  outlined
                  dense
                  v-model="store.triageForm.checkforPresense"
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
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.remarksTriage"
                  label="Remarks"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.personnelTriage"
                  label-slot
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Name of Triage Personnel <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="store.triageForm.dateTriage"
                  label-slot
                  mask="date"
                  :rules="[
                    'date',
                    (val) =>
                      new Date(val) <= new Date() || 'Date cannot be in the future',
                  ]"
                >
                  <template v-slot:label>
                    Date Accomplished <span class="text-red">*</span>
                  </template>

                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="store.triageForm.dateTriage">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <div class="text-caption text-center text-grey-8 q-mb-xs">
                  Triage Personnel Signature <span class="text-red">*</span>
                </div>
                <div
                  class="rounded-borders q-pa-sm"
                  :class="hasError ? 'bg-red-1' : 'bg-grey-1'"
                  style="border: 1px solid #dcdcdc"
                >
                  <SignaturePad v-model="localSignature" />
                  <div
                    v-if="hasError"
                    class="text-negative text-caption q-mt-xs text-center"
                  >
                    <q-icon name="warning" class="q-mr-xs" /> Signature is required
                  </div>
                </div>
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
            :loading="store.loading"
            @click="validateAndSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { ref, watch } from "vue";
import { date } from "quasar";
import SignaturePad from "src/components/TriageAssessment/SignaturePad.vue";
import { useReturningPatientStore } from "src/stores/returningpatientStore";

import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printPatientInfo } from "src/composables/printPatientInfo";
import { printPatientConsent } from "src/composables/printPatientConsent";
import { printEmergencyPatientInformation } from "src/composables/printEmergencyPatientInformation";

export default {
  name: "ReturningInpatient",
  components: { SignaturePad },

  setup() {
    const store = useReturningPatientStore();
    const personalInfoTriage = ref(null);
    const localSignature = ref(null);

    const { generatePatientPdf } = printInpatientInformation();
    const { generatePatientInfoPdf } = printPatientInfo();
    const { generatePatientConsentPdf } = printPatientConsent();
    const { generateTriagePatientPdf } = printEmergencyPatientInformation();

    watch(localSignature, (val) => {
      if (val) store.signatureError = false;
    });

    return {
      store,
      personalInfoTriage,
      localSignature,
      generatePatientPdf,
      generatePatientInfoPdf,
      generatePatientConsentPdf,
      generateTriagePatientPdf,

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
    };
  },

  methods: {
    show() {
      this.store.openSearchDialog();
    },

    viewPatient(row) {
      this.$q.notify({ type: "primary", message: `Viewing details for ${row.lastName}` });
    },

    async validateAndSubmit() {
      const valid = await this.$refs.personalInfoTriage.validate();
      const isSignatureValid = !!this.localSignature;

      if (!isSignatureValid) this.store.signatureError = true;

      if (!valid || !isSignatureValid) {
        let msg = "Please complete the requirements.";
        if (!valid && !isSignatureValid)
          msg = "Please fill out missing fields and provide a signature.";
        else if (!valid) msg = "Please fill out the missing fields.";
        else if (!isSignatureValid) msg = "Personnel signature is required.";

        this.$q.notify({ type: "warning", message: msg, position: "top" });
        return;
      }

      const success = await this.store.submitTriageRecord(this.localSignature);
      if (success) {
        this.$emit("submit");
        this.localSignature = null;
      }
    },

    async handlePrint(row) {
      const result = await this.store.fetchPatientForPrint(row.PATIENTNO);
      if (result) {
        if (result.source === "REGISTRATION") {
          await this.generatePatientPdf(result.data);
        } else if (result.source === "INFO") {
          await this.generatePatientInfoPdf(result.data);
        }
      }
    },

    async handlePrintConsent(row) {
      const data = await this.store.fetchFullPatientData(row.PATIENTNO);
      if (data) await this.generatePatientConsentPdf(data);
    },

    async handlePrintTriage(row) {
      const data = await this.store.fetchFullPatientData(row.PATIENTNO);
      if (data) await this.generateTriagePatientPdf(data);
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
</style>
