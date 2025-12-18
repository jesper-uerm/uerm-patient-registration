<template>
  <q-form ref="contactDetails" @submit="onNext">
    <div class="text-subtitle1 text-bold q-mb-md">Government ID's:</div>
    <!-- <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-field
          borderless
          :model-value="localForm.sourceOfIncome"
          :rules="[(val) => !!val || 'Please provide source of income.']"
          dense
        >
          <template v-slot:control>
            <q-option-group
              v-model="localForm.sourceOfIncome"
              :options="sourceIncomeOptions"
              color="primary"
              inline
              emit-value
              map-options
            />
          </template>
        </q-field>
        <q-slide-transition>
          <div v-if="localForm.sourceOfIncome === 'Others'" class="q-mt-sm">
            <q-input
              outlined
              dense
              v-model="localForm.specificSourceOfIncome"
              label="Please specify source *"
              :rules="[(val) => !!val || 'Please specify']"
            />
          </div>
        </q-slide-transition>
        <q-separator class="q-my-xs" />
      </div>
      <q-field
        borderless
        :model-value="localForm.pt_gross_income"
        :rules="[(val) => !!val || 'Please select an income range.']"
        dense
        class="col-12 col-sm-6 col-md-4"
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Gross Income</div>

            <q-radio
              v-model="localForm.pt_gross_income"
              val="Below 20k"
              label="Below 20k"
            />
            <q-radio
              v-model="localForm.pt_gross_income"
              val="20k - 50k"
              label="20k - 50k"
            />
            <q-radio
              v-model="localForm.pt_gross_income"
              val="Above 50k"
              label="Above 50k"
            />
          </div>
        </template>
      </q-field>
      <q-field
        class="col-12 col-sm-6 col-md-4"
        :model-value="localForm.pt_home_ownership"
        :rules="[(val) => !!val || 'Please select home ownership.']"
        lazy-rules
        dense
        borderless
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Home Ownership</div>

            <q-radio v-model="localForm.pt_home_ownership" val="Owned" label="Owned" />
            <q-radio v-model="localForm.pt_home_ownership" val="Rented" label="Rented" />
            <q-radio
              v-model="localForm.pt_home_ownership"
              val="Mortgaged"
              label="Mortgaged"
            />
          </div>
        </template>
      </q-field>
      <q-field
        class="col-12 col-sm-6 col-md-4"
        :model-value="localForm.pt_years_of_stay"
        :rules="[(val) => !!val || 'Please select years of stay.']"
        lazy-rules
        dense
        borderless
      >
        <template v-slot:control>
          <div class="column">
            <div class="text-subtitle2 text-grey-8">Years of Stay</div>

            <q-radio
              v-model="localForm.pt_years_of_stay"
              val="0-1 Year"
              label="0-1 Year"
            />
            <q-radio
              v-model="localForm.pt_years_of_stay"
              val="1-5 Years"
              label="1-5 Years"
            />
            <q-radio
              v-model="localForm.pt_years_of_stay"
              val="5+ Years"
              label="5+ Years"
            />
          </div>
        </template>
      </q-field>
      <div class="col-12 col-md-12">
        <q-separator class="q-my-xs" />
        <div class="text-subtitle2 q-mb-xs">Do you have a car?</div>
        <q-option-group
          v-model="localForm.pthasCar"
          :options="yesNoOptions"
          color="primary"
          inline
          @update:model-value="resetCarData"
        />
        <q-separator class="q-my-md" />
      </div>
      <div class="col-12 col-md-12" v-if="localForm.pthasCar === 'yes'">
        <q-select
          outlined
          dense
          v-model="localForm.carOwnership"
          :options="ownershipOptions"
          label="Ownership Type *"
          lazy-rules
          :rules="[(val) => !!val || 'Required']"
        />
      </div>
      <div class="col-12 col-md-12" v-if="localForm.pthasCar === 'yes'">
        <q-input
          outlined
          dense
          type="number"
          v-model="localForm.numberOfCars"
          label="Number of Cars *"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Required',
            (val) => val > 0 || 'Min 1',
          ]"
        />
        <q-separator class="q-my-sm" />
      </div>
    </div> -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.seniorpwd"
          type="number"
          label="Senior/PWD No."
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.philhealthId"
          type="number"
          label="PhilHealth No."
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.sssgsis"
          type="number"
          label="SSS/GSIS No."
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.tin" type="number" label="TIN No." />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.others" type="number" label="Others" />
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2">Spouse Details:</div>
      </div>
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.spouseName"
          label="Spouse's Full Name"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.spouseOccupation"
          label="Occupation/Employer"
        />
      </div>
      <div class="col-12 col-md-4">
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

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2">Contact Person:</div>
      </div>
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
