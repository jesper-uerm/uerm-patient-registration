<template>
  <q-form @submit="onSubmit">
    <div class="text-subtitle1 q-mb-md">Mode of Payment</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-option-group v-model="localForm.mop" :options="mopOptions" color="primary" inline />
        <q-slide-transition>
          <div v-if="localForm.mop === 'Others'" class="q-mt-sm">
            <q-input filled v-model="localForm.specificmop" label="Please specify mode of payment *" dense :rules="[val => !!val || 'Please specify']" />
          </div>
        </q-slide-transition>
        <q-separator class="q-my-md" />
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input filled v-model="localForm.creditCard" type="number" label="No. of Credit Cards owned" />
        </div>
        <div class="col-12 col-md-6">
          <q-input filled v-model="localForm.bank" label="Bank Affliations" />
        </div>
      </div>
      <div class="row col-12 q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-separator class="q-my-md" />
          <div class="text-subtitle1">I/We received the following items in good order and condition: </div>
          <div class="row q-gutter-lg q-mt-xs">
            <q-checkbox v-model="localForm.items" val="UERM Brochure" label="UERM Brochure" />
            <q-checkbox v-model="localForm.items" val="Admission Kit" label="Admission Kit" />
            <q-checkbox v-model="localForm.items" val="Patient Satisfaction Survey" label="Patient Satisfaction Survey" />
          </div>
        </div>
      </div>
      <div class="row col-12 q-col-gutter-md">
        <!-- CERTIFICATION AND SIGNATURE -->
      </div>
    </div>
    <q-stepper-navigation class="text-center q-gutter-sm">
      <q-btn flat color="primary" label="Back" @click="onBack" />
      <!-- <q-btn type="submit" color="primary" label="Next" /> -->
      <!-- <q-btn color="primary" label="Next" @click="onSubmit" /> -->
    </q-stepper-navigation>
  </q-form>
</template>
<script>
  export default {
    props: {
      form: Object,
      mopOptions: Array,
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
    }
  }
</script>
<style scoped>

</style>
