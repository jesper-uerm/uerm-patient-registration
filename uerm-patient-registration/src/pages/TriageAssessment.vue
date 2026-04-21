<template>
  <q-dialog
    v-model="TriageAssessmentFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      class="column no-wrap"
      style="width: 1100px; max-width: 95vw; max-height: 87vh; border-radius: 20px"
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
            <patient-details-triage @next="handleStepOneSuccess" />
          </q-step>

          <q-step :name="2" title="Patient Consent" icon="verified_user" :done="step > 2">
            <patient-consent-triage @prev="step = 1" @submit="handleFinalSubmit" />
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

  data() {
    return {
      localDetailsData: {},
    };
  },

  computed: {
    ...mapWritableState(useTriageStore, [
      "TriageAssessmentFormDialog",
      "step",
      "submitting",
    ]),
  },

  methods: {
    ...mapActions(useTriageStore, ["submitRegistration", "openDialog"]),

    show() {
      this.openDialog();
    },

    handleStepOneSuccess(detailsFromChild) {
      this.localDetailsData = detailsFromChild;
      this.step = 2;
    },

    async handleFinalSubmit() {
      const triageStore = useTriageStore();

      const payload = {
        ...this.localDetailsData,
        ...triageStore.formData,
      };

      console.log("ACTUAL Signature in Store:", triageStore.formData.patientSignature);
      await this.submitRegistration(payload);
    },
  },
};
</script>
<style scoped>
:deep(.q-stepper__dot) {
  font-size: 18px;
  width: 35px;
  height: 35px;
}
:deep(.q-stepper__line) {
  top: 20px;
}
</style>
