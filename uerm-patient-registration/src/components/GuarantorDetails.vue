<template>
  <q-form @submit="$emit('next')">

    <div class="text-subtitle1 q-mb-md">Contact Details</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          filled
          v-model="locadata.mobile"
          label="Mobile Number"
          :rules="[val => !!val || 'Required']"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          filled
          v-model="locadata.email"
          label="Email Address"
        />
      </div>
    </div>

    <q-stepper-navigation class="text-right q-gutter-sm">
      <!-- 1. The Back Button emits 'back' to the parent -->
      <q-btn flat color="primary" label="Back" @click="$emit('back')" />

      <!-- 2. The Continue Button submits the form -->
      <q-btn type="submit" color="primary" label="Continue" />
    </q-stepper-navigation>

  </q-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>
