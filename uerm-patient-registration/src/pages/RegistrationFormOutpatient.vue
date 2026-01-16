<template>
  <q-dialog
    v-model="OutpatientregistrationFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1300px; max-width: 95vw; max-height: 95vh; border-radius: 20px"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">OUTPATIENT FORM</div>
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
            <patient-details-outpatient
              :form="formData.personalInfoOutpatient"
              :civilStatusOptions="civilStatusOptions"
              :religionOptions="religionOptions"
              :sameAsPresent="sameAsPresent"
              :sameAsFather="sameAsFather"
              @update:form="(val) => (formData.personalInfoOutpatient = val)"
              @next="step = 2"
            />
          </q-step>

          <q-step :name="2" title="Contact Person" icon="person" :done="step > 2">
            <contact-person
              ref="contactPersonRef"
              :form="formData.contactPersonOutpatient"
              :relationshipOptions="relationshipOptions"
              @update:form="(val) => (formData.contactPersonOutpatient = val)"
              @update:signature="(val) => (formData.signatureOutpatient = val)"
              @prev="step = 1"
              @next="step = 3"
            />
          </q-step>
          <q-step :name="3" title="Patient Consent" icon="security" :done="step > 3">
            <patient-consent
              ref="patientConsentRef"
              :form="formData.patientConsent"
              :relationshipOptions="relationshipOptions"
              @update:form="(val) => (formData.patientConsent = val)"
              @update:signature="(val) => (formData.signatureOutpatient = val)"
              @prev="step = 3"
              @submit="onSubmit"
            />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import ContactPerson from "../components/OutpatientForm/ContactPerson.vue";
import PatientDetailsOutpatient from "../components/OutpatientForm/PatientDetailsOutpatient.vue";
import PatientConsent from "../components/OutpatientForm/PatientConsent.vue";

import axios from "axios";

export default {
  name: "RegistrationFormOutpatient",
  components: {
    PatientDetailsOutpatient,
    ContactPerson,
    PatientConsent,
  },
  data() {
    return {
      OutpatientregistrationFormDialog: false,
      step: 1,
      sameAsPresent: false,
      sameAsFather: false,
      civilStatusOptions: ["Single", "Married", "Widowed", "Separated", "Divorced"],
      religionOptions: ["Roman Catholic", "Christian", "Islam", "Others"],
      relationshipOptions: ["Spouse", "Parent", "Sibling", "Child", "Co-Maker"],
      formData: {
        personalInfoOutpatient: {
          lastNameOutpatient: "",
          firstNameOutpatient: "",
          middleNameOutpatient: "",
          suffixOutpatient: "",
          birthdateOutpatient: "",
          ageOutpatient: "",
          birthplaceOutpatient: "",
          genderOutpatient: null,
          civilStatusOutpatient: null,
          religionOutpatient: null,
          nationalityOutpatient: "",
          occupationOutpatient: "",
          hmoOutpatient: "",
          scidnoOutpatient: "",
          landlineOutpatient: "",
          mobileOutpatient: "",
          outpatientPhilHealth: [],
          // presentAddress: "",
          selectedRegionOutpatient: "",
          selectedProvinceOutpatient: "",
          selectedCityOutpatient: "",
          selectedBarangayOutpatient: "",
          streetNameOutpatient: "",
          permanentAddressOutpatient: "",
        },
        contactPersonOutpatient: {
          contactPersonOutpatient: "",
          contactPersonLandlineOutpatient: "",
          contactPersonNumberOutpatient: "",
          contactPersonRelationship: "",
          outpatientProcedure: "",
          outpatientPhysician: "",
        },
        signatureOutpatient: null,
      },
    };
  },
  methods: {
    show() {
      this.step = 1;
      this.OutpatientregistrationFormDialog = true;
    },

    async validateFinalStep() {
      if (this.$refs.patientConsentRef) {
        const isContactValid = await this.$refs.patientConsentRef.validate();

        const isSignatureValid = !!this.formData.signatureOutpatient;

        if (!isContactValid) {
          this.$q.notify({
            type: "warning",
            message: "Please correct errors in Contact Person details.",
          });
          return false;
        }
        if (!isSignatureValid) {
          this.$q.notify({
            type: "warning",
            message: "Patient Signature is required.",
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
        ...this.formData.personalInfoOutpatient,
        ...this.formData.contactPersonOutpatient,

        signatureOutpatient: this.formData.signatureOutpatient,
        patientType: "Outpatient",
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
          this.OutpatientregistrationFormDialog = false;
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
