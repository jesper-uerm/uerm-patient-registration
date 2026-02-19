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
              Patient List Search
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
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
          @row-click="(evt, row) => viewPatient(row)"
        >
          <template v-slot:body-cell-patient_id="props">
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

          <template v-slot:body-cell-forReview="props">
            <q-td :props="props">
              <q-badge v-if="props.value == 0" color="red-6" label="For Review" outline />

              <q-badge
                v-else-if="props.value == 1"
                color="green-6"
                label="Reviewed"
                outline
              />

              <q-badge v-else color="grey-6" label="Emergency Patient" outline />
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 150px">
              <div class="ellipsis text-grey-7">
                {{ formData.addressPresent }}
                <q-tooltip>{{ formData.addressPresent }}</q-tooltip>
              </div>
            </q-td>
          </template>

          <!-- large/mmedium screen -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center" @click.stop>
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item clickable @click="handlePrint(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Record</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="blue-10" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.firstName }} {{ props.row.lastName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.patient_id }}</q-item-label>
                    <q-item-label caption="">
                      Status:
                      <span v-if="props.row.forReview == 0" class="text-red">
                        For Review
                      </span>
                      <span v-else-if="props.row.forReview == 1" class="text-green">
                        Reviewed
                      </span>
                      <span v-else>
                        {{ props.row.patient_id }}
                      </span>
                    </q-item-label>
                  </q-item-section>

                  <!-- small screen -->
                  <q-item-section side>
                    <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                      <q-menu cover auto-close>
                        <q-list style="min-width: 150px">
                          <q-item clickable @click="handlePrint(props.row)">
                            <q-item-section avatar>
                              <q-icon name="print" color="green-8" />
                            </q-item-section>
                            <q-item-section>Print Record</q-item-section>
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

    <q-dialog v-model="viewDialog" transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md">
          <div class="row items-center text-center justify-center justify-between">
            <div class="row items-center text-uppercase">
              <div class="text-subtitle2 text-weight-bold header-title">
                Patient Profile
              </div>
            </div>

            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              class="text-white opacity-70"
              aria-label="Close"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll" style="max-height: 60vh">
          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="person" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-body2 text-weight-medium">
                  {{ selectedPatient.lastName }}, {{ selectedPatient.firstName }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon
                  :name="selectedPatient.gender === 'Male' ? 'male' : 'female'"
                  color="grey-6"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Gender</q-item-label>
                <q-item-label class="text-body2">
                  {{ selectedPatient.gender }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate</q-item-label>
                <q-item-label class="text-body2">
                  {{ formatDate(selectedPatient.birthdate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Contact Information
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="place" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Present Address</q-item-label>
                <q-item-label class="text-body2">
                  {{ selectedPatient.addressPresent || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="phone" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Mobile Number</q-item-label>
                <q-item-label class="text-body2">
                  {{ selectedPatient.mobile || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-pa-md bg-grey-1">
          <q-btn
            unelevated
            label="Update Patient Finance"
            color="blue-10"
            @click="updateFinanceStatement(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
                {{ formatDate(selectedPatient.birthdate) }} ({{ selectedPatient.age }}
                y/o)
              </div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Birthplace</div>
              <div class="text-body2">{{ selectedPatient.birthplace || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Gender</div>
              <div class="text-body2">{{ selectedPatient.gender || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Civil Status</div>
              <div class="text-body2">{{ selectedPatient.civilStatus || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Occupation</div>
              <div class="text-body2">{{ selectedPatient.occupation || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Nationality</div>
              <div class="text-body2">{{ selectedPatient.nationality || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Religion</div>
              <div class="text-body2">{{ selectedPatient.religion || "-" }}</div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />
          <div class="text-caption text-weight-medium text-primary q-mb-sm">
            Residential Address
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Street / House No.</div>
              <div class="text-body2">{{ selectedPatient.addressStreet || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Barangay</div>
              <div class="text-body2">{{ selectedPatient.addressBarangay || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">City / Municipality</div>
              <div class="text-body2">{{ selectedPatient.addressCity || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Province</div>
              <div class="text-body2">{{ selectedPatient.addressProvince || "-" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Region</div>
              <div class="text-body2">{{ selectedPatient.addressRegion || "-" }}</div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />

          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-primary q-mb-sm">
                Emergency & Spouse
              </div>

              <div>
                <div class="q-mb-lg">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.cpName || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Emergency Contact ({{ selectedPatient.cpRelationship }})
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center">
                      <q-icon name="phone" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.cpMobile || "N/A" }}
                      <span v-if="selectedPatient.cpLandline">
                        / {{ selectedPatient.cpLandline }}</span
                      >
                    </div>
                    <div class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-sm text-grey-6" />
                      <span style="max-width: 90%">{{
                        selectedPatient.cpAddress || "-"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.spouseName || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Spouse
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center">
                      <q-icon name="work" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.spouseOccupation || "-" }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="business" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.spouseEmployerContact || "-" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-primary q-mb-sm">
                Parent Information
              </div>

              <div>
                <div class="q-mb-lg">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.ptFatherName || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Father's Name
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center" v-if="selectedPatient.ptFatherContact">
                      <q-icon name="phone" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.ptFatherContact }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-sm text-grey-6" />
                      <span style="max-width: 90%">{{
                        selectedPatient.ptFatherAddress || "-"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.ptMotherMaidenName || "-" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Mother's Name
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center" v-if="selectedPatient.ptMotherContact">
                      <q-icon name="phone" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.ptMotherContact }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-sm text-grey-6" />
                      <span style="max-width: 90%">{{
                        selectedPatient.ptMotherAddress || "-"
                      }}</span>
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
                v-model="selectedPatient.philhealthId"
                label="PhilHealth ID"
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.sssgsisId"
                label="SSS / GSIS ID"
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.tinID"
                label="TIN"
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input
                readonly
                dense
                outlined
                v-model="selectedPatient.seniorId"
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
            <div class="text-subtitle1 text-bold q-mb-md">Vital Signs:</div>

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
                  v-model="formData.personnelTriage"
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

        <q-card-actions align="center" class="text-primary q-py-md">
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

    <financial-statement ref="financialStatementRef" />
  </q-page>
</template>

<script>
import FinancialStatement from "src/components/FinancePage/FinancialStatement.vue";

import { date } from "quasar";
import { mapState, mapActions, mapWritableState } from "pinia";
import { useTriageStore } from "src/stores/triageStore";

import SignaturePad from "src/components/TriageAssessment/SignaturePad.vue";
import { printEmergencyTreatment } from "src/composables/printEmergencyTreatment";
import { printInpatientInformation } from "src/composables/printInpatientInformation";

export default {
  name: "PatientList",
  components: { SignaturePad, FinancialStatement },

  setup() {
    const { generateEmergencyTreatmentPdf } = printEmergencyTreatment();
    const { generatePatientPdf } = printInpatientInformation();

    return {
      generateEmergencyTreatmentPdf,
      generatePatientPdf,
    };
  },

  data() {
    return {
      searchQuery: "",
      localSignature: null,
      hasError: false,
      viewDialog: false,

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
          name: "forReview",
          label: "Status",
          field: "forReview",
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
    ...mapState(useTriageStore, ["patientList", "loading", "hasSearched", "formData"]),

    ...mapWritableState(useTriageStore, [
      "selectedPatient",
      "triageDialog",
      "viewPatientValidationDialog",
    ]),
  },

  mounted() {
    this.fetchPatientsFinance();
  },

  watch: {
    "formData.personnelSignature"(val) {
      if (val) this.hasError = false;
    },
  },

  methods: {
    ...mapActions(useTriageStore, [
      "fetchPatientsFinance",
      "searchPatients",
      "updateTriage",
      "updateTriageRecord",
      "admitPatient",
      "sendDataInformation",
      "getPatientFullDetails",
    ]),

    viewPatient(row) {
      this.selectedPatient = row;
      this.viewDialog = true;
    },

    updateFinanceStatement(row) {
      this.$refs.financialStatementRef.openFinancialDialog(row);
      this.viewDialog = false;
    },

    handleSearch() {
      if (!this.searchQuery) {
        this.fetchPatients();
        return;
      }
      this.searchPatients(this.searchQuery);
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

    handleValidatePatient(row) {
      this.sendDataInformation(row);
    },

    handleSendData(patient) {
      this.sendDataInformation(patient);
    },

    handleAdmit(patient) {
      this.$q
        .dialog({
          title: "Confirm Admission",
          message: `Are you sure you want to mark <b>${patient.fullName}</b> for admission?`,
          html: true,
          persistent: true,
        })
        .onOk(() => {
          this.admitPatient(patient);
        });
    },

    async handlePrint(row) {
      const data = await this.getPatientFullDetails(row.patient_id);
      if (data) await this.generatePatientPdf(data);
    },

    async handlePrintTreatment(row) {
      const data = await this.getPatientFullDetails(row.patient_id);
      if (data) await this.generateEmergencyTreatmentPdf(data);
    },

    async handlePrintConsent(row) {
      const data = await this.getPatientFullDetails(row.patient_id);
      if (data) await this.generatePatientConsentPdf(data);
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },

    formatFullName(p) {
      if (!p) return "";
      const parts = [p.firstName, p.middleName, p.lastName].filter(Boolean);
      let fullName = parts.join(" ");
      if (p.suffix) fullName += ` ${p.suffix}`;
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
