<template>
  <q-form @submit="onSubmit">
    <div class="text-subtitle1 text-bold q-mb-md">Patient Information:</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.lastName" label="Last Name *" :rules="[val => !!val || 'Required']" />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense  v-model="localForm.firstName" label="First Name *" :rules="[val => !!val || 'Required']" />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.middleName" label="Middle Name" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3 ">
        <q-input outlined dense type="number" v-model="localForm.age" label="Age" />
      </div>
      <div class="col-12 col-md-3">
        <q-select outlined dense v-model="localForm.gender" :options="['Male', 'Female', 'Prefer not to say']" label="Gender" lazy-rules :rules="[val => !!val || 'Please select gender']" />
      </div>
      <div class="col-12 col-md-3">
        <q-select outlined dense v-model="localForm.civilStatus" label="Civil Status" :options="civilStatusOptions" lazy-rules :rules="[val => !!val || 'Please select Status']" />
      </div>
      <div class="col-12 col-md-3">
        <q-select outlined dense v-model="localForm.religion" :options="religionOptions" label="Religion" lazy-rules :rules="[val => !!val || 'Please select religion']" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input outlined dense type="number" v-model="localForm.landline" label="Landline No." />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense type="number" v-model="localForm.mobile" label=" Mobile No. *" :rules="[val => !!val || 'Please input mobile number']"/>
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense type="email" v-model="localForm.email" label="Email Address"/>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.birthdate" label="Birthdate *" mask="date" :rules="[
                        'date',
                        val => new Date(val) <= new Date() || 'Date cannot be in the future'
                      ]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.birthdate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.birthplace" label="Birthplace" />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.nationality" label="Nationality" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input outlined dense v-model="localForm.presentAddress" type="textarea" rows="1" label="Present Address" :rules="[val => !!val || 'Please input present address']"/>
      </div>
      <div class="col-12 col-md-6">
        <q-input outlined dense v-model="localForm.permanentAddress" type="textarea" rows="1" label="Permanent Address" />
        <q-checkbox v-model="localSameAsPresent" label="Same as Present Address" class="q-mt-sm text-grey-8" />
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.fathersName" label="Father's Full Name *"/>
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.fathersAddress" type="textarea" rows="1" label="Complete Address" />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense type="number" v-model="localForm.fatherContactNumber" label="Contact No:" />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-xs">
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.mothersName" label="Mother's Full Name *"/>
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense v-model="localForm.mothersAddress" type="textarea" rows="1" label="Complete Address" />
        <q-checkbox v-model="localSameAsFather" label="Same as Father's Address" class="q-mt-sm text-grey-8" />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined dense type="number" v-model="localForm.motherContactNumber" label="Contact No:"/>
      </div>
    </div>
    <q-stepper-navigation class="text-center">
      <!-- <q-btn type="submit" color="primary" label="Next" /> -->
      <q-btn color="blue-10" icon-right="arrow_forward" style="width: 100%; height: 45px; max-width: 120px;" label="Next" @click="onSubmit" />
    </q-stepper-navigation>
  </q-form>
</template>
<script>
  export default {
    props: {
      form: Object,
      civilStatusOptions: Array,
      religionOptions: Array,
      sameAsPresent: Boolean,
      sameAsFather: Boolean
    },
    emits: ['update:form', 'next', 'prev'],
    data() {
      return {
        localForm: {
          ...this.form
        },
        localSameAsPresent: false,
        localSameAsFather: false
      }
    },
    methods: {
      onSubmit() {
        this.$emit('next');
      },
      onBack() {
        this.$emit('prev');
      }
    },
    watch: {
      localForm: {
        deep: true,
        handler(val) {
          this.$emit('update:form', val);
        }
      },
      localSameAsPresent(isChecked) {
        if (isChecked) {
          this.localForm.permanentAddress = this.localForm.presentAddress
        } else {
          this.localForm.permanentAddress = ''
        }
      },
      'localForm.presentAddress'(newVal) {
        if (this.localSameAsPresent) {
          this.localForm.permanentAddress = newVal
        }
      },
      localSameAsFather(isChecked) {
        if (isChecked) {
          this.localForm.mothersAddress = this.localForm.fathersAddress
        } else {
          this.localForm.mothersAddress = ''
        }
      },
      'localForm.fathersAddress'(newVal) {
        if (this.localForm.sameAsFather) {
          this.localForm.mothersAddress = newVal
        }
      },
    },
  }
</script>
