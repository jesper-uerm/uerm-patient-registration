<template>
  <q-dialog
    v-model="regFormdialogVisible"
    backdrop-filter="blur(4px)"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1300px; max-width: 95vw; max-height: 87vh; border-radius: 20px"
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div :class="$q.screen.lt.sm ? 'text-subtitle2 text-bold' : 'text-h6 text-bold'">
          INPATIENT FORM
        </div>
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
          :alternative-labels="!$q.screen.lt.sm"
          :contracted="$q.screen.lt.sm"
        >
          <q-step :name="1" title="Personal Info" icon="person" :done="step > 1">
            <patient-details
              :form="formData.personalInfo"
              :civilStatusOptions="civilStatusOptions"
              :religionOptions="religionOptions"
              :sameAsPresent="formData.toggles.sameAsPresent"
              :sameAsFather="formData.toggles.sameAsFather"
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
import { defineComponent } from "vue";
import { mapWritableState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";

import ContactDetails from "src/components/InpatientForm/ContactDetails.vue";
import PatientDetails from "src/components/InpatientForm/PatientDetails.vue";
import ModeOfPayment from "src/components/InpatientForm/PatientConsent.vue";

export default defineComponent({
  name: "RegistrationForm",
  components: {
    PatientDetails,
    ContactDetails,
    ModeOfPayment,
  },

  computed: {
    ...mapWritableState(useInpatientStore, [
      "regFormdialogVisible",
      "step",
      "formData",
      "submitting",
      "civilStatusOptions",
      "religionOptions",
      "ownershipOptions",
      "relationshipOptions",
      "mopOptions",
      "yesNoOptions",
      "sourceIncomeOptions",
    ]),
  },

  methods: {
    ...mapActions(useInpatientStore, ["openForm", "registerPatient"]),

    show() {
      this.openForm();
    },

    openFormDialog(patientData) {
      this.openForm(patientData);
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
      const isValid = await this.validateFinalStep();
      if (!isValid) return;

      await this.registerPatient();
    },
  },
});
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
