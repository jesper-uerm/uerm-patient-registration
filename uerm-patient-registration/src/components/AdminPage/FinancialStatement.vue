<template>
  <q-dialog
    v-model="financialDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1000px; max-width: 95vw; max-height: 90vh"
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
          <q-step :name="1" title="Source of Income" icon="person" :done="step > 1">
            <patient-source-of-income
              :form="formData.patientSourceOfIncome"
              :local-patient="localPatient"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              :sourceIncomeOptions="sourceIncomeOptions"
              :relationshipOptions="relationshipOptions"
              @update:form="(val) => (formData.contactDetails = val)"
              @next="step = 2"
            />
          </q-step>

          <!-- <q-step :name="2" title="Contact Details" icon="person" :done="step > 2">
            <contact-details
              :form="formData.contactDetails"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              :sourceIncomeOptions="sourceIncomeOptions"
              :relationshipOptions="relationshipOptions"
              @update:form="(val) => (formData.contactDetails = val)"
              @next="step = 3"
              @prev="step = 1"
            />
          </q-step> -->

          <!-- <q-step :name="3" title="Guarantor Details" icon="person" :done="step > 3">
            <guarantor-details
              :form="formData.guarantorInfo"
              :relationshipOptions="relationshipOptions"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              @update:form="(val) => (formData.guarantorInfo = val)"
              @next="step = 4"
              @prev="step = 2"
            />
          </q-step> -->
          <!--
          <q-step :name="3" title="Patient Consent" icon="payments" :done="step > 3">
            <mode-of-payment
              ref="patientConsent"
              :form="formData.patientConsent"
              :mopOptions="mopOptions"
              :initial-signature="formData.signature"
              @update:signature="(val) => (formData.signature = val)"
              @update:form="(val) => (formData.patientConsent = val)"
              @prev="step = 2"
              @close="regFormdialogVisible = false"
              @submit="onSubmit"
            />
          </q-step> -->
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import PatientSourceOfIncome from "src/components/AdminPage/PatientSourceOfIncome.vue";
// import axios from "axios";

export default {
  name: "FinancialStatement",
  components: {
    PatientSourceOfIncome,
  },
  data() {
    return {
      financialDialog: false,
      step: 1,
      submitting: false,
      sameAsPresent: false,
      sameAsFather: false,
      civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
      religionOptions: ["Roman Catholic", "Christian", "Islam", "Others"],
      ownershipOptions: ["Owned", "Company", "Mortgaged"],
      relationshipOptions: ["Spouse", "Parent", "Sibling", "Child", "Co-Maker"],
      mopOptions: [
        { label: "Cash", value: "Cash" },
        { label: "Credit Card", value: "Credit Card" },
        { label: "Others", value: "Others" },
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
        contactDetails: {
          sourceOfIncome: "",
          specificSourceOfIncome: "",
          pt_gross_income: "",
          pt_home_ownership: "",
          pt_years_of_stay: "",
          pthasCar: "",
          carOwnership: "",
        },
        guarantorInfo: {
          contactPersonInpatientIncome: "",
          contactPersonInpatientGross: "",
          contactPersonInpatientHome: "",
          contactPersonInpatientHomeStay: "",
          contactPersonInpatienthasCar: "",
          contactPersonInpatientcarOwnership: null,
          contactPersonInpatientnumberOfCars: "",
          // },
          patientConsent: {
            mop: "",
            specificmop: "",
            creditCard: "",
            bank: "",
            items: [],
          },
          signature: null,
        },
      },
    };
  },
  methods: {
    openFinancialDialog(patientData) {
      this.step = 1;
      this.localPatient = patientData;
      this.financialDialog = true;
    },
    //   async validateFinalStep() {
    //     if (this.$refs.patientConsent) {
    //       const isPaymentValid = await this.$refs.patientConsent.validate();

    //       const isSignatureValid = !!this.formData.signature;

    //       if (!isPaymentValid) {
    //         this.$q.notify({
    //           type: "warning",
    //           position: "top",
    //           message: "Please correct errors in Payment Details.",
    //         });
    //         return false;
    //       }

    //       if (!isSignatureValid) {
    //         return false;
    //       }

    //       return true;
    //     }

    //     return false;
    //   },

    //   async onSubmit() {
    //     if (this.submitting) return;

    //     const isValid = await this.validateFinalStep();
    //     if (!isValid) return;

    //     this.submitting = true;
    //     this.$q.loading.show({ message: "Submitting Registration..." });

    //     const finalData = {
    //       ...this.formData.personalInfo,
    //       ...this.formData.contactDetails,
    //       ...this.formData.patientConsent,
    //       // ...this.formData.guarantorInfo,

    //       signature: this.formData.signature,
    //       patientType: "Inpatient",
    //     };

    //     try {
    //       const response = await axios.post(
    //         "http://localhost:3000/api/auth/register",
    //         finalData
    //       );

    //       this.$q.notify({
    //         type: "positive",
    //         message: "Registration Successful! ID: " + (response.data.patientId || "Saved"),
    //         position: "top",
    //         timeout: 4000,
    //       });
    //       setTimeout(() => {
    //         this.regFormdialogVisible = false;
    //       }, 1500);
    //     } catch (error) {
    //       console.error(error);
    //       const errorMsg = error.response?.data?.message || "Server Error: Could not save.";

    //       this.$q.notify({
    //         type: "negative",
    //         message: errorMsg,
    //         position: "top",
    //       });
    //     } finally {
    //       this.submitting = false;
    //       this.$q.loading.hide();
    //     }
    //   },
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
    padding: 4px;
  }
}
</style>
