<template>
  <q-form ref="contactPerson" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-xs">Contact Person:</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatient"
          label="Full Name *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-12 col-md-4">
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
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientEmail"
          type="email"
          label="Email Address"
        />
      </div>
      <div class="col-12 col-md-4">
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
      <div class="col-12 col-md-4">
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
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientOccupation"
          label="Occupation/Employer"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientEmployerNumber"
          mask="####-###-####"
          unmasked-value
          label="Employer Contact No"
        />
      </div>
      <div class="col-12">
        <q-input
          outlined
          dense
          v-model="localForm.contactPersonInpatientEmployerAddress"
          label="Employer Address"
        />
      </div>
    </div>
    <q-separator class="q-my-sm" />
    <div class="row q-col-gutter-md">
      <q-field
        class="col-12 col-sm-6 col-md-3"
        :model-value="localForm.contactPersonInpatientIncome"
        :rules="[(val) => !!val || 'Please select an income source.']"
        lazy-rules
        dense
        borderless
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Source of Income</div>

            <q-radio
              v-model="localForm.contactPersonInpatientIncome"
              val="Salary"
              label="Salary"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientIncome"
              val="Business"
              label="Business"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientIncome"
              val="Remittance"
              label="Remittance"
            />
          </div>
        </template>
      </q-field>
      <q-field
        class="col-12 col-sm-6 col-md-3"
        :model-value="localForm.contactPersonInpatientGross"
        :rules="[(val) => !!val || 'Please select a Gross Income.']"
        lazy-rules
        dense
        borderless
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Gross Income</div>

            <q-radio
              v-model="localForm.contactPersonInpatientGross"
              val="Below 20k"
              label="Below 20k"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientGross"
              val="20k - 50k"
              label="20k - 50k"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientGross"
              val="Above 50k"
              label="Above 50k"
            />
          </div>
        </template>
      </q-field>
      <q-field
        class="col-12 col-sm-6 col-md-3"
        :model-value="localForm.contactPersonInpatientHome"
        :rules="[(val) => !!val || 'Please select home ownership.']"
        lazy-rules
        dense
        borderless
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Home Ownership</div>

            <q-radio
              v-model="localForm.contactPersonInpatientHome"
              val="Owned"
              label="Owned"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientHome"
              val="Rented"
              label="Rented"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientHome"
              val="Mortgaged"
              label="Mortgaged"
            />
          </div>
        </template>
      </q-field>
      <q-field
        class="col-12 col-sm-6 col-md-3"
        :model-value="localForm.contactPersonInpatientHomeStay"
        :rules="[(val) => !!val || 'Please select years of stay.']"
        lazy-rules
        dense
        borderless
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Years of Stay</div>

            <q-radio
              v-model="localForm.contactPersonInpatientHomeStay"
              val="0-1 Year"
              label="0-1 Year"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientHomeStay"
              val="1-5 Years"
              label="1-5 Years"
            />
            <q-radio
              v-model="localForm.contactPersonInpatientHomeStay"
              val="5+ Years"
              label="5+ Years"
            />
          </div>
        </template>
      </q-field>
    </div>
    <div class="row q-col-gutter-md items-center">
      <div class="col-12 col-md-12">
        <q-separator class="q-my-sm" />
        <div class="text-subtitle2 q-mb-xs">Do you have a car?</div>
        <q-option-group
          v-model="localForm.contactPersonInpatienthasCar"
          :options="yesNoOptions"
          color="primary"
          inline
          @update:model-value="resetCarData"
        />
      </div>
      <div
        class="col-12 col-md-12"
        v-if="localForm.contactPersonInpatienthasCar === 'yes'"
      >
        <q-select
          outlined
          dense
          v-model="localForm.contactPersonInpatientcarOwnership"
          :options="ownershipOptions"
          label="Ownership Type *"
          lazy-rules
          :rules="[(val) => !!val || 'Required']"
          emit-value
          map-options
        />
      </div>
      <div
        class="col-12 col-md-12"
        v-if="localForm.contactPersonInpatienthasCar === 'yes'"
      >
        <q-input
          outlined
          dense
          type="number"
          v-model="localForm.contactPersonInpatientnumberOfCars"
          label="Number of Cars *"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Required',
            (val) => val > 0 || 'Min 1',
          ]"
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
      return await this.$refs.contactPerson.validate();
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
        this.localForm.contactPersonInpatientcarOwnership = null;
        this.localForm.contactPersonInpatientnumberOfCars = "";
      }
    },
  },
};
</script>
