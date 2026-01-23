<template>
  <q-dialog
    v-model="TriageAssessmentFormDialog"
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
        <div class="text-h6 text-bold">TRIAGE ASSESSMENT FORM</div>
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
            <patient-details-triage
              :form="formData.personalInfoTriage"
              @update:form="(val) => (formData.personalInfoTriage = val)"
              :initial-signature="formData.personnelSignature"
              @update:signature="(val) => (formData.personnelSignature = val)"
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
import PatientDetailsTriage from "../components/TriageAssessment/PatientDetailsTriage.vue";
import PatientConsentTriage from "../components/TriageAssessment/PatientConsentTriage.vue";
import axios from "axios";

export default {
  name: "TraigeAssessment",
  components: {
    PatientDetailsTriage,
    PatientConsentTriage,
  },
  data() {
    return {
      TriageAssessmentFormDialog: false,
      step: 1,
      submitting: false,

      formData: {
        personalInfoTriage: {
          lastNameTriage: "",
          firstNameTriage: "",
          middleNameTriage: "",
          suffixTriage: "",
          birthdateTriage: "",
          ageTriage: "",
          genderTriage: "",
          chiefComplaintTriage: "",
          tempTriage: "",
          heartRateTriage: "",
          oxygenTriage: "",
          bpTriage: "",
          respiRateTriage: "",
          painScoreTriage: "",
          avpuTriage: "",
          contagiousTriage: "",
          isolationPrecautionTriage: "",
          cpdTriage: "",
          levelTriage: "",
          remarksTriage: "",
          checkforPresense: [],
          personnelTriage: "",
          dateTriage: "",
        },
        // Consent Data (if any fields exist besides signature)
        PatientConsentTriageForm: {},

        personnelSignature: null,
        patientSignature: null,
      },
    };
  },

  methods: {
    show() {
      this.step = 1;
      this.TriageAssessmentFormDialog = true;
    },

    async onSubmit() {
      if (!this.formData.personnelSignature) {
        this.$q.notify({
          type: "warning",
          message: "Step 1 incomplete: Personnel Signature is required.",
          position: "top",
        });
        this.step = 1;
        return;
      }

      if (!this.formData.patientSignature) {
        this.$q.notify({
          type: "warning",
          message: "Step 2 incomplete: Patient Consent Signature is required.",
          position: "top",
        });
        return;
      }

      if (this.submitting) return;
      this.submitting = true;
      this.$q.loading.show({ message: "Submitting Registration..." });

      const finalData = {
        ...this.formData.personalInfoTriage,
        patientType: "Emergency",
        personnelSignature: this.formData.personnelSignature,
        patientSignature: this.formData.patientSignature,
      };

      try {
        await axios.post("http://10.107.0.2:3000/api/auth/registerTriage", finalData);

        this.$q.notify({
          type: "positive",
          message: "Registration Successful!",
          position: "top",
          timeout: 4000,
        });

        setTimeout(() => {
          this.TriageAssessmentFormDialog = false;
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
</style>
