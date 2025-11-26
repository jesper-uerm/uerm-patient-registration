<template>
  <q-form @submit="onSubmit">
    <div class="text-subtitle1 q-mb-md">Source of Income</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-option-group v-model="localForm.sourceOfIncome" :options="sourceIncomeOptions" color="primary" inline />
        <q-slide-transition>
          <div v-if="localForm.sourceOfIncome === 'Others'" class="q-mt-sm">
            <q-input filled v-model="localForm.specificSourceOfIncome" label="Please specify source *" dense :rules="[val => !!val || 'Please specify']" />
          </div>
        </q-slide-transition>
        <q-separator class="q-my-md" />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle2 text-grey-8">Gross Income</div>
        <div class="column">
          <q-checkbox v-model="localForm.pt_gross_income" val="Below 20k" label="Below 20k" />
          <q-checkbox v-model="localForm.pt_gross_income" val="20k - 50k" label="20k - 50k" />
          <q-checkbox v-model="localForm.pt_gross_income" val="Above 50k" label="Above 50k" />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle2 text-grey-8">Home Ownership</div>
        <div class="column">
          <q-checkbox v-model="localForm.pt_home_ownership" val="Owned" label="Owned" />
          <q-checkbox v-model="localForm.pt_home_ownership" val="Rented" label="Rented" />
          <q-checkbox v-model="localForm.pt_home_ownership" val="Mortgaged" label="Mortgaged" />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle2 text-grey-8">Years of Stay</div>
        <div class="column">
          <q-checkbox v-model="localForm.pt_years_of_stay" val="0-1 Year" label="0-1 Year" />
          <q-checkbox v-model="localForm.pt_years_of_stay" val="1-5 Years" label="1-5 Years" />
          <q-checkbox v-model="localForm.pt_years_of_stay" val="5+ Years" label="5+ Years" />
        </div>
      </div>
      <div class="col-12 col-md-12">
        <q-separator class="q-my-md" />
        <div class="text-subtitle2 q-mb-xs">Do you have a car?</div>
        <q-option-group v-model="localForm.pthasCar" :options="yesNoOptions" color="primary" inline @update:model-value="resetCarData" />
        <q-separator class="q-my-md" />
      </div>
      <div class="col-12 col-md-12" v-if="localForm.pthasCar === 'yes'">
        <q-select filled v-model="localForm.carOwnership" :options="ownershipOptions" label="Ownership Type *" lazy-rules :rules="[val => !!val || 'Required']" />
      </div>
      <div class="col-12 col-md-12" v-if="localForm.pthasCar === 'yes'">
        <q-input filled type="number" v-model.number="localForm.numberOfCars" label="Number of Cars *" lazy-rules :rules="[
                    val => val !== null && val !== '' || 'Required',
                    val => val > 0 || 'Min 1'
                  ]" />
        <q-separator class="q-my-md" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.seniorpwd" type="number" label="Senior/PWD No." />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.philhealth" type="number" label="PhilHealth No." />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.sssgsis" type="number" label="SSS/GSIS No." />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.tin" type="number" label="TIN No." />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.others" type="number" label="Others" />
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-subtitle2 q-mb-xs">Spouse Details</div>
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.SpouseName" label="Spouse's Full Name *" :rules="[val => !!val || 'Required']" />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.spouseOccupation" label="Occupation/Employer" />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled type="number" v-model="localForm.spouseEmployerContact" label="Employer Contact" />
      </div>
    </div>
    <q-stepper-navigation class="text-center q-gutter-sm">
      <q-btn flat color="primary" label="Back" @click="onBack" />
      <!-- <q-btn type="submit" color="primary" label="Next" /> -->
      <q-btn color="primary" label="Next" @click="onSubmit" />
    </q-stepper-navigation>
  </q-form>
</template>
<script>
export default {
  props: {
    form: Object,
    yesNoOptions: Array,
    sourceIncomeOptions: Array,
    ownershipOptions: Array
  },
  emits: ['update:form', 'next', 'prev'],

  data() {
    return {
      localForm: {
        ...this.form
      }
    }
  },

  watch: {
    localForm: {
      handler(val) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },

  methods: {
    onSubmit() {
      this.$emit('next')
    },

    onBack() {
      this.$emit('prev')
    },

    resetCarData(value) {
      if (value === 'no') {
        this.localForm.carOwnership = null
        this.localForm.numberOfCars = ''
      }
    }
  }
}
</script>

