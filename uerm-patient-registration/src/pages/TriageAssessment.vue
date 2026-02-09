<template>
  <q-dialog
    v-model="TriageAssessmentFormDialog"
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
          TRIAGE ASSESSMENT FORM
        </div>
        <div class="text-caption text-white-7" style="line-height: 1">
          Please complete the steps below
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="absolute-right"
          :class="$q.screen.lt.sm ? 'q-ma-md' : 'q-ma-lg'"
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
            <patient-details-triage
              :form="formData.personalInfoTriage"
              @update:form="(val) => (formData.personalInfoTriage = val)"
              @next="step = 2"
            />
          </q-step>

          <q-step :name="2" title="Patient Consent" icon="verified_user" :done="step > 2">
            <patient-consent-triage
              :form="formData.PatientConsentTriageForm"
              @update:form="(val) => (formData.PatientConsentTriageForm = val)"
              :initial-signature="formData.patientSignature"
              @update:signature="(val) => (formData.patientSignature = val)"
              @prev="step = 1"
              @submit="onSubmit"
            />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { useTriageStore } from "../stores/triageStore";
import PatientDetailsTriage from "../components/TriageAssessment/PatientDetailsTriage.vue";
import PatientConsentTriage from "../components/TriageAssessment/PatientConsentTriage.vue";

export default {
  name: "TriageAssessment",
  components: {
    PatientDetailsTriage,
    PatientConsentTriage,
  },

  computed: {
    ...mapWritableState(useTriageStore, [
      "TriageAssessmentFormDialog",
      "step",
      "formData",
      "submitting",
    ]),
  },

  methods: {
    ...mapActions(useTriageStore, ["submitRegistration", "openDialog"]),

    show() {
      this.openDialog();
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
</style>
