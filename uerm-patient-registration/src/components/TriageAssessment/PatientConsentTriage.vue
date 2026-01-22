<template>
  <q-form ref="consentFormRef" @submit.prevent="trySubmit">
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
              <strong
                >By signing below, I acknowledge that I have read and understood this Data
                Privacy Consent form.</strong
              >
            </p>
          </q-scroll-area>
        </div>
      </div>

      <div class="col-12 items-center q-mt-md">
        <div class="text-caption text-center text-grey-8 q-mb-xs">
          Patient / Relative Signature *
        </div>
        <div :class="hasError ? 'bg-red-1' : ''" style="border-radius: 4px; padding: 4px">
          <SignaturePad v-model="localConsentSignature" />
        </div>

        <div
          v-if="hasError"
          class="col-12 text-center text-negative text-caption q-mt-sm"
        >
          <q-icon name="warning" class="q-mr-xs" />
          Signature is required to proceed.
        </div>
      </div>
    </div>

    <q-stepper-navigation class="row justify-center q-gutter-md q-mt-lg">
      <q-btn
        flat
        color="orange-10"
        icon="arrow_back"
        label="Back"
        class="q-px-lg"
        @click="onBack"
      />
      <q-btn
        unelevated
        type="submit"
        color="blue-10"
        icon-right="upload"
        label="Submit"
        class="q-px-lg"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import SignaturePad from "src/components/TriageAssessment/SignaturePad.vue";

export default {
  name: "PatientConsentTriage",
  components: {
    SignaturePad,
  },
  props: {
    form: Object,
    initialSignature: {
      type: String,
      default: null,
    },
  },
  emits: ["update:form", "next", "prev", "submit", "update:signature"],
  data() {
    return {
      localForm: { ...this.form },
      localConsentSignature: this.initialSignature || null,
      hasError: false,
    };
  },
  watch: {
    localForm: {
      handler(val) {
        this.$emit("update:form", val);
      },
      deep: true,
    },
    localConsentSignature(val) {
      if (val) {
        this.hasError = false;
        this.$emit("update:signature", val);
      }
    },
    initialSignature(val) {
      if (val !== this.localConsentSignature) {
        this.localConsentSignature = val;
      }
    },
  },
  methods: {
    async trySubmit() {
      const isSignatureValid = !!this.localConsentSignature;

      if (isSignatureValid) {
        this.hasError = false;
        this.$emit("submit");
      } else {
        this.hasError = true;
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Please sign the consent form to proceed.",
        });
      }
    },

    onBack() {
      this.$emit("prev");
    },
  },
};
</script>

<style scoped></style>
