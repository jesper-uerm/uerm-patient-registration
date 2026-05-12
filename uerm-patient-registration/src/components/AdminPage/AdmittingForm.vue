<template>
  <q-dialog
    v-model="admittingDialog"
    maximized
    persistent
    transition-show="scale"
    transition-hide="scale"
    backdrop-filter="blur(4px)"
  >
    <q-card class="rounded-borders">
      <!-- style="width: 1500px; max-width: 95vw; display: flex; flex-direction: column" -->
      <q-card-section
        class="text-center text-white q-py-md relative-position"
        style="background-color: #004aad; flex: 0 0 auto"
      >
        <div class="text-h6 text-bold">ADMITTING FORM</div>
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

      <q-card-section class="col q-pa-md scroll">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          done-color="positive"
          animated
          flat
          alternative-labels
        >
          <q-step :name="1" title="Case Information" icon="person" :done="step > 1">
            <case-information :local-patient="localPatient" @next="step = 2" />
          </q-step>

          <q-step :name="2" title="Person Responsible" icon="person" :done="step > 2">
            <person-responsible
              :local-patient="localPatient"
              @prev="step = 1"
              @next="step = 3"
            />
          </q-step>

          <q-step :name="3" title="Patient Physician" icon="payments" :done="step > 3">
            <patient-physician
              ref="admisson"
              @prev="step = 2"
              @close="admittingDialog = false"
              @submit="updateDetails"
            />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import CaseInformation from "src/components/AdminPage/CaseInformation.vue";
import PersonResponsible from "src/components/AdminPage/PersonResponsible.vue";
import PatientPhysician from "src/components/AdminPage/PatientPhysician.vue";

import { mapWritableState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";

export default {
  name: "AdmittingForm",
  components: {
    CaseInformation,
    PersonResponsible,
    PatientPhysician,
  },

  data() {
    return {
      admittingDialog: false,
      step: 1,
      localPatient: {},
    };
  },

  computed: {
    ...mapWritableState(useInpatientStore, ["submitting", "patientRecord", "loading"]),
  },

  methods: {
    ...mapActions(useInpatientStore, [
      "setCurrentPatient",
      "updatePatientDetails",
      "fetchFromErList",
    ]),

    openadmittingDialog(patientData) {
      this.step = 1;
      this.localPatient = patientData;

      this.setCurrentPatient(patientData);

      this.fetchFromErList(patientData.PATIENTNO);

      this.admittingDialog = true;
    },

    // async openadmittingDialog(patientData) {
    //   this.step = 1;
    //   this.localPatient = patientData;
    //   if (!row.CASENO) {
    //     console.error("No CASENO found for this patient record.");
    //     return;
    //   }

    //   this.admittingDialog = true;
    //   await this.fetchPatientDetailsCredit(row.CASENO);
    // },

    // async updateDetails() {
    //   const result = await this.updatePatientDetails();

    //   if (result.success) {
    //     this.$q.notify({
    //       type: "positive",
    //       position: "top",
    //       message: "Financial Statement updated successfully!",
    //     });

    //     this.admittingDialog = false;

    //     if (this.$parent && this.$parent.fetchPatients) {
    //       this.$parent.fetchPatients();
    //     }
    //   } else {
    //     this.$q.notify({
    //       type: "negative",
    //       position: "top",
    //       message: result.error?.response?.data?.message || "Failed to save.",
    //     });
    //   }
    // },
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
