<template>
  <q-form ref="contactPersonForm" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">
      Person to notify in case of emergency:
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-3 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonOutpatient"
          label="Full Name *"
          :rules="[(val) => !!val || 'Please input valid name']"
        />
      </div>
      <div class="col-4 col-md-3 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonNumberOutpatient"
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
      <div class="col-4 col-md-3 col-sm-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonLandlineOutpatient"
          label="Landline No. *"
          mask="(##) ####-####"
          unmasked-value
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-3 col-sm-6">
        <q-select
          outlined
          dense
          v-model="localForm.contactPersonRelationshipOutpatient"
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
        icon-right="arrow_forward"
        label="Next"
        @click="onNext"
      />
    </q-stepper-navigation>
  </q-form>
</template>

<script>
export default {
  name: "contactPersonOutpatient",

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
    async onNext() {
      const isValid = await this.$refs.contactPersonForm.validate();

      if (!isValid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill all required fields.",
          position: "top",
        });
        return;
      }

      this.$emit("next");
    },

    onBack() {
      this.$emit("prev");
    },
  },
};
</script>

<style scoped></style>
