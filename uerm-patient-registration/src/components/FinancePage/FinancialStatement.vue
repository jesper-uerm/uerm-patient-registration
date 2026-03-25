<template>
  <q-dialog
    v-model="financialDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
    backdrop-filter="blur(4px)"
    maximized
  >
    <q-card class="column no-wrap">
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad; flex: 0 0 auto"
      >
        <div class="text-h6 text-bold">FINANCIAL STATEMENT FORM</div>
        <div class="text-caption text-white-7" style="line-height: 1.2">
          Please complete the steps below
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

      <q-card-section class="col q-pa-none">
        <div class="row fit">
          <div class="col-12 col-md-7 scroll q-pa-md border-right">
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              done-color="positive"
              animated
              flat
              alternative-labels
            >
              <q-step
                :name="1"
                title="Patient/Person Responsible/Ward"
                icon="person"
                :done="step > 1"
              >
                <patient-source-of-income
                  :local-patient="localPatient"
                  @next="step = 2"
                />
              </q-step>

              <q-step
                :name="2"
                title="Transfer Patient/HMO/MOP"
                icon="person"
                :done="step > 2"
              >
                <transfer-h-m-o
                  :local-patient="localPatient"
                  @prev="step = 1"
                  @next="step = 3"
                />
              </q-step>

              <q-step :name="3" title="Admission" icon="payments" :done="step > 3">
                <admission-patient
                  ref="admisson"
                  @prev="step = 2"
                  @close="financialDialog = false"
                  @submit="updateDetails"
                />
              </q-step>
            </q-stepper>
          </div>

          <div class="col-12 col-md-5 scroll q-pa-md bg-grey-1">
            <q-card flat bordered class="bg-blue-1" style="border-color: #bbdefb">
              <q-card-section class="q-py-sm q-px-md row items-center no-wrap">
                <q-icon name="info" color="blue-8" size="sm" class="q-mr-sm" />
                <div class="text-caption text-blue-9" style="line-height: 1.2">
                  Display record list.
                </div>
              </q-card-section>
            </q-card>

            <!-- <q-table
              flat
              bordered
              :rows="tableRows"
              :columns="tableColumns"
              row-key="id"
              hide-pagination
              separator="horizontal"
              table-header-class="bg-grey-3 text-weight-bold"
            >
              <template v-slot:body-cell-date="props">
                <q-td :props="props" class="text-grey-7">
                  {{ props.row.date }}
                </q-td>
              </template>

              <template v-slot:body-cell-amount="props">
                <q-td :props="props" class="text-weight-bold text-grey-9">
                  {{ props.row.amount }}
                </q-td>
              </template>

              <template v-slot:bottom-row>
                <q-tr class="bg-blue-grey-1">
                  <q-td
                    colspan="2"
                    class="text-right text-weight-bold text-uppercase text-grey-8"
                  >
                    Total Balance:
                  </q-td>
                  <q-td class="text-right text-weight-bolder text-blue-10 text-subtitle2">
                    ₱ 15,500.00
                  </q-td>
                </q-tr>
              </template>
            </q-table> -->
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import PatientSourceOfIncome from "src/components/FinancePage/PatientSourceOfIncome.vue";
import AdmissionPatient from "src/components/FinancePage/AdmissionPatient.vue";
import TransferHMO from "src/components/FinancePage/TransferHMO.vue";
import { useAuthStore } from "src/stores/authStore";

import { mapWritableState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  name: "FinancialStatement",
  components: {
    PatientSourceOfIncome,
    AdmissionPatient,
    TransferHMO,
  },

  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },

  data() {
    return {
      financialDialog: false,
      step: 1,
      localPatient: {},

      tableColumns: [
        { name: "date", label: "Date", field: "date", align: "left", sortable: true },
        {
          name: "description",
          label: "Description",
          field: "description",
          align: "left",
        },
        {
          name: "amount",
          label: "Amount",
          field: "amount",
          align: "right",
          sortable: true,
        },
      ],
      tableRows: [
        {
          id: 1,
          date: "2023-10-01",
          description: "Initial Deposit",
          amount: "₱ 5,000.00",
        },
        { id: 2, date: "2023-10-03", description: "Lab Tests", amount: "₱ 2,500.00" },
        { id: 3, date: "2023-10-05", description: "Room Charge", amount: "₱ 8,000.00" },
      ],
    };
  },

  computed: {
    ...mapWritableState(useFinanceStore, ["submitting"]),
  },

  methods: {
    ...mapActions(useFinanceStore, ["setCurrentPatient", "updatePatientDetails"]),

    openFinancialDialog(patientData) {
      this.step = 1;
      this.localPatient = patientData;

      this.setCurrentPatient(patientData);

      this.financialDialog = true;
    },

    async updateDetails() {
      const result = await this.updatePatientDetails();

      if (result.success) {
        this.$q.notify({
          type: "positive",
          position: "top",
          message: "Financial Statement updated successfully!",
        });

        this.financialDialog = false;

        if (this.$parent && this.$parent.fetchPatients) {
          this.$parent.fetchPatients();
        }
      } else {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: result.error?.response?.data?.message || "Failed to save.",
        });
      }
    },
  },
};
</script>

<style scoped>
.border-right {
  border-right: 1px solid #e0e0e0;
}
@media (max-width: 1023px) {
  .border-right {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}

:deep(.q-stepper__title) {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 8px;
}
:deep(.q-stepper__dot) {
  width: 40px;
  height: 40px;
  font-size: 20px;
}
:deep(.q-stepper__step-inner) {
  padding-top: 0 !important;
}
@media (max-width: 900px) {
  :deep(.q-stepper__title) {
    font-size: 12px;
    letter-spacing: 0px;
    line-height: 1.2;
  }
  :deep(.q-stepper__dot) {
    width: 25px;
    height: 25px;
    font-size: 15px;
  }
  :deep(.q-stepper__tab) {
    padding: 12px;
  }
}
</style>
