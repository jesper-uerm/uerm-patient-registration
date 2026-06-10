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
              color="yellow-10"
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
          row-key="PATIENTREGID"
          :loading="loading"
          flat
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
          @row-click="
            (evt, row) => {
              if (!row.PERSONNEL) editPatient(row);
            }
          "
        >
          <template v-slot:body-cell-PATIENTNO="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium text-uppercase">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value == 1"
                color="green-7"
                label="Approved by Credit and Finance"
                outline
              />
              <q-badge
                v-else-if="props.value == 0"
                color="red-7"
                label="Disapproved by Credit and Finance"
                outline
              />

              <q-badge
                v-else-if="props.row.ISFORADMISSION == null"
                color="blue-grey-6"
                label="For Assessment in Credit"
                outline
              />

              <q-badge
                v-else
                color="orange-7"
                label="Pending for Approval in Credit"
                outline
              />
            </q-td>
          </template>

          <template v-slot:body-cell-ISRETURNING="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value"
                color="blue-grey-6"
                label="Returning Patient"
                outline
              />

              <q-badge v-else color="green-6" label="New Patient" outline />
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 150px">
              <div class="ellipsis text-grey-7">
                {{ props.value }}
                <q-tooltip>{{ props.value }}</q-tooltip>
              </div>
            </q-td>
          </template>

          <!-- large/mmedium screen -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center" @click.stop>
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 170px">
                    <q-item
                      clickable
                      :disable="props.row.ISFORADMISSION !== null || !props.row.PATIENTNO"
                      @click="handleAdmit(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="las la-bed" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Admit Patient</q-item-section>

                      <q-tooltip
                        v-if="!props.row.PATIENTNO"
                        anchor="bottom middle"
                        self="bottom middle"
                        class="bg-red text-white"
                      >
                        PATIENTNO IS REQUIRED
                      </q-tooltip>
                    </q-item>

                    <q-item
                      clickable
                      :disable="props.row.ISVALIDATED == 1 || props.row.PATIENTNO != null"
                      @click="validatePatient(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="las la-clipboard-check" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Create Patient Number</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      :disable="props.row.PERSONNEL !== null"
                      @click="editPatient(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="las la-heartbeat" color="red-8" />
                      </q-item-section>
                      <q-item-section>Add Vitals</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrint(props.row)">
                      <q-item-section avatar>
                        <q-icon name="las la-file-download" color="green-8" />
                      </q-item-section>
                      <q-item-section>Download Forms</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
          <!-- small screen -->
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item clickable v-ripple @click="editPatient(props.row)">
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="blue-10" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.FIRSTNAME }} {{ props.row.LASTNAME }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.PATIENTREGID }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                      <q-menu cover auto-close>
                        <q-list style="min-width: 150px">
                          <q-item clickable @click="editPatient(props.row)">
                            <q-item-section avatar>
                              <q-icon name="edit" size="xs" />
                            </q-item-section>
                            <q-item-section>Update Triage Form</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            @click="validatePatient(props.row)"
                            :disable="props.row.ISVALIDATED == 1"
                          >
                            <q-item-section avatar>
                              <q-icon
                                name="check"
                                :color="props.row.ISVALIDATED == 1 ? 'grey' : 'blue-10'"
                              />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>Create Patient Number</q-item-label>
                              <q-item-label caption v-if="props.row.ISVALIDATED == 1"
                                >Already Validated</q-item-label
                              >
                            </q-item-section>
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

                            <q-item clickable @click="handlePrintTreatment(props.row)">
                              <q-item-section avatar>
                                <q-icon name="print" size="xs" />
                              </q-item-section>
                              <q-item-section>Print Treatment Sheet</q-item-section>
                            </q-item>
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

    <q-dialog
      v-model="viewPatientValidationDialog"
      backdrop-filter="blur(4px)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md">
          <div class="row items-center justify-center text-center">
            <div class="text-subtitle2 text-weight-bold text-uppercase">
              Patient Information
            </div>
          </div>

          <q-btn
            icon="las la-times"
            flat
            round
            dense
            v-close-popup
            class="text-white opacity-70 absolute-top-right q-ma-sm"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll q-px-xl" style="max-height: 70vh">
          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-caption1">
                  {{ formatFullName(selectedPatient) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-birthday-cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate / Age</q-item-label>
                <q-item-label class="text-caption1">
                  {{ formatDate(selectedPatient.BIRTHDATE) }}
                  ({{ selectedPatient.AGE }} y/o)
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-venus-mars" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Gender</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.SEX || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Address Information
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-home" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Street</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.ADDRESSSTREET || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-city" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Barangay / City</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.ADDRESSBARANGAY || "N/A" }},
                  {{ selectedPatient.ADDRESSCITY || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Government IDs
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>PhilHealth</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.PHILHEALTHID || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Senior ID</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.SENIORID || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>PWD ID</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.PWDID || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-pa-md bg-grey-1">
          <q-btn
            unelevated
            label="Generate Patient Number"
            color="yellow-10"
            icon-right="las la-share"
            @click="handleValidatePatient(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="triageDialog"
      backdrop-filter="blur(4px)"
      persistent
      transition-show="scale"
      transition-hide="scale"
      maximize
    >
      <q-card
        style="width: 1500px; max-width: 95vw; display: flex; flex-direction: column"
        :style="{ height: $q.screen.lt.md ? '90vh' : '87vh' }"
        class="rounded-borders"
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

        <q-card-section class="scroll q-px-xl" style="max-height: 65vh">
          <q-form ref="personalInfoTriage" class="q-pa-sm">
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
                  v-model="formData.lastNameTriage"
                  label="Last Name *"
                  :rules="[(val) => !!val || 'Required']"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="formData.firstNameTriage"
                  label="First Name *"
                  :rules="[(val) => !!val || 'Required']"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                <q-input
                  outlined
                  dense
                  v-model="formData.middleNameTriage"
                  label="Middle Name"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                <q-input
                  outlined
                  dense
                  v-model="formData.suffixTriage"
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
                  v-model="formData.birthdateTriage"
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
                        <q-date v-model="formData.birthdateTriage">
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
                  v-model="formData.ageTriage"
                  label="Age"
                  readonly
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                <q-input
                  outlined
                  dense
                  v-model="formData.genderTriage"
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
                  v-model="formData.weightTriage"
                  label-slot
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
                  v-model="formData.broughtBy"
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
                  v-model="formData.philHealthCateg"
                  :options="['Member', 'Non-member', 'Dependent', 'OFW']"
                  label="PhilHealth Category"
                />
              </div>

              <div class="col-12 col-sm-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="formData.ptCondition"
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
            <div
              class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase"
            >
              Vital Signs:
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12">
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
            </div>
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="formData.tempTriage"
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
                  v-model="formData.heartRateTriage"
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
                  v-model="formData.oxygenTriage"
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
                  v-model="formData.bpTriage"
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
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="formData.respiRateTriage"
                  label-slot
                  suffix="cpm"
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Respiratory Rate <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-3 col-md-3">
                <q-input
                  outlined
                  dense
                  v-model="formData.painScoreTriage"
                  label
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    Pain Score <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-3 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="formData.avpuTriage"
                  :options="[
                    'Alert',
                    'Verbally Responsive',
                    'Painfully Responsive',
                    'Unresponsive',
                  ]"
                  label
                  :rules="[(val) => !!val || 'Required']"
                >
                  <template v-slot:label>
                    AVPU Scale <span class="text-red">*</span>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-sm-3 col-md-3 q-mb-md">
                <q-select
                  outlined
                  dense
                  v-model="formData.contagiousTriage"
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
                  v-model="formData.isolationPrecautionTriage"
                  :options="['COVID Complex (Old ER)', 'COVID Complex Extension (OPD)']"
                  label="Transfer Immediately to:"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="formData.cpdTriage"
                  :options="['Yes', 'No']"
                  label="Cardio-Pulmonary Distress"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4">
                <q-select
                  outlined
                  dense
                  v-model="formData.levelTriage"
                  :options="['Emergent', 'Urgent', 'Non-Urgent']"
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
                  v-model="formData.checkforPresense"
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
                  v-model="formData.remarksTriage"
                  label="Remarks"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  outlined
                  dense
                  readonly
                  v-model="formData.personnelTriage"
                  label-slot
                >
                  <template #label>
                    Name of Triage Personnel <span class="text-red">*</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  outlined
                  dense
                  v-model="formData.dateTriage"
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
                        <q-date v-model="formData.dateTriage">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <!-- Triage Personnel Signature -->
              <div class="col-12">
                <div class="text-caption text-center text-grey-8 q-mb-xs">
                  Triage Personnel Signature <span class="text-red">*</span>
                </div>
                <div
                  class="rounded-borders q-pa-sm"
                  :class="hasError ? 'bg-red-1' : 'bg-grey-1'"
                  style="border: 1px solid #dcdcdc"
                >
                  <SignaturePad v-if="triageDialog" v-model="localSignature" />
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

        <q-card-actions align="center" class="text-primary q-mt-lg">
          <q-btn flat label="Cancel" v-close-popup />

          <q-btn
            unelevated
            type="button"
            color="yellow-10"
            style="width: 100%; height: 45px; max-width: 150px"
            icon-right="upload"
            label="Submit"
            :loading="loading"
            @click="handleSubmitUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showDuplicateDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 700px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md">
          <div class="row items-center justify-center text-center">
            <div class="text-subtitle2 text-weight-bold text-uppercase">
              <q-icon name="las la-exclamation-triangle" class="q-mr-xs" size="xs" />
              Possible Duplicate Found
            </div>
          </div>

          <q-btn
            icon="las la-times"
            flat
            round
            dense
            v-close-popup
            class="text-white opacity-70 absolute-top-right q-ma-sm"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll q-px-xl" style="max-height: 70vh">
          <div class="text-caption text-grey-8 text-center q-mb-lg">
            We found existing records that match the details of the patient you are trying
            to register.
          </div>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information Entered
          </div>

          <q-list bordered separator class="rounded-borders q-mb-lg">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ formatFullName(selectedPatient) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-birthday-cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ formatDate(selectedPatient.BIRTHDATE) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Matching Existing Records
          </div>
          <div class="text-caption text-grey-7 q-mb-sm">
            Select the patient you want to link.
          </div>

          <q-markup-table flat bordered class="rounded-borders">
            <thead class="bg-grey-2">
              <tr>
                <th class="text-left"></th>
                <th class="text-left">Patient No</th>
                <th class="text-left">Full Name</th>
                <th class="text-left">Birthdate</th>
                <th class="text-left">Age</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="patient in duplicateList"
                :key="patient.existingPatientNo"
                @click="selectedDuplicate = patient"
                class="cursor-pointer transition-generic"
                :class="
                  selectedDuplicate?.existingPatientNo === patient.existingPatientNo
                    ? 'bg-blue-1'
                    : 'hover:bg-grey-1'
                "
              >
                <td class="text-left">
                  <q-radio
                    v-model="selectedDuplicate"
                    :val="patient"
                    dense
                    color="primary"
                  />
                </td>
                <td class="text-weight-bold text-primary">
                  {{ patient.existingPatientNo }}
                </td>
                <td>
                  {{ patient.firstName }} {{ patient.middleName }} {{ patient.lastName }}
                  {{ patient.suffix }}
                </td>
                <td>
                  {{ formatDate(patient.birthdate) }}
                </td>
                <td>
                  {{ patient.age }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="bg-grey-1 q-pa-md">
          <q-btn unelevated label="Cancel" color="grey-7" v-close-popup />

          <q-btn
            unelevated
            label="Ignore & Create New"
            color="yellow-10"
            icon-right="las la-user-plus"
            @click="ignoreDuplicate"
          />

          <q-btn
            v-if="selectedDuplicate"
            unelevated
            label="Link Record"
            color="blue-10"
            icon-right="las la-link"
            @click="confirmLinkPatient"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="admitDialog" persistent>
      <q-card style="min-width: 520px; border-radius: 12px">
        <q-card-section class="q-pa-md">
          <div
            class="q-pa-md rounded-borders q-mb-md"
            style="background: #f8f9fa; border: 1px solid #e0e0e0"
          >
            <div class="row items-center q-mb-md">
              <div class="col-auto q-mr-md">
                <div
                  class="bg-blue-1 text-primary flex flex-center rounded-borders"
                  style="width: 42px; height: 42px"
                >
                  <q-icon name="las la-user" size="26px" />
                </div>
              </div>
              <div class="col">
                <div
                  class="text-caption text-grey-6 text-uppercase text-weight-bold"
                  style="line-height: 1"
                >
                  Patient Name
                </div>
                <div class="text-subtitle1 text-uppercase" style="line-height: 1.2">
                  {{ selectedPatient?.fullName || "N/A" }}
                </div>
              </div>
            </div>

            <q-separator class="q-my-md" style="background-color: #e0e0e0" />

            <div class="row items-center q-mb-sm">
              <div class="col-auto q-mr-sm text-center" style="width: 24px">
                <q-icon name="las la-id-badge" class="text-grey-5" size="20px" />
              </div>
              <div class="col text-grey-7">Patient No.</div>
              <div class="col-auto text-weight-bold text-dark">
                {{ selectedPatient?.PATIENTNO || "N/A" }}
              </div>
            </div>

            <div class="row items-center">
              <div class="col-auto q-mr-sm text-center" style="width: 24px">
                <q-icon name="las la-calendar-day" class="text-grey-5" size="20px" />
              </div>
              <div class="col text-grey-7">Birthdate</div>
              <div class="col-auto text-weight-bold text-dark">
                {{ selectedPatient?.birthdateStr || "N/A" }}
              </div>
            </div>
          </div>

          <div class="text-subtitle2 text-grey-8 q-mb-md text-weight-bold">
            Admission Details
          </div>

          <div class="q-gutter-y-md q-px-xs">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-7">
                <q-select
                  outlined
                  dense
                  v-model="formData.admittingPhysician"
                  :options="allDoctors || []"
                  emit-value
                  map-options
                  label-slot
                  stack-label
                  lazy-rules
                  @update:model-value="onDoctorSelected"
                >
                  <template v-slot:label>
                    Admitting Physician<span class="text-red">*</span>
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
              <div class="col-12 col-sm-5">
                <q-input
                  outlined
                  dense
                  v-model="formData.admittingDepartment"
                  label="Department"
                  stack-label
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-7">
                <q-select
                  outlined
                  stack-label
                  dense
                  v-model="formData.attendingPhysician"
                  :options="allDoctors || []"
                  emit-value
                  map-options
                  label-slot
                  lazy-rules
                  @update:model-value="onAttendingDoctorSelected"
                >
                  <template v-slot:label>
                    Attending Physician<span class="text-red">*</span>
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

              <div class="col-12 col-sm-5">
                <q-input
                  outlined
                  dense
                  v-model="formData.attendingDepartment"
                  label="Department"
                  stack-label
                  readonly
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            class="q-px-md text-weight-bold"
            v-close-popup
          />
          <q-btn
            unelevated
            label="Confirm & Admit"
            color="yellow-10"
            icon-right="las la-check"
            class="q-px-md text-weight-bold text-white"
            @click="confirmAdmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapState, mapActions, mapWritableState } from "pinia";
import { useTriageStore } from "src/stores/triageStore";
import { useAuthStore } from "src/stores/authStore";
import { useFinanceStore } from "src/stores/financeStore";

import SignaturePad from "src/components/TriageAssessment/SignaturePad.vue";
import { printEmergencyTreatment } from "src/composables/printEmergencyTreatment";
import { printEmergencyPatientInformation } from "src/composables/printEmergencyPatientInformation";
import { printPatientConsent } from "src/composables/printPatientConsent";

export default {
  name: "EmergencyList",
  components: { SignaturePad },

  setup() {
    const { generateTriagePatientPdf } = printEmergencyPatientInformation();
    const { generateEmergencyTreatmentPdf } = printEmergencyTreatment();
    const { generatePatientConsentPdf } = printPatientConsent();

    return {
      generateTriagePatientPdf,
      generatePatientConsentPdf,
      generateEmergencyTreatmentPdf,
    };
  },

  data() {
    return {
      searchQuery: "",
      localSignature: null,
      hasError: false,

      showDuplicateDialog: false,
      admitDialog: false,
      duplicateList: [],
      selectedDuplicate: null,
      pendingPatientId: null,
      pendingLinkData: null,
      duplicateRows: [],
      duplicateColumns: [
        {
          name: "existingPatientNo",
          label: "Patient No.",
          field: "existingPatientNo",
          align: "left",
          style: "font-weight: bold",
        },
        { name: "lastName", label: "Last Name", field: "lastName", align: "left" },
        { name: "firstName", label: "First Name", field: "firstName", align: "left" },
        { name: "middleName", label: "Middle Name", field: "middleName", align: "left" },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "birthdate",
          align: "left",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
        },
      ],

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
          label: "NAME",
          field: "fullName",
          align: "center",
          sortable: true,
          style: "width: 250px",
        },
        {
          name: "birthdateStr",
          label: "BIRTHDATE",
          field: "birthdateStr",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 180px",
        },
        {
          name: "ISRETURNING",
          label: "PATIENT TYPE",
          field: "ISRETURNING",
          align: "center",
          sortable: true,
          style: "width: 120px",
        },

        {
          name: "status",
          label: "STATUS",
          field: "IS_APPROVED",
          align: "center",
          style: "width: 150px;",
          headerStyle: "width: 120px;",
        },

        {
          name: "actions",
          label: "ACTIONS",
          field: "actions",
          align: "center",
          style: "width: 150px",
        },
      ],
    };
  },

  computed: {
    ...mapState(useFinanceStore, ["allDoctors"]),
    ...mapState(useTriageStore, [
      "patientList",
      "loading",
      "hasSearched",
      "formData",
      "appOptions",
    ]),
    ...mapState(useAuthStore, ["fullName"]),
    ...mapWritableState(useTriageStore, [
      "triageDialog",
      "viewPatientValidationDialog",
      "selectedPatient",
    ]),
  },

  mounted() {
    this.fetchPatients();
    this.formData.personnelTriage = this.fullName;
    this.fetchDoctors();
  },

  watch: {
    "formData.personnelSignature"(val) {
      if (val) this.hasError = false;
    },
  },

  methods: {
    ...mapActions(useTriageStore, [
      "fetchPatients",
      "searchPatients",
      "updateTriage",
      "casenumForm",
      "updateTriageRecord",
      "submitCaseNumber",
      "admitPatient",
      "validatePatient",
      "sendDataInformation",
      "getPatientFullDetails",
      "linkExistingPatient",
    ]),
    ...mapActions(useFinanceStore, ["fetchDoctors"]),

    resetForm() {
      this.formData.patientId = null;
      this.formData.patientSignature = null;
      this.formData.personnelSignature = null;
    },

    handleLinkingConflict(data, originalPatientId) {
      this.pendingLinkData = {
        originalId: originalPatientId,
      };

      this.duplicateList = Array.isArray(data) ? data : [data];
      this.selectedDuplicate = null;
      this.showDuplicateDialog = true;
    },

    async confirmLinkPatient() {
      if (!this.selectedDuplicate || !this.pendingLinkData) return;

      this.showDuplicateDialog = false;

      await this.linkExistingPatient(
        this.pendingLinkData.originalId,
        this.selectedDuplicate.existingPatientNo
      );

      this.viewPatientValidationDialog = false;
    },

    handleSearch() {
      if (!this.searchQuery) {
        this.fetchPatients();
        return;
      }
      this.searchPatients(this.searchQuery);
    },

    editPatient(row) {
      this.updateTriage(this.formData, row);

      if (!this.formData.dateTriage) {
        const timeStamp = Date.now();
        this.formData.dateTriage = date.formatDate(timeStamp, "YYYY/MM/DD");
      }
    },

    async handleSubmitUpdate() {
      if (this.loading) return;

      const valid = await this.$refs.personalInfoTriage.validate();
      const rawResult = this.localSignature;
      const signatureString = rawResult && rawResult.data ? rawResult.data : rawResult;
      const isSignatureValid = !!signatureString && signatureString.length > 50;

      if (!valid || !isSignatureValid) {
        let msg = "Please complete the requirements.";
        if (!valid && !isSignatureValid) msg = "Please fill missing fields and sign.";
        else if (!valid) msg = "Please fill out the missing fields.";
        else if (!isSignatureValid) msg = "Personnel signature is required.";

        this.$q.notify({ type: "warning", message: msg, position: "top" });
        return;
      }
      await this.updateTriageRecord(this.formData, signatureString);
    },

    async handleValidatePatient(row) {
      try {
        await this.sendDataInformation(row);

        this.viewPatientValidationDialog = false;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.handleLinkingConflict(error.response.data, row.PATIENTREGID);
        } else {
          console.error(error);
        }
      }
    },

    handleSendData(patient) {
      this.sendDataInformation(patient);
    },

    async ignoreDuplicate() {
      this.showDuplicateDialog = false;

      const payload = {
        PATIENTREGID: this.pendingLinkData.originalId,
      };

      await this.sendDataInformation(payload, true);

      this.viewPatientValidationDialog = false;
    },

    handleAdmit(patient) {
      this.selectedPatient = patient;

      this.admitDialog = true;
    },

    confirmAdmit() {
      this.admitDialog = false;

      this.formData.PATIENTREGID = this.selectedPatient.PATIENTREGID;

      this.admitPatient(this.formData);
    },

    async handlePrint(row) {
      const data = await this.getPatientFullDetails(row.PATIENTREGID);
      if (data) await this.generateTriagePatientPdf(data);
    },

    async handlePrintTreatment(row) {
      const data = await this.getPatientFullDetails(row.PATIENTREGID);
      if (data) await this.generateEmergencyTreatmentPdf(data);
    },

    async handlePrintConsent(row) {
      const data = await this.getPatientFullDetails(row.PATIENTREGID);
      if (data) await this.generatePatientConsentPdf(data);
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },

    formatFullName(p) {
      if (!p) return "";
      const parts = [p.FIRSTNAME, p.MIDDLENAME, p.LASTNAME].filter(Boolean);
      let fullName = parts.join(" ");
      if (p.SUFFIX) fullName += ` ${p.SUFFIX}`;
      return fullName;
    },

    onDoctorSelected(selectedValue) {
      const selectedDoctor = this.allDoctors.find((doc) => doc.value === selectedValue);

      if (selectedDoctor) {
        this.formData.admittingDepartment = selectedDoctor.department;
      } else {
        this.formData.admittingDepartment = "";
      }
    },

    onAttendingDoctorSelected(selectedValue) {
      const selectedDoctor = this.allDoctors.find((doc) => doc.value === selectedValue);

      if (selectedDoctor) {
        this.formData.attendingDepartment = selectedDoctor.department;
      } else {
        this.formData.attendingDepartment = "";
      }
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
