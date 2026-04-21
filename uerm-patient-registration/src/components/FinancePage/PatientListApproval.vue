<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0; border-radius: 8px">
      <q-card-section class="col-auto q-py-md q-px-lg bg-blue-10 text-white">
        <div class="row items-center text-uppercase">
          <div>
            <div class="text-h6 text-weight-bold" style="letter-spacing: -0.5px">
              Patient List Search
            </div>
            <div class="text-caption text-blue-2">
              Search database for patient records awaiting financial approval
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
          :disable="loading"
          class="bg-white"
          debounce="500"
          @update:model-value="handleSearch"
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
          flat
          class="clean-table fit"
          row-key="CASENO"
          :rows="patientListApproval"
          :columns="columns"
          :loading="loading"
          :grid="$q.screen.lt.sm"
          :rows-per-page-options="[10]"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
          @row-click="(evt, row) => openDetails(row)"
        >
          <template v-slot:body-cell-PATIENTNO="props">
            <q-td :props="props">
              <span class="text-grey-8 text-weight-bold">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium text-uppercase">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="text-center">
              <q-badge
                v-if="props.value == 1"
                outline
                color="positive"
                label="Approved"
              />

              <q-badge
                v-else-if="props.value == 0"
                outline
                color="negative"
                label="Declined"
              />

              <q-badge v-else color="orange-8" label="Pending" outline />
            </q-td>
          </template>

          <template v-slot:body-cell-DATEAD="props">
            <q-td :props="props">
              <q-chip outline square color="blue-8" size="sm" class="text-weight-bold">
                {{ props.value }}
              </q-chip>
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
                    <q-item-label class="text-weight-bold text-blue-10 text-uppercase">
                      {{ props.row.fullName }}
                    </q-item-label>
                    <q-item-label caption
                      >Case: {{ props.row.CASENO }} | ID:
                      {{ props.row.PATIENTNO }}</q-item-label
                    >
                    <q-item-label caption>
                      Status:
                      <span v-if="props.row.forReview === 0" class="text-red"
                        >For Review</span
                      >
                      <span v-else-if="props.row.forReview === 1" class="text-green"
                        >Reviewed</span
                      >
                      <span v-else>{{ props.row.STATUS || "N/A" }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row no-wrap">
                      <q-btn
                        flat
                        round
                        color="blue-8"
                        icon="visibility"
                        size="sm"
                        @click.stop="openDetails(props.row)"
                      />
                    </div>
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
                Ready to Search Patients
              </div>
              <div class="text-subtitle1" v-else>
                No patients found matching "{{ searchQuery }}"
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <financial-statement ref="financialStatementRef" />

    <q-dialog
      v-model="detailsDialog"
      maximized
      ransition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section
          class="column text-center text-white q-py-md relative-position"
          style="background-color: #004aad; flex: 0 0 auto"
        >
          <div class="text-h6 text-bold">PATIENT ASSESSMENT DETAILS</div>
          <div class="text-caption text-white-7" style="line-height: 1.2">
            Please review information below
          </div>
          <q-btn
            icon="close"
            flats
            round
            dense
            v-close-popup
            class="absolute-right q-ma-lg"
          />
        </q-card-section>

        <q-card-section
          class="q-px-xl q-py-lg scroll"
          style="max-height: 75vh"
          v-if="patientDetails && !detailsLoading"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Case & Patient No.
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Case No."
                v-model="patientDetails.CASENO"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Patient No."
                v-model="patientDetails.PATIENTNO"
              />
            </div>

            <div class="col-12 q-mt-xs">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Admission & Medical Info
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Admitting Physician"
                v-model="patientDetails.ADM_PHYSICIAN"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Department"
                v-model="patientDetails.DEPARTMENT"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Room Admission"
                v-model="patientDetails.ROOM_ADMISSION"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Admission Status"
                v-model="patientDetails.ADMISSION_STATUS"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Attending Physician"
                v-model="patientDetails.ATT_PHYSICIAN"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Contact Physician"
                v-model="patientDetails.CONTACT_PHYSICIAN"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Admission Procedure"
                v-model="patientDetails.ADM_PROCEDURE"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Length of Stay"
                v-model="patientDetails.LENGTH_STAY"
              />
            </div>

            <div class="col-12 q-mt-xs">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Insurance & Payment (HMO/PHIC)
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-4">
              <q-input outlined dense readonly label="HMO" v-model="patientDetails.HMO" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="HMO Initial Status"
                v-model="patientDetails.HMO_INITIAL_STATUS"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Mode of Payment (MOP)"
                v-model="patientDetails.MOP"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="PHIC Status"
                v-model="patientDetails.PHIC_STATUS"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="PHIC Number"
                v-model="patientDetails.PHIC_NUM"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="PHIC Remarks"
                v-model="patientDetails.PHIC_REMARKS"
              />
            </div>

            <div class="col-12 q-mt-xs">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Financial & Deposit
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Cost"
                v-model="patientDetails.COST"
                prefix="₱"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="OR Deposit"
                v-model="patientDetails.OR_DEPOSIT"
                prefix="₱"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Required Deposit"
                v-model="patientDetails.REQ_DEPOSIT"
                prefix="₱"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="To Deposit"
                v-model="patientDetails.TO_DEPOSIT"
                prefix="₱"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="To Follow Deposit"
                v-model="patientDetails.TO_FOLLOW_DEPOSIT"
                prefix="₱"
              />
            </div>

            <div class="col-12 q-mt-xs">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Transfer Information
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Transferred From"
                v-model="patientDetails.TRANS_FROM"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Reason of Transfer"
                v-model="patientDetails.REASON_OF_TRANSFER"
              />
            </div>
            <div class="col-12">
              <q-input
                outlined
                dense
                readonly
                label="Transfer Remarks"
                v-model="patientDetails.REMARKS_TRANSFER"
                type="textarea"
                rows="2"
              />
            </div>

            <div class="col-12 q-mt-xs">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Service & Pay Records
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="SSS Card Class"
                v-model="patientDetails.SSS_CARD_CLASS"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                readonly
                label="Exp Date"
                v-model="patientDetails.EXP_DATE"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Visit Type (Service)"
                v-model="patientDetails.VISIT_TYPE_SER"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Num Admission (Service)"
                v-model="patientDetails.NUM_ADMISSION_SER"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Last Adm Date (Service)"
                v-model="patientDetails.LAST_ADM_DATE_SER"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Coordinated By (Service)"
                v-model="patientDetails.COORDINATED_BY_SER"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Visit Type (Pay)"
                v-model="patientDetails.VISIT_TYPE_PAY"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Num Admission (Pay)"
                v-model="patientDetails.NUM_ADMISSION_PAY"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Last Adm Date (Pay)"
                v-model="patientDetails.LAST_ADM_DATE_PAY"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                outlined
                dense
                readonly
                label="Coordinated By (Pay)"
                v-model="patientDetails.COORDINATED_BY_PAY"
              />
            </div>

            <div class="col-12 q-mt-xs">
              <div class="text-subtitle2 text-blue-9 text-uppercase text-weight-bold">
                Assessment Status
              </div>
              <q-separator />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Evaluated By"
                v-model="patientDetails.EVALUATED_BY"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Status"
                v-model="patientDetails.STATUS"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                dense
                readonly
                label="Approved By"
                v-model="patientDetails.APPROVED_BY"
              />
            </div>
            <div class="col-12">
              <q-input
                outlined
                dense
                readonly
                label="Admission Remarks"
                v-model="patientDetails.ADM_REMARKS"
                type="textarea"
                rows="2"
              />
            </div>
          </div>
        </q-card-section>

        <q-inner-loading
          :showing="detailsLoading"
          label="Fetching assessment details..."
          label-class="text-blue-10 q-mt-sm"
          label-style="font-size: 1.1em"
        >
          <q-spinner-gears size="50px" color="blue-10" />
        </q-inner-loading>

        <q-separator />

        <q-card-actions align="center" class="q-gutter-md q-pa-xl">
          <q-btn
            unelevated
            icon="cancel"
            label="Disapprove"
            color="red-7"
            @click="handleDisapprove(patientDetails)"
            :disable="
              detailsLoading || !patientDetails || patientDetails.IS_APPROVED !== null
            "
          />

          <q-btn
            unelevated
            icon="check_circle"
            label="Approve"
            color="green-7"
            @click="handleApprove(patientDetails)"
            :disable="
              detailsLoading || !patientDetails || patientDetails.IS_APPROVED !== null
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import FinancialStatement from "src/components/FinancePage/FinancialStatement.vue";
import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  name: "PatientFinanceListApproval",

  components: {
    FinancialStatement,
  },

  data() {
    return {
      searchQuery: "",
      detailsDialog: false,
      columns: [
        // {
        //   name: "PATIENTNO",
        //   label: "Patient No.",
        //   field: "PATIENTNO",
        //   align: "center",
        //   sortable: true,
        //   style: "width: 120px;",
        //   format: (val) => (Array.isArray(val) ? val[0] : val || "N/A"),
        // },
        {
          name: "CASENO",
          label: "Case No.",
          field: "CASENO",
          align: "center",
          sortable: true,
          style: "width: 120px; font-weight: bold",
          format: (val) => val || "N/A",
        },
        {
          name: "fullName",
          label: "Name",
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
          style: "width: 120px",
        },

        {
          name: "DATEAD",
          label: "Date Added",
          field: "DATEAD",
          align: "center",
          sortable: true,
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY h:mm A") : "-"),
          style: "width: 180px",
        },

        {
          name: "status",
          label: "Status",
          field: "IS_APPROVED",
          align: "center",
          sortable: true,
          style: "width: 120px",
        },
      ],
    };
  },

  computed: {
    ...mapState(useFinanceStore, [
      "patientListApproval",
      "loading",
      "hasSearched",
      "patientDetails",
      "detailsLoading",
    ]),
  },

  mounted() {
    this.fetchPatientsFinanceApproval();
  },

  methods: {
    ...mapActions(useFinanceStore, [
      "fetchPatientsFinanceApproval",
      "searchPatientListApproval",
      "fetchPatientDetailsCredit",
      "approvePatient",
      "disapprovePatient",
    ]),

    handleSearch() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.fetchPatientsFinanceApproval();
      } else {
        this.searchPatientListApproval(query);
      }
    },

    async openDetails(row) {
      if (!row.CASENO) {
        console.error("No CASENO found for this patient record.");
        return;
      }

      this.detailsDialog = true;
      await this.fetchPatientDetailsCredit(row.CASENO);
    },

    async handleApprove(patient) {
      await this.approvePatient(patient);
      this.detailsDialog = false;
    },

    async handleDisapprove(patient) {
      await this.disapprovePatient(patient);
      this.detailsDialog = false;
    },
  },
};
</script>

<style scoped>
.clean-table :deep(.q-table__top),
.clean-table :deep(.q-table__bottom),
.clean-table :deep(thead tr:first-child th) {
  border-bottom: 1px solid #e0e0e0;
}

.clean-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  background-color: #f8f9fa;
}

.clean-table :deep(tbody tr:hover) {
  background: #f1f8ff !important; /* Slight blue tint on hover to match theme */
}
</style>
