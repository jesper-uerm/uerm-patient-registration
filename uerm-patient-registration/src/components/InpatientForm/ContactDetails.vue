<template>
  <q-form ref="contactDetails" @submit="onNext">
    <div class="text-subtitle2 text-bold q-mb-md">Government ID's:</div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.seniorpwd"
          type="number"
          label="Senior/PWD No."
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.philhealthId"
          type="number"
          label="PhilHealth No."
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.sssgsis"
          type="number"
          label="SSS/GSIS No."
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input outlined dense v-model="localForm.tin" type="number" label="TIN No." />
      </div>
      <div class="col-4 col-md-4">
        <q-input outlined dense v-model="localForm.others" type="number" label="Others" />
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2">Spouse Details:</div>
      </div>
      <div class="col-4 col-md-4 q-mb-md">
        <q-input
          outlined
          dense
          v-model="localForm.spouseName"
          label="Spouse's Full Name"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input outlined dense v-model="localForm.spouseOccupation" label="Occupation" />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          mask="####-###-####"
          unmasked-value
          v-model="localForm.spouseEmployerContact"
          label="Employer Contact"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.spouseEmployerName"
          label="Employer Name"
        />
      </div>
      <div class="col-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.spouseEmployerAddress"
          label="Employer Address"
        />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2">Contact Person:</div>
      </div>
      <div class="col-8 col-md-8">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatient"
          label="Full Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-select
          outlined
          dense
          v-model="localForm.contactPersonInpatientRelationship"
          :options="relationshipOptions"
          label="Relationship *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientEmail"
          type="email"
          label="Email Address"
        />
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientMobile"
          label="Mobile Number *"
          mask="####-###-####"
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:append>
            <q-icon name="smartphone" />
          </template>
        </q-input>
      </div>
      <div class="col-4 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientLandline"
          label="Landline"
          mask="(##) ####-####"
        >
          <template v-slot:append>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientAddress"
          type="textarea"
          rows="1"
          label="Home Address *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
    </div>

    <q-stepper-navigation class="text-center q-gutter-md">
      <q-btn
        style="width: 100%; height: 45px; max-width: 120px"
        color="orange-10"
        icon="arrow_back"
        label="Back"
        @click="onBack"
      />
      <q-btn
        style="width: 100%; height: 45px; max-width: 120px"
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
  props: {
    form: Object,
    yesNoOptions: Array,
    sourceIncomeOptions: Array,
    ownershipOptions: Array,
    relationshipOptions: Array,
  },
  emits: ["update:form", "next", "prev"],
  data() {
    return {
      localForm: {
        ...this.form,
      },
    };
  },
  watch: {
    localForm: {
      handler(val) {
        this.$emit("update:form", val);
      },
      deep: true,
    },
  },
  methods: {
    async validate() {
      return await this.$refs.contactDetails.validate();
    },
    async onNext() {
      const isValid = await this.validate();
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
    resetCarData(value) {
      if (value === "no") {
        this.localForm.carOwnership = null;
        this.localForm.numberOfCars = "";
      }
    },
  },
};
</script>
