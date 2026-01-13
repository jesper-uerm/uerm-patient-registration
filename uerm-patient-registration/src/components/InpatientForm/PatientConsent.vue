<template>
  <q-form ref="patientConsent" @submit.prevent="trySubmit">
    <div class="text-subtitle2 text-bold q-mb-sm">Patient Consent</div>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 q-mb-sm">
          I / We received the following items in good order and condition:
        </div>

        <q-option-group
          v-model="localForm.items"
          :options="itemOptions"
          type="checkbox"
          inline
          color="primary"
        />
        <q-separator class="q-my-md" />
      </div>

      <div class="col-12">
        <div class="text-subtitle2 text-center q-mb-md">Data Privacy Consent</div>

        <div class="q-mx-xl">
          <q-scroll-area
            :style="{ height: $q.screen.lt.sm ? '200px' : '250px' }"
            style="border: 1px solid #e0e0e0; border-radius: 8px"
            class="q-pa-md bg-grey-1 text-justify"
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
      <div class="col-12 items-center">
        <SignaturePad v-model="localSignature" />
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
        color="blue-10"
        icon-right="upload"
        label="Submit"
        class="q-px-lg"
        @click="trySubmit"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import SignaturePad from "src/components/InpatientForm/SignaturePad.vue";

export default {
  name: "PatientConsent",
  components: {
    SignaturePad,
  },
  props: {
    form: {
      type: Object,
      required: true,
      default: () => ({ items: [] }),
    },
    initialSignature: {
      type: String,
      default: null,
    },
  },
  emits: ["update:form", "next", "prev", "submit", "update:signature"],

  data() {
    return {
      localForm: { ...this.form },
      localSignature: this.initialSignature || null,
      hasError: false,

      itemOptions: [
        { label: "UERM Brochure", value: "UERM Brochure" },
        { label: "Admission Kit", value: "Admission Kit" },
        { label: "Patient Satisfaction Survey", value: "Patient Satisfaction Survey" },
      ],
    };
  },

  watch: {
    form: {
      handler(newVal) {
        this.localForm = { ...newVal };
      },
      deep: true,
    },
    localForm: {
      handler(val) {
        this.$emit("update:form", val);
      },
      deep: true,
    },
    localSignature(val) {
      if (val) {
        this.hasError = false;
      }
      this.$emit("update:signature", val);
    },
  },

  methods: {
    async validateFinalStep() {
      const isFormValid = await this.$refs.patientConsent.validate();
      const isSignatureValid = !!this.localSignature && this.localSignature.length > 0;

      this.hasError = !isSignatureValid;

      return isFormValid && isSignatureValid;
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
