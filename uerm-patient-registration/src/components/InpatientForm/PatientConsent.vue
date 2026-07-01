<template>
  <q-form ref="patientConsent" @submit.prevent="trySubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2 text-center q-mb-md">Data Privacy Consent</div>

        <div class="q-mx-xs">
          <q-scroll-area
            :style="{ height: $q.screen.lt.sm ? '200px' : '350px' }"
            style="border: 1px solid #e0e0e0; border-radius: 8px"
            class="q-pa-xl bg-grey-1 text-justify"
          >
            <p>
              <strong>1. Data Collection & Usage:</strong>
              In accordance with the
              <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, I hereby
              authorize UERM Memorial Medical Center to collect, process, and store my
              personal data for the purpose of medical records, hospital administration,
              and insurance processing.
            </p>
            <p>
              <strong>2. Confidentiality:</strong>
              UERM ensures that all personal information is treated with strict
              confidentiality and is accessed only by authorized personnel.
            </p>
            <p>
              <strong>3. Third-Party Sharing:</strong>
              My data may be shared with PhilHealth, HMOs, and other regulatory bodies as
              required by law or for the facilitation of my medical benefits.
            </p>
            <p>
              <strong>4. Data Retention:</strong>
              My records will be retained in accordance with the hospital's retention
              policy and applicable laws.
            </p>
            <p>
              By signing below, I acknowledge that I have read and understood this Data
              Privacy Consent form.
            </p>
          </q-scroll-area>
        </div>
      </div>

      <div class="col-12 col-md-6 items-center">
        <div class="text-caption text-center text-grey-8 q-mb-xs">
          Patient / Relative Signature <span class="text-red">*</span>
        </div>

        <SignaturePad v-model="formData.consent.signature" />

        <div
          v-if="hasError"
          class="col-12 text-center text-negative text-caption q-mt-sm"
        >
          <q-icon name="warning" class="q-mr-xs" />
          Signature is required to proceed.
        </div>
      </div>

      <div class="col-12 col-md-6 items-center">
        <div class="text-caption text-center text-grey-8 q-mb-xs">
          AIS Personnel Name/Signature <span class="text-red">*</span>
        </div>

        <q-input
          v-if="!formData.consent.admittingOfficerSignature"
          v-model="formData.consent.admittingOfficerName"
          outlined
          dense
          class="q-mb-sm"
          input-class="text-center"
        />

        <SignaturePad v-model="formData.consent.admittingOfficerSignature" />

        <div
          v-if="hasOfficerError"
          class="col-12 text-center text-negative text-caption q-mt-sm"
        >
          <q-icon name="warning" class="q-mr-xs" />
          Admitting officer name and signature are required.
        </div>
      </div>
    </div>

    <q-stepper-navigation class="row justify-center q-gutter-md q-mt-md">
      <q-btn
        unelevated
        color="orange-10"
        icon-right="arrow_back"
        label="Back"
        style="width: 130px"
        @click="onBack"
      />
      <q-btn
        unelevated
        color="blue-10"
        icon-right="upload"
        label="Submit"
        style="width: 130px"
        @click="trySubmit"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import { mapWritableState } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";
import SignaturePad from "src/components/InpatientForm/SignaturePad.vue";

export default {
  name: "PatientConsent",
  components: {
    SignaturePad,
  },
  emits: ["prev", "submit"],

  data() {
    return {
      hasError: false,
      hasOfficerError: false,
    };
  },

  computed: {
    ...mapWritableState(useInpatientStore, ["formData", "appOptions"]),
  },

  methods: {
    async validateFinalStep() {
      const isFormValid = await this.$refs.patientConsent.validate();

      const signature = this.formData.consent.signature;
      const isSignatureValid = !!signature && signature.length > 0;

      const officerName = this.formData.consent.admittingOfficerName;
      const isOfficerNameValid = !!officerName?.trim();

      const admittingOfficerSignature = this.formData.consent.admittingOfficerSignature;
      const isOfficerSignatureValid =
        !!admittingOfficerSignature && admittingOfficerSignature.length > 0;

      this.hasError = !isSignatureValid;
      this.hasOfficerError = !isOfficerNameValid || !isOfficerSignatureValid;

      return (
        isFormValid && isSignatureValid && isOfficerNameValid && isOfficerSignatureValid
      );
    },

    async trySubmit() {
      const valid = await this.validateFinalStep();

      if (valid) {
        this.$emit("submit");
      } else {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Please ensure the form is complete and signed.",
        });
      }
    },

    onBack() {
      this.$emit("prev");
    },
  },
};
</script>
