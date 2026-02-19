<template>
  <q-dialog
    v-model="financialDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
    backdrop-filter="blur(4px)"
  >
    <q-card
      class="column no-wrap"
      style="width: 1200px; max-width: 95vw; max-height: 95vh"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
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

      <q-card-section class="col scroll">
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
            title="Patient Source Of Income"
            icon="person"
            :done="step > 1"
          >
            <patient-source-of-income
              :form="formData.patientSourceOfIncome"
              :local-patient="localPatient"
              :yesNoOptions="yesNoOptions"
              :mopOptions="mopOptions"
              :ownershipOptions="ownershipOptions"
              :sourceIncomeOptions="sourceIncomeOptions"
              :grossIncomeOptions="grossIncomeOptions"
              :homeOwnershipOptions="homeOwnershipOptions"
              :yearsOfStayOptions="yearsOfStayOptions"
              @update:form="(val) => (formData.patientSourceOfIncome = val)"
              @next="step = 2"
            />
          </q-step>
          <q-step
            :name="2"
            title="Contact Person Source Of Income"
            label="fsafsa"
            icon="person"
            :done="step > 2"
          >
            <contact-person-source-of-income
              :form="formData.ContactPersonSourceOfIncome"
              :local-patient="localPatient"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              :sourceIncomeOptions="sourceIncomeOptions"
              :grossIncomeOptions="grossIncomeOptions"
              :homeOwnershipOptions="homeOwnershipOptions"
              :yearsOfStayOptions="yearsOfStayOptions"
              @update:form="(val) => (formData.ContactPersonSourceOfIncome = val)"
              @prev="step = 1"
              @next="step = 3"
            />
          </q-step>
          <q-step :name="3" title="HMO" icon="payments" :done="step > 3">
            <accredited-h-m-o
              ref="hmoForm"
              :form="formData.hmoForm"
              :mopOptions="mopOptions"
              @update:form="(val) => (formData.hmoForm = val)"
              @prev="step = 2"
              @close="financialDialog = false"
              @submit="updateDetails"
            />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import PatientSourceOfIncome from "src/components/AdminPage/PatientSourceOfIncome.vue";
import AccreditedHMO from "src/components/FinancePage/AccreditedHMO.vue";
import ContactPersonSourceOfIncome from "src/components/FinancePage/ContactPersonSourceOfIncome.vue";

import axios from "axios";

export default {
  name: "FinancialStatement",
  components: {
    PatientSourceOfIncome,
    AccreditedHMO,
    ContactPersonSourceOfIncome,
  },
  data() {
    return {
      financialDialog: false,
      step: 1,
      submitting: false,
      localPatient: {},
      ownershipOptions: ["Owned", "Company", "Mortgaged"],
      grossIncomeOptions: [
        { label: "Below 20k", value: "Below 20k" },
        { label: "20k - 50k", value: "20k - 50k" },
        { label: "Above 50k", value: "Above 50k" },
      ],
      mopOptions: [
        { label: "Cash", value: "Cash" },
        { label: "Credit Card", value: "Credit Card" },
        { label: "Others", value: "Others" },
      ],
      homeOwnershipOptions: [
        { label: "Owned", value: "Owned" },
        { label: "Rented", value: "Rented" },
        { label: "Mortgaged", value: "Mortgaged" },
      ],
      yearsOfStayOptions: [
        { label: "0-1 Year", value: "0-1 Year" },
        { label: "1-5 Years", value: "1-5 Years" },
        { label: "5+ Years", value: "5+ Years" },
      ],

      yesNoOptions: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      sourceIncomeOptions: [
        { label: "Full-Time Employment", value: "Full-Time Employment" },
        { label: "Business", value: "Business" },
        { label: "Remittance", value: "Remittance" },
        { label: "Other", value: "Others" },
      ],

      formData: {
        patientSourceOfIncome: {
          sourceOfIncome: "",
          specificSourceOfIncome: "",
          pt_gross_income: "",
          pt_home_ownership: "",
          pt_years_of_stay: "",
          pthasCar: "",
          carOwnership: "",
          numberOfCars: "",

          mop: "",
          specificmop: "",
          creditCard: "",
          bank: "",
        },
        ContactPersonSourceOfIncome: {
          sourceOfIncomeContactPerson: "",
          specificSourceOfIncomeContactPerson: "",
          cp_gross_income: "",
          cp_home_ownership: "",
          cp_years_of_stay: "",
          cphasCar: "",
          cpcarOwnership: "",
          cpnumberOfCars: "",
        },
        hmo: {
          hmoName: "",
          memberId: "",
          validityDate: "",
          desiredRoom: "",
          informedIncrement: "",
          hmoStaff: "",
          hmoDateTime: "",
        },
        // signature: null,
      },
    };
  },
  methods: {
    openFinancialDialog(patientData) {
      this.step = 1;
      this.localPatient = patientData;
      this.financialDialog = true;
    },

    async updateDetails() {
      try {
        const payload = {
          patientId: this.localPatient.patient_id,
          formData: this.formData,
        };

        await axios.put("http://10.107.0.2:3000/api/auth/updatePatientDetails", payload);

        this.$q.notify({
          type: "positive",
          position: "top",
          message: "Financial Statement updated successfully!",
        });
        this.financialDialog = false;
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Failed to save." });
      }
    },
  },
};
</script>
<style scoped>
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
