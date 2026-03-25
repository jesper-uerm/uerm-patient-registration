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

          <template v-slot:body-cell-ISADMITTED="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value == 0"
                color="blue-6"
                label="For Admission"
                outline
              />

              <q-badge
                v-else-if="props.value == 2"
                color="green-6"
                label="Admitted"
                outline
              />

              <q-badge v-else color="red-6" label="Emergency Patient" outline />
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 150px">
              <div class="ellipsis text-grey-7">
                {{ formData.ADDRESSPRESENT }}
                <q-tooltip>{{ formData.ADDRESSPRESENT }}</q-tooltip>
              </div>
            </q-td>
          </template>

          <!-- large/mmedium screen -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center" @click.stop>
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item
                      v-if="props.row.ISADMITTED === null && props.row.ISVALIDATED"
                      @click="handleAdmit(props.row)"
                      clickable
                    >
                      <q-item-section avatar>
                        <q-icon name="content_paste_go" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Subject for Admission</q-item-section>
                    </q-item>
                    <q-item
                      v-if="props.row.ISVALIDATED != 1"
                      clickable
                      @click="validatePatient(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="check" color="blue-10" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>Validate</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item
                      v-if="!props.row.PERSONNEL"
                      clickable
                      @click="editPatient(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="add_circle" color="green-8" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>Add Vitals</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable @click="openCaseNumberDialog(props.row)">
                      <q-item-section avatar>
                        <q-icon name="autorenew" color="green-8" />
                      </q-item-section>
                      <q-item-section>Generate Case Number</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrint(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Triage Form</q-item-section>
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
                      <q-item-section>Consent Form</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item clickable v-ripple @click="editPatient(props.row)">
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="blue-10" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.firstName }} {{ props.row.lastName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.ID }}</q-item-label>
                  </q-item-section>

                  <!-- small screen -->
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
                              <q-item-label>Validate</q-item-label>
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
      <q-card style="width: 1000px; max-width: 90vw" class="rounded-borders">
        <q-card-section
          class="bg-gradient-primary text-white q-pa-md row items-center justify-between"
        >
          <div class="text-subtitle1 text-weight-bold q-ml-sm">Patient Information</div>
          <q-btn icon="close" flat round dense v-close-popup class="text-white" />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll" style="max-height: 70vh">
          <div class="text-caption text-weight-medium text-primary q-mb-sm">
            Patient Information
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Full Name</div>
              <div class="text-body2">
                {{ formatFullName(selectedPatient) }}
              </div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Birthdate</div>
              <div class="text-body2">
                {{ formatDate(selectedPatient.BIRTHDATE) }} ({{ selectedPatient.AGE }}
                y/o)
              </div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Birthplace</div>
              <div class="text-body2">{{ selectedPatient.BIRTHPLACE || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Gender</div>
              <div class="text-body2">{{ selectedPatient.gender || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Civil Status</div>
              <div class="text-body2">{{ selectedPatient.CIVILSTATUS || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Occupation</div>
              <div class="text-body2">{{ selectedPatient.OCCUPATION || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Nationality</div>
              <div class="text-body2">{{ selectedPatient.NATIONALITY || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Religion</div>
              <div class="text-body2">{{ selectedPatient.RELIGION || "-" }}</div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />
          <div class="text-caption text-weight-medium text-primary q-mb-sm">
            Residential Address
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Street / House No.</div>
              <div class="text-body2">{{ selectedPatient.ADDRESSSTREET || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Barangay</div>
              <div class="text-body2">{{ selectedPatient.ADDRESSBARANGAY || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">City / Municipality</div>
              <div class="text-body2">{{ selectedPatient.ADDRESSCITY || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Province</div>
              <div class="text-body2">{{ selectedPatient.ADDRESSPROVINCE || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Region</div>
              <div class="text-body2">{{ selectedPatient.ADDRESSREGION || "-" }}</div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />

          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-primary q-mb-sm">
                Emergency & Spouse
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.CPNAME || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Emergency Contact ({{ selectedPatient.CPRELATIONSHIP || "N/A" }})
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center">
                      <q-icon name="phone" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.CPMOBILE || "N/A" }}
                      <span v-if="selectedPatient.CPLANDLINE">
                        / {{ selectedPatient.CPLANDLINE }}
                      </span>
                    </div>
                    <div class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-sm text-grey-6" />
                      <span style="max-width: 90%">
                        {{ selectedPatient.CPADDRESS || "-" }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.SPOUSENAME || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Spouse
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center">
                      <q-icon name="work" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.SPOUSEOCCUPATION || "-" }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="business" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.SPOUSEEMPLOYERCONTACT || "-" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-primary q-mb-sm">
                Parent Information
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.PTFATHERNAME || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Father's Name
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center" v-if="selectedPatient.PTFATHERCONTACT">
                      <q-icon name="phone" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.PTFATHERCONTACT }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-sm text-grey-6" />
                      <span style="max-width: 90%">
                        {{ selectedPatient.PTFATHERADDRESS || "-" }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.PTMOTHERMAIDENNAME || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Mother's Name
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center" v-if="selectedPatient.PTMOTHERCONTACT">
                      <q-icon name="phone" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.PTMOTHERCONTACT }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-sm text-grey-6" />
                      <span style="max-width: 90%">
                        {{ selectedPatient.PTMOTHERADDRESS || "-" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <q-separator dashed class="q-my-sm" />

          <div class="text-caption text-weight-medium text-primary q-mb-sm">
            Government Identification
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.PHILHEALTHID"
                label="PhilHealth ID"
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.SSSGSISID"
                label="SSS / GSIS ID"
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.TINID"
                label="TIN"
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.SENIORID"
                label="Senior / PWD ID"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-pa-md bg-grey-1">
          <q-btn
            unelevated
            label="Send Information to live server"
            color="green-10"
            icon-right="send"
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
          <q-form ref="personalInfoTriage" @submit="updateTriageRecord" class="q-pa-sm">
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
                <q-select
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
                  bg-color="grey-2"
                />
              </div>
              <div class="col-12 col-sm-4 col-md-4 q-mb-md">
                <q-select
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
              <div class="col-12 col-sm-4 col-md-4">
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
              <div class="col-12 col-sm-4 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="formData.painScoreTriage"
                  label="Pain Score *"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>

              <div class="col-12 col-sm-4 col-md-4 q-mb-md">
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
                  class="bg-grey-2"
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

        <q-card-actions align="center" class="text-primary q-mt-md">
          <q-btn flat label="Cancel" v-close-popup />

          <q-btn
            color="blue-10"
            icon-right="upload"
            style="width: 100%; height: 45px; max-width: 150px"
            label="Submit"
            :loading="loading"
            @click="handleSubmitUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
                <q-input outlined dense v-model="formData.caseserviceType" label-slot>
                  <template v-slot:label>
                    Service Type <span class="text-red">*</span>
                  </template>
                </q-input>
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
                <q-input outlined dense v-model="formData.caseerPhysician" label-slot>
                  <template v-slot:label>
                    ER Physician <span class="text-red">*</span>
                  </template>
                </q-input>
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
                <q-input outlined dense v-model="formData.caseCensusInfirmary" label-slot>
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
                  <template v-slot:label> HMO <span class="text-red">*</span> </template>
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
                    App Code <span class="text-red">*</span>
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

    <q-dialog
      v-model="showDuplicateDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="text-negative">
          <div class="text-h6 text-center">
            <q-icon name="warning" class="q-mr-sm" />Possible Duplicate Found
            <div class="text-caption text-grey-8">
              We found existing records that match the details of the patient you are
              trying to register.
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div
            class="row q-col-gutter-xs q-ma-xs q-py-sm text-center bg-green-1 rounded-borders"
          >
            <div class="col">
              <div class="text-caption text-grey-7">Name</div>
              <div class="text-body2 text-weight-bold text-dark">
                {{ formatFullName(selectedPatient) }}
              </div>
            </div>

            <div class="col">
              <div class="text-caption text-grey-7">Birthdate</div>
              <div class="text-body2 text-weight-bold text-dark">
                {{ formatDate(selectedPatient.BIRTHDATE) }}
                <span class="text-grey-7"></span>
              </div>
            </div>

            <div class="col">
              <div class="text-caption text-grey-7">Age</div>
              <div class="text-body2 text-weight-bold text-dark">
                {{ selectedPatient.AGE }}
                <span class="text-grey-7"></span>
              </div>
            </div>
          </div>
          <div class="text-caption text-grey-8 q-mt-md q-mb-sm">
            Select patient you want to link.
          </div>

          <q-markup-table flat bordered>
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
                <td class="text-weight-bold text-negative">
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

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn unelevated label="Cancel" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            label="Ignore & Create New"
            color="primary"
            @click="ignoreDuplicate"
          />

          <q-btn
            v-if="selectedDuplicate"
            unelevated
            label="Link Record"
            color="negative"
            @click="confirmLinkPatient"
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
      "caseNumberDialog",
      "viewPatientValidationDialog",
      "selectedPatient",
    ]),
  },

  mounted() {
    this.fetchPatients();
    this.formData.personnelTriage = this.fullName;
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
      this.updateTriage(row);
      if (!this.formData.dateTriage) {
        const timeStamp = Date.now();
        this.formData.dateTriage = date.formatDate(timeStamp, "YYYY/MM/DD");
      }
    },

    async handleSubmitUpdate() {
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
      await this.updateTriageRecord(signatureString);
    },

    openCaseNumberDialog(row) {
      this.resetForm();
      this.formData.patientId = row.ID;
      this.casenumForm(row);

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
      await this.submitCaseNumber();
    },

    async handleValidatePatient(row) {
      try {
        await this.sendDataInformation(row);

        this.viewPatientValidationDialog = false;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.handleLinkingConflict(error.response.data, row.ID);
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
        ID: this.pendingLinkData.originalId,
      };

      await this.sendDataInformation(payload, true);

      this.viewPatientValidationDialog = false;
    },

    handleAdmit(patient) {
      this.$q
        .dialog({
          title: "Confirm Admission",
          message: `Please confirm that you wish to proceed with the admission for <span class="text-weight-bold text-primary">${patient.fullName}</span>.`,
          html: true,
          persistent: true,
          ok: {
            label: "Send to Credit/Finance",
            color: "primary",
            unelevated: true,
          },
          cancel: {
            label: "Cancel",
            color: "grey-8",
            flat: true,
          },
        })
        .onOk(() => {
          this.admitPatient(patient);
        });
    },

    async handlePrint(row) {
      const data = await this.getPatientFullDetails(row.ID);
      if (data) await this.generateTriagePatientPdf(data);
    },

    async handlePrintTreatment(row) {
      const data = await this.getPatientFullDetails(row.ID);
      if (data) await this.generateEmergencyTreatmentPdf(data);
    },

    async handlePrintConsent(row) {
      const data = await this.getPatientFullDetails(row.ID);
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
