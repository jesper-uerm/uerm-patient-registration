<template>
  <q-form ref="contactPersonForm">
    <div class="text-subtitle1 text-bold q-mb-md">
      Person to notify in case of emergency:
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonOutpatient"
          label="Full Name *"
          :rules="[(val) => !!val || 'Please input valid name']"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.contactNumberOutpatient"
          label="Mobile No. *"
          mask="####-###-####"
          unmasked-value
          :rules="[
            (val) => !!val || 'Please input mobile number',
            (val) => val.length === 11 || 'Must be 11 digits',
          ]"
        >
          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="localForm.contactPersonRelationship"
          :options="relationshipOptions"
          label="Relationship"
        />
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-separator class="q-my-sm" />
          <div class="text-subtitle1 text-bold q-mb-md">Medical Details:</div>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="localForm.outpatientProcedure"
                label="Procedure"
              />
            </div>
            <div class="col-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="localForm.outpatientPhysician"
                label="Attending Physician"
              />
            </div>
          </div>
          <q-separator class="q-my-md" />
        </div>
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 text-center">
          <div class="text-subtitle2">CERTIFICATION</div>
        </div>
        <div class="q-mx-xl">
          <div class="text-body2 text-justify text-grey-9">
            1. I / We hereby certify that the information provided herein is true and
            correct to the best of my / our knowledge.
          </div>
          <div class="text-body2 q-mt-sm text-justify text-grey-9">
            2. I / We further agree to bind myself / ourselves to the terms of the
            attached memorandum of undertaking and terms and conditions for inpatients.
          </div>
          <div class="text-body2 q-mt-sm text-justify text-grey-9">
            3. I / We authorize the Center and its authorized personnel to process all
            information I / we provided...
          </div>
        </div>
        <div class="col-12 items-center">
          <SignaturePadOutpatient v-model="localSignature" />
          <div
            v-if="hasError"
            class="col-12 text-center text-negative text-caption q-mt-sm"
          >
            <q-icon name="warning" class="q-mr-xs" /> Signature is required to proceed.
          </div>
        </div>
      </div>
    </div>
    <q-stepper-navigation class="text-center q-gutter-md">
      <q-btn
        style="width: 100%; height: 45px; max-width: 130px"
        color="amber-14"
        icon="arrow_back"
        label="Back"
        @click="onBack"
      />
      <q-btn
        style="width: 100%; height: 45px; max-width: 130px"
        color="blue-10"
        icon-right="upload"
        label="Submit"
        @click="trySubmit"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
import SignaturePadOutpatient from "src/components/OutpatientForm/SignaturePadOutpatient.vue";

export default {
  name: "contactPersonOutpatient",
  components: {
    SignaturePadOutpatient,
  },
  props: {
    form: Object,
    relationshipOptions: Array,
    initialSignature: {
      type: String,
      default: null,
    },
  },
  emits: ["update:form", "next", "prev", "submit", "update:signature"],
  data() {
    return {
      localForm: {
        ...this.form,
      },
      localSignature: this.initialSignature || null,
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
    localSignature(val) {
      if (val) {
        this.hasError = false;
        this.$emit("update:signature", val);
      }
    },
  },
  methods: {
    async validate() {
      const isFormValid = await this.$refs.contactPersonForm.validate();

      const isSignatureValid = !!this.localSignature;

      this.hasError = !isSignatureValid;

      return isFormValid && isSignatureValid;
    },

    async trySubmit() {
      const valid = await this.validate();

      if (valid) {
        this.$emit("submit");
      } else {
        this.$q.notify({
          type: "warning",
          position: "top",
          message: "Please fill all fields and provide a signature.",
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
