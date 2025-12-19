<template>
  <q-form ref="patientSourceOfIncome" @submit="onNext">
    <q-card bordered flat class="bg-grey-7 q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-sm text-white">
          <div class="col-4 text-center col-md-4">
            <span>Patient ID:</span>
            {{ localPatient?.patient_id || "N/A" }}
          </div>
          <div class="col-4 text-center col-md-4">
            <span>Name:</span>
            {{ localPatient?.lastName }}, {{ localPatient?.firstName }}
          </div>
          <div class="col-4 text-center col-md-4">
            <span>Birthdate:</span>
            {{ formatDate(localPatient?.birthdate) }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <div class="text-subtitle2 text-weight-medium q-mb-xs">
          Source of Income <span class="text-negative">*</span>
        </div>
        <q-field
          borderless
          dense
          :model-value="localForm.sourceOfIncome"
          :rules="[(val) => !!val || 'Please select a source of income']"
          hide-bottom-space
        >
          <template v-slot:control>
            <q-option-group
              v-model="localForm.sourceOfIncome"
              :options="sourceIncomeOptions"
              color="primary"
              inline
              class="q-ml-none"
            />
          </template>
        </q-field>

        <q-slide-transition>
          <div
            v-if="localForm.sourceOfIncome === 'Others'"
            class="q-mt-sm"
            style="max-width: 100%"
          >
            <q-input
              outlined
              dense
              v-model="localForm.specificSourceOfIncome"
              label="Please specify *"
              :rules="[(val) => !!val || 'Please specify']"
              bg-color="white"
            />
          </div>
        </q-slide-transition>
        <q-separator class="q-mt-md" />
      </div>

      <div class="col-12 col-md-4">
        <div class="text-subtitle2 text-grey-8">
          Gross Income <span class="text-negative">*</span>
        </div>
        <q-field
          borderless
          dense
          :model-value="localForm.pt_gross_income"
          :rules="[(val) => !!val || 'Please select a gross income']"
        >
          <template v-slot:control>
            <q-btn-toggle
              v-model="localForm.pt_gross_income"
              :options="grossIncomeOptions"
              class="my-custom-toggle rounded-borders full-width"
              no-caps
              unelevated
              toggle-color="primary"
              color="grey-3"
              text-color="grey-9"
              spread
              padding="8px"
            />
          </template>
        </q-field>
      </div>

      <div class="col-12 col-md-4">
        <div class="text-subtitle2 text-grey-8">
          Home Ownership <span class="text-negative">*</span>
        </div>
        <q-field
          borderless
          dense
          :model-value="localForm.pt_home_ownership"
          :rules="[(val) => !!val || 'Please select home ownership']"
        >
          <template v-slot:control>
            <q-btn-toggle
              v-model="localForm.pt_home_ownership"
              :options="homeOwnershipOptions"
              class="my-custom-toggle full-width"
              no-caps
              unelevated
              toggle-color="primary"
              color="grey-3"
              text-color="grey-9"
              spread
              padding="8px"
            />
          </template>
        </q-field>
      </div>

      <div class="col-12 col-md-4">
        <div class="text-subtitle2 text-grey-8">
          Years of Stay <span class="text-negative">*</span>
        </div>
        <q-field
          borderless
          dense
          :model-value="localForm.pt_years_of_stay"
          :rules="[(val) => !!val || 'Please select years of stay']"
        >
          <template v-slot:control>
            <q-btn-toggle
              v-model="localForm.pt_years_of_stay"
              :options="yearsOfStayOptions"
              class="my-custom-toggle full-width"
              no-caps
              unelevated
              toggle-color="primary"
              color="grey-3"
              text-color="grey-9"
              spread
              padding="8px"
            />
          </template>
        </q-field>
      </div>

      <div class="col-12">
        <q-separator class="q-mb-sm" />

        <div class="row items-center q-gutter-x-md">
          <div class="text-subtitle2 text-weight-medium">
            Do you have a car? <span class="text-negative">*</span>
          </div>
          <q-field
            borderless
            dense
            :model-value="localForm.pthasCar"
            :rules="[(val) => !!val || 'Required']"
            hide-bottom-space
            class="q-pb-none"
          >
            <template v-slot:control>
              <q-btn-toggle
                v-model="localForm.pthasCar"
                :options="yesNoOptions"
                @update:model-value="resetCarData"
                no-caps
                unelevated
                toggle-color="primary"
                color="grey-3"
                text-color="grey-9"
                padding="6px 20px"
              />
            </template>
          </q-field>
        </div>
      </div>

      <template v-if="localForm.pthasCar === 'yes'">
        <div class="col-12 col-md-6">
          <q-select
            outlined
            dense
            v-model="localForm.carOwnership"
            :options="ownershipOptions"
            label="Ownership Type *"
            :rules="[(val) => !!val || 'Please select a option']"
            bg-color="white"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            outlined
            dense
            type="number"
            v-model="localForm.numberOfCars"
            label="Number of Cars *"
            inputmode="numeric"
            :rules="[
              (val) => (val !== null && val !== '') || 'Required',
              (val) => val > 0 || 'Min 1',
            ]"
            bg-color="white"
          />
        </div>
      </template>

      <div class="col-12 q-mt-xs">
        <q-separator class="q-mb-md" />

        <div class="text-subtitle2 text-weight-medium q-mb-xs">
          Mode of Payment <span class="text-negative">*</span>
        </div>
        <q-field
          borderless
          :model-value="localForm.mop"
          :rules="[(val) => !!val || 'Please provide mode of payment.']"
          dense
          hide-bottom-space
        >
          <template v-slot:control>
            <q-option-group
              v-model="localForm.mop"
              :options="mopOptions"
              color="primary"
              inline
              class="q-ml-none"
            />
          </template>
        </q-field>

        <q-slide-transition>
          <div v-if="localForm.mop === 'Others'" class="q-mt-sm" style="max-width: 100%">
            <q-input
              outlined
              v-model="localForm.specificmop"
              label="Please specify mode of payment *"
              dense
              :rules="[(val) => !!val || 'Please specify']"
            />
          </div>
        </q-slide-transition>
        <q-separator class="q-mt-xs" />
      </div>

      <div class="col-6 col-md-6">
        <q-input
          outlined
          dense
          v-model="localForm.creditCard"
          type="number"
          label="No. of Credit Cards owned"
          inputmode="numeric"
        />
      </div>
      <div class="col-6 col-md-6">
        <q-input outlined dense v-model="localForm.bank" label="Bank Affiliations" />
      </div>
    </div>

    <div class="row justify-center q-mt-lg">
      <q-btn
        unelevated
        color="blue-10"
        icon-right="arrow_forward"
        label="Next"
        type="submit"
        style="height: 45px; max-width: 120px"
      />
    </div>
  </q-form>
</template>

<script>
import { date } from "quasar";

export default {
  props: {
    form: Object,
    localPatient: { type: Object, default: () => ({}) },
    yesNoOptions: Array,
    sourceIncomeOptions: Array,
    ownershipOptions: Array,
    grossIncomeOptions: Array,
    homeOwnershipOptions: Array,
    yearsOfStayOptions: Array,
    mopOptions: Array,
  },
  emits: ["update:form", "next"],
  data() {
    return {
      localForm: { ...this.form },
    };
  },
  watch: {
    form: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localForm)) {
          this.localForm = { ...newVal };
        }
      },
      deep: true,
    },
    localForm: {
      handler(val) {
        this.$emit("update:form", val);
      },
      deep: true,
    },
    "localForm.sourceOfIncome"(val) {
      if (val !== "Others") {
        this.localForm.specificSourceOfIncome = "";
      }
    },
    "localForm.mop"(val) {
      if (val !== "Others") {
        this.localForm.specificmop = "";
      }
    },
  },
  methods: {
    async validate() {
      return await this.$refs.patientSourceOfIncome.validate();
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
    resetCarData(value) {
      if (value === "no") {
        this.localForm.carOwnership = null;
        this.localForm.numberOfCars = "";
      }
    },
    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },
  },
};
</script>

<style scoped>
.my-custom-toggle {
  border: 1px solid #e0e0e0;
}
</style>
