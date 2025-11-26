<template>
  <q-form @submit="onSubmit">
    <div class="text-subtitle1 q-mb-md">Respondent 1 Details</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-input filled v-model="localForm.resp1_fullname" label="Full Name *" :rules="[val => !!val || 'Required']" />
      </div>
      <div class="col-12 col-md-4">
        <q-select filled v-model="localForm.resp1_relationship" :options="relationshipOptions" label="Relationship" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.resp1_email" type="email" label="Email Address" :rules="[
      val => !!val || 'Email is required',
      val => /.+@.+\..+/.test(val) || 'Enter a valid email'
    ]" lazy-rules />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.resp1_mobile" label="Mobile Number" mask="####-###-####" />
      </div>
      <div class="col-12 col-md-4">
        <q-input filled v-model="localForm.resp1_landline" label="Landline" />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-12">
        <q-input filled v-model="localForm.resp1_address" type="textarea" rows="1" label="Home Address" />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-md-6">
        <q-input filled v-model="localForm.resp1_occupation" label="Occupation" />
      </div>
      <div class="col-12 col-md-6">
        <q-input filled v-model="localForm.resp1_contact_no" type="number" label="Employer Contact No" />
      </div>
      <div class="col-12">
        <q-input filled v-model="localForm.resp1_employer_address" label="Employer Address" />
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <div class="text-subtitle2 text-grey-8">Source of Income</div>
        <div class="column">
          <q-checkbox v-model="localForm.resp1_source_income" val="Salary" label="Salary" />
          <q-checkbox v-model="localForm.resp1_source_income" val="Business" label="Business" />
          <q-checkbox v-model="localForm.resp1_source_income" val="Remittance" label="Remittance" />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="text-subtitle2 text-grey-8">Gross Income</div>
        <div class="column">
          <q-checkbox v-model="localForm.resp1_gross_income" val="Below 20k" label="Below 20k" />
          <q-checkbox v-model="localForm.resp1_gross_income" val="20k - 50k" label="20k - 50k" />
          <q-checkbox v-model="localForm.resp1_gross_income" val="Above 50k" label="Above 50k" />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="text-subtitle2 text-grey-8">Home Ownership</div>
        <div class="column">
          <q-checkbox v-model="localForm.resp1_home_ownership" val="Owned" label="Owned" />
          <q-checkbox v-model="localForm.resp1_home_ownership" val="Rented" label="Rented" />
          <q-checkbox v-model="localForm.resp1_home_ownership" val="Mortgaged" label="Mortgaged" />
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="text-subtitle2 text-grey-8">Years of Stay</div>
        <div class="column">
          <q-checkbox v-model="localForm.resp1_years_of_stay" val="0-1 Year" label="0-1 Year" />
          <q-checkbox v-model="localForm.resp1_years_of_stay" val="1-5 Years" label="1-5 Years" />
          <q-checkbox v-model="localForm.resp1_years_of_stay" val="5+ Years" label="5+ Years" />
        </div>
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md items-center">
      <div class="col-12 col-md-12">
        <div class="text-subtitle2 q-mb-xs">Do you have a car?</div>
        <q-option-group v-model="localForm.hasCar" :options="yesNoOptions" color="primary" inline @update:model-value="resetCarData" />
      </div>
      <div class="col-12 col-md-12" v-if="localForm.hasCar === 'yes'">
        <q-select filled v-model="localForm.carOwnership" :options="ownershipOptions" label="Ownership Type *" lazy-rules :rules="[val => !!val || 'Required']" />
      </div>
      <div class="col-12 col-md-12" v-if="localForm.hasCar === 'yes'">
        <q-input filled type="number" v-model.number="localForm.numberOfCars" label="Number of Cars *" lazy-rules :rules="[
                    val => val !== null && val !== '' || 'Required',
                    val => val > 0 || 'Min 1'
                  ]" />
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
      ownershipOptions: Array,
      relationshipOptions: Array
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
        this.$emit('prev');
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
