<template>
  <q-dialog
    v-model="regFormdialogVisible"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1300px; max-width: 95vw; max-height: 90vh; border-radius: 20px"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">INPATIENT FORM</div>
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

          <q-step :name="2" title="Contact Details" icon="person" :done="step > 2">
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
          </q-step>

          <q-step :name="3" title="Patient Consent" icon="security" :done="step > 3">
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
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import ContactDetails from "src/components/InpatientForm/ContactDetails.vue";
import PatientDetails from "src/components/InpatientForm/PatientDetails.vue";
import ModeOfPayment from "src/components/InpatientForm/PatientConsent.vue";

import axios from "axios";

export default {
  name: "RegistrationForm",
  components: {
    PatientDetails,
    ContactDetails,
    ModeOfPayment,
  },

  data() {
    return {
      regFormdialogVisible: false,
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
        personalInfo: {
          lastName: "",
          firstName: "",
          middleName: "",
          suffix: "",
          age: "",
          gender: null,
          civilStatus: null,
          religion: null,
          landline: "",
          mobile: "",
          email: "",
          occupation: "",
          birthdate: "",
          birthplace: "",
          nationality: "",
          // presentAddress: "",
          selectedRegion: "",
          selectedProvince: "",
          selectedCity: "",
          selectedBarangay: "",
          streetName: "",
          permanentAddress: "",
          fathersName: "",
          fathersAddress: "",
          fatherContactNumber: "",
          mothersName: "",
          mothersAddress: "",
          motherContactNumber: "",
        },
        contactDetails: {
          seniorpwd: "",
          philhealth: "",
          sssgsis: "",
          tin: "",
          others: "",
          spouseName: "",
          spouseOccupation: "",
          spouseEmployerContact: "",
          spouseEmployerName: "",
          spouseEmployerAddress: "",
          contactPersonInpatient: "",
          contactPersonInpatientRelationship: null,
          contactPersonInpatientLandline: "",
          contactPersonInpatientMobile: "",
          contactPersonInpatientEmail: "",
          contactPersonInpatientAddress: "",
          contactPersonInpatientOccupation: "",
          contactPersonInpatientEmployerNumber: "",
        },
        patientConsent: {
          mop: "",
          specificmop: "",
          creditCard: "",
          bank: "",
          items: [],
        },
        signature: null,
      },
    };
  },
  methods: {
    show() {
      this.step = 1;
      this.regFormdialogVisible = true;
    },

    async validateFinalStep() {
      if (this.$refs.patientConsent) {
        const isFormValid = await this.$refs.patientConsent.validateFinalStep();

        if (!isFormValid) {
          this.$q.notify({
            type: "warning",
            position: "top",
            message: "Please correct errors in Payment Details.",
          });
          return false;
        }

        return true;
      }
      return false;
    },

    async onSubmit() {
      if (this.submitting) return;

      const isValid = await this.validateFinalStep();
      if (!isValid) return;

      this.submitting = true;
      this.$q.loading.show({ message: "Submitting Registration..." });

      const finalData = {
        ...this.formData.personalInfo,
        ...this.formData.contactDetails,
        ...this.formData.patientConsent,

        signature: this.formData.signature,
        patientType: "Inpatient",
      };

      try {
        const response = await axios.post(
          "http://10.107.0.2:3000/api/auth/register",

          finalData
        );

        this.$q.notify({
          type: "positive",
          message: "Registration Successful! ID: " + (response.data.patientId || "Saved"),
          position: "top",
          timeout: 4000,
        });
        setTimeout(() => {
          this.regFormdialogVisible = false;
        }, 1500);
      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Server Error: Could not save.";

        this.$q.notify({
          type: "negative",
          message: errorMsg,
          position: "top",
        });
      } finally {
        this.submitting = false;
        this.$q.loading.hide();
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
    width: 30px;
    height: 30px;
    font-size: 15px;
  }
  :deep(.q-stepper__tab) {
    padding: 12px;
  }
}
</style>
