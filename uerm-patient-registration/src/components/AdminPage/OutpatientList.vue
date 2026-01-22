<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card
      class="column no-shadow"
      style="border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <q-card-section class="col-auto q-py-md q-px-lg" style="background-color: #004aad">
        <div class="row items-center text-left justify-left text-uppercase">
          <div>
            <div
              class="text-h6 text-white text-weight-bold"
              style="letter-spacing: -0.5px"
            >
              Outpatient Search
            </div>
            <div class="text-caption text-grey-5">
              Search database for outpatient records
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
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item clickable @click="viewPatient(props.row)">
                      <q-item-section avatar>
                        <q-icon name="visibility" color="blue-10" />
                      </q-item-section>
                      <q-item-section>View Profile</q-item-section>
                    </q-item>

                    <q-item clickable @click="validatePatient(props.row)">
                      <q-item-section avatar>
                        <q-icon name="check" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Validate</q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item clickable @click="handlePrint(props.row)">
                      <q-item-section avatar>
                        <q-icon name="print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Record</q-item-section>
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
                          <q-item clickable @click="validatePatient(props.row)">
                            <q-item-section avatar>
                              <q-icon name="check" size="xs" />
                            </q-item-section>
                            <q-item-section>Validate Information</q-item-section>
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
                            <q-item-section>Print Information</q-item-section>
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
                Enter ID or Name to search
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

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Admission Details
          </div>
          <div class="bg-grey-1 q-pa-md rounded-borders text-grey-8">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <span class="text-weight-bold block q-mb-xs">Status:</span>
                <q-badge
                  class="text-subtitle2 q-px-md q-py-sm"
                  :color="
                    selectedPatient.patientType === 'Inpatient' ? 'green' : 'orange'
                  "
                >
                  {{ selectedPatient.patientType || "N/A" }}
                </q-badge>
              </div>
              <div class="col-12 col-sm-4">
                <span class="text-weight-bold block q-mb-xs">Date Admitted:</span>
                {{ formatDate(selectedPatient.createdAt) || "N/A" }}
              </div>
              <div class="col-12 col-sm-4">
                <span class="text-weight-bold block q-mb-xs">Attending Physician:</span>
                <div class="ellipsis">
                  {{ selectedPatient.physician || "N/A" }}
                  <q-tooltip>{{ selectedPatient.physician }}</q-tooltip>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-pa-md bg-grey-1">
          <!-- <q-btn flat label="Close" color="grey-8" v-close-popup /> -->
          <q-btn
            unelevated
            label="Update Financial Statement"
            color="blue-10"
            @click="updateFinanceStatement(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="viewPatientValidationDialog"
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
          <div class="text-overline text-primary q-mb-sm">Parent Information</div>
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
              <div class="text-body2">{{ selectedPatient.birthplace || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Gender</div>
              <div class="text-body2">{{ selectedPatient.gender || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Civil Status</div>
              <div class="text-body2">{{ selectedPatient.civilStatus || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Occupation</div>
              <div class="text-body2">{{ selectedPatient.occupation || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Nationality</div>
              <div class="text-body2">{{ selectedPatient.nationality || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Religion</div>
              <div class="text-body2">{{ selectedPatient.religion || "N/A" }}</div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />
          <div class="text-overline text-primary q-mb-sm">Residential Address</div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Street / House No.</div>
              <div class="text-body2">{{ selectedPatient.addressStreet || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Barangay</div>
              <div class="text-body2">{{ selectedPatient.addressBarangay || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">City / Municipality</div>
              <div class="text-body2">{{ selectedPatient.addressCity || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Province</div>
              <div class="text-body2">{{ selectedPatient.addressProvince || "N/A" }}</div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="text-caption text-grey">Region</div>
              <div class="text-body2">{{ selectedPatient.addressRegion || "N/A" }}</div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />

          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="text-overline text-primary q-mb-sm">Emergency & Spouse</div>

              <div style="border-left: 3px solid #1976d2; padding-left: 16px">
                <div class="q-mb-lg">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.cpName || "N/A" }}
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
                        selectedPatient.cpAddress || "N/A"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.spouseName || "N/A" }}
                  </div>
                  <div class="text-caption text-grey-6 text-uppercase q-mb-xs">
                    Spouse
                  </div>

                  <div class="text-caption text-grey-9 q-gutter-y-xs">
                    <div class="row items-center">
                      <q-icon name="work" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.spouseOccupation || "N/A" }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="business" size="14px" class="q-mr-sm text-grey-6" />
                      {{ selectedPatient.spouseEmployerContact || "N/A" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-overline text-primary q-mb-sm">Parent Information</div>

              <div style="border-left: 3px solid #1976d2; padding-left: 16px">
                <div class="q-mb-lg">
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.ptFatherName || "N/A" }}
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
                        selectedPatient.ptFatherAddress || "N/A"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="text-subtitle2 text-weight-bold">
                    {{ selectedPatient.ptMotherMaidenNam || "N/A" }}
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
                        selectedPatient.ptMotherAddress || "N/A"
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <q-separator dashed class="q-my-sm" />
          <div class="text-overline text-primary q-mb-sm">Government Identification</div>
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
            @click="validateInformation(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <financial-statement ref="financialRef" />
  </q-page>
</template>

<script>
import { date } from "quasar";
import axios from "axios";

import FinancialStatement from "./FinancialStatement.vue";

import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printPatientConsent } from "src/composables/printPatientConsent";

export default {
  name: "OutpatientList",
  components: {
    FinancialStatement,
  },

  setup() {
    const { generatePatientPdf } = printInpatientInformation();
    const { generatePatientConsentPdf } = printPatientConsent();

    return { generatePatientPdf, generatePatientConsentPdf };
  },

  data() {
    return {
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],
      viewDialog: false,
      viewPatientValidationDialog: false,
      selectedPatient: {},

      columns: [
        {
          name: "patient_id",
          label: "ID",
          field: "patient_id",
          align: "left",
          sortable: true,
          style: "width: 80px",
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
          align: "right",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 180px",
        },
        {
          name: "gender",
          label: "Sex",
          field: "gender",
          align: "center",
          style: "width: 200px",
        },
        {
          name: "addressPresent",
          label: "Address",
          field: "addressPresent",
          align: "left",
          classes: "ellipsis",
          style: "max-width: 250px; min-width: 150px",
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
          "http://10.107.0.2:3000/api/auth/fetchOutpatient"
        );
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load Outpatient List",
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
          "http://10.107.0.2:3000/api/auth/searchOutpatient",
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

    validatePatient(row) {
      this.selectedPatient = row;
      this.viewPatientValidationDialog = true;
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

    updateFinanceStatement(row) {
      this.$refs.financialRef.openFinancialDialog(row);
      this.viewDialog = false;
    },

    async validateInformation(patient) {
      if (!patient) return;

      const errors = [];
      if (!patient.patient_id) errors.push("Patient ID");
      if (!patient.lastName) errors.push("Last Name");
      if (!patient.firstName) errors.push("First Name");

      if (errors.length > 0) {
        this.$q.notify({
          type: "warning",
          message: `Cannot transfer. Missing: ${errors.join(", ")}`,
          position: "top",
        });
        return;
      }

      this.loading = true;
      try {
        await axios.post("http://10.107.0.2:3000/api/auth/sendDataInformation", {
          patient_id: patient.patient_id,
        });

        this.$q.notify({
          type: "positive",
          message: "Data successfully sent to live server.",
        });

        this.viewPatientValidationDialog = false;
        this.loadInitialData();
      } catch (error) {
        if (!error.response || error.response.status !== 409) {
          console.error(error);
        }

        if (error.response && error.response.status === 409) {
          const {
            existingPatientNo,
            firstName,
            lastName,
            middleName,
            suffix,
            birthdate,
          } = error.response.data;

          const formattedBirthdate = new Date(birthdate).toLocaleDateString();

          const fullName = `${firstName} ${middleName || ""} ${lastName} ${suffix || ""}`
            .trim()
            .replace(/\s+/g, " ");

          this.$q
            .dialog({
              title: '<span class="text-negative">Patient Record Already Exists"</span>',
              message: `
                      <div class="q-mb-md">
                        This patient already exists in the Hospital System.
                      </div>

                      <div style="background: #fff3e0; padding: 10px; border-radius: 4px; border: 1px solid #ffe0b2;">
                        <div class="row no-wrap q-mb-xs">
                          <span class="text-grey-8" style="min-width: 100px;">Patient No:</span>
                          <span class="text-weight-bold text-primary">${existingPatientNo}</span>
                        </div>
                        <div class="row no-wrap q-mb-xs">
                          <span class="text-grey-8" style="min-width: 100px;">Name:</span>
                          <span class="text-weight-bold">${fullName}</span>
                        </div>
                        <div class="row no-wrap">
                          <span class="text-grey-8" style="min-width: 100px;">Birthday:</span>
                          <span class="text-weight-bold">${formattedBirthdate}</span>
                        </div>
                      </div>

                      <div class="q-mt-md text-weight-medium">
                        Do you want to link this registration to the existing record?
                        <br><span class="text-caption text-grey-7">(This will update the Registration ID to match the Hospital Patient No)</span>
                      </div>
                    `,
              html: true,
              persistent: true,
              ok: {
                label: "Yes, Link Records",
                color: "primary",
                flat: false,
              },
              cancel: {
                label: "No, Cancel",
                color: "negative",
                flat: true,
              },
            })
            .onOk(async () => {
              this.loading = true;
              try {
                await axios.post(
                  "http://10.107.0.2:3000/api/auth/linkExistingPatientInfo",
                  {
                    patient_id: patient.patient_id,
                    patientno: existingPatientNo,
                  }
                );

                this.$q.notify({
                  type: "positive",
                  message: "Patient record linked successfully!",
                });

                this.viewPatientValidationDialog = false;
                this.loadInitialData();
              } catch (linkError) {
                console.error("Linking failed:", linkError);
                this.$q.notify({
                  type: "negative",
                  message:
                    linkError.response?.data?.message ||
                    "Failed to link records. Please try again.",
                });
              } finally {
                this.loading = false;
              }
            })
            .onCancel(() => {});
        } else {
          this.$q.notify({
            type: "negative",
            message:
              error.response?.data?.message ||
              "Failed to send data. Please check connection.",
          });
        }
      } finally {
        if (this.loading) this.loading = false;
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
```
