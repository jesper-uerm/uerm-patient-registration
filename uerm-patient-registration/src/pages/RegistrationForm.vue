<template>
  <q-dialog v-model="dialogVisible" persistent transition-show="scale" transition-hide="scale">

    <q-card class="column no-wrap" style="width: 1300px; max-width: 95vw; max-height: 85vh;">

      <q-card-section class="bg-primary text-white text-center q-py-xs relative-position">
        <div class="text-h6">Patient Registration</div>
        <div class="text-subtitle2">Follow the steps below</div>

        <q-btn icon="close" flat round dense v-close-popup class="absolute-right q-ma-md" />
      </q-card-section>

      <q-card-section class="col scroll">
        <q-stepper v-model="step" ref="stepper" color="primary" animated flat>

          <q-step :name="1" title="Personal Info" icon="person" :done="step > 1">
            <patient-details
              :form="formData.personalInfo"
              :civilStatusOptions="civilStatusOptions"
              :religionOptions="religionOptions"
              :sameAsPresent="sameAsPresent"
              :sameAsFather="sameAsFather"
              @update:form="(val) => (formData.personalInfo = val)"
              @next="step = 2"
            />
          </q-step>

          <q-step :name="2" title="Occupation Details" icon="business_center" :done="step > 2">
            <source-of-income
              :form="formData.sourceOfIncome"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              :sourceIncomeOptions="sourceIncomeOptions"
              @update:form="(val) => (formData.sourceOfIncome = val)"
              @next="step = 3"
              @prev="step = 1"
            />
          </q-step>

          <q-step :name="3" title="Guarantor Details" icon="call" :done="step > 3">
            <guarantor-details
              :form="formData.guarantorInfo"
              :relationshipOptions="relationshipOptions"
              :yesNoOptions="yesNoOptions"
              :ownershipOptions="ownershipOptions"
              @update:form="(val) => (formData.guarantorInfo = val)"
              @next="step = 4"
              @prev="step = 2"
            />
          </q-step>

          <q-step :name="4" title="Mode of Payment" icon="payments" :done="step > 4">
            <mode-of-payment
              :form="formData.modeOfPayment"
              :mopOptions="mopOptions"
              :initial-signature="formData.signature"
              @update:signature="(val) => formData.signature = val"
              @update:form="(val) => (formData.modeOfPayment = val)"
              @next="submitForm"
              @prev="step = 3"
            />
          </q-step>

        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import GuarantorDetails from "src/components/InpatientForm/GuarantorDetails.vue";
import PatientDetails from "src/components/InpatientForm/PatientDetails.vue";
import SourceOfIncome from "src/components/InpatientForm/SourceOfIncome.vue";
import ModeOfPayment from "src/components/InpatientForm/ModeOfPayment.vue";

export default {
  name: 'RegistrationForm',
  components: {
    GuarantorDetails,
    PatientDetails,
    SourceOfIncome,
    ModeOfPayment,
  },
  data() {
    return {
      dialogVisible: false,
      step: 1,
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
        personalInfo: { lastName: "", firstName: "", middleName: "", age: "", gender: null, civilStatus: null, religion: null, landline: "", mobile: "", email: "", birthdate: "", birthplace: "", nationality: "", presentAddress: "", permanentAddress: "", fathersName: "", fathersAddress: "", fatherContactNumber: "", mothersName: "", mothersAddress: "", motherContactNumber: "" },
        sourceOfIncome: { sourceOfIncome: "", specificSourceOfIncome: "", seniorpwd: "", philhealth: "", sssgsis: "", tin: "", others: "", pt_gross_income: [], pt_home_ownership: [], pt_years_of_stay: [], spouseName: "", spouseOccupation: "", spouseEmployerContact: "", pthasCar: "no", hasCar: "no", carOwnership: null, numberOfCars: "" },
        guarantorInfo: { resp1_fullname: "", resp1_relationship: null, resp1_landline: "", resp1_mobile: "", resp1_email: "", resp1_address: "", resp1_occupation: "", resp1_contact_no: "", resp1_employer_address: "", resp1_source_income: [], resp1_gross_income: [], resp1_home_ownership: [], resp1_years_of_stay: [] },
        modeOfPayment: { mop: "", specificmop: "", creditCard: "", bank: "", items: [] },
        signature: null
      },
    };
  },
  methods: {
    show() {
      this.step = 1;
      this.dialogVisible = true;
    },
    submitForm() {
      console.log("Submitting:", this.formData);
      this.$q.notify({ type: 'positive', message: 'Registration Submitted!' });
      this.dialogVisible = false;
    }
  }
};
</script>
