<template>
  <q-form ref="hmoForm" @submit="onSubmit">
    <div class="text-subtitle2 text-weight-medium q-mb-md">
      Accredited HMO Information <span class="text-negative">*</span>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.hmoName"
          label="HMO Provider *"
          hint="e.g. Maxicare, Intellicare"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.hmomemberId"
          label="HMO ID No.  *"
          :rules="[(val) => !!val || 'Required']"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          outlined
          dense
          v-model="localForm.hmovalidityDate"
          label="Validity / Expiry Date *"
          mask="date"
          :rules="[
            'date',
            (val) => !!val || 'Required',
            (val) =>
              new Date(val) >= new Date().setHours(0, 0, 0, 0) || 'Card is expired',
          ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.hmovalidityDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="text-subtitle2 text-weight-medium q-mb-xs" style="line-height: 1.1">
          Desired room available? <span class="text-negative">*</span>
        </div>

        <q-field
          borderless
          dense
          :model-value="localForm.desiredRoom"
          :rules="[(val) => !!val || 'Required']"
          hide-bottom-space
        >
          <template v-slot:control>
            <q-option-group
              v-model="localForm.desiredRoom"
              :options="[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]"
              color="primary"
              inline
              class="q-ml-none"
            />
          </template>
        </q-field>
      </div>
      <div class="col-12 col-md-6">
        <div class="text-subtitle2 text-weight-medium q-mb-xs" style="line-height: 1.1">
          Informed on increment and room & board excess?
          <span class="text-negative">*</span>
        </div>

        <q-field
          borderless
          dense
          :model-value="localForm.informedIncrement"
          :rules="[(val) => !!val || 'Required']"
          hide-bottom-space
        >
          <template v-slot:control>
            <q-option-group
              v-model="localForm.informedIncrement"
              :options="[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]"
              color="primary"
              inline
              class="q-ml-none"
            />
          </template>
        </q-field>
      </div>
    </div>
    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          outlined
          v-model="localForm.hmoStaff"
          label="Name of HMO Staff / Details of Call *"
          dense
          :rules="[(val) => !!val || 'Plese input required field']"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          outlined
          v-model="localForm.hmoDateTime"
          label="Date of call to HMO *"
          dense
          mask="####-##-##"
          :rules="[(val) => !!val || 'Please input required field']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="localForm.hmoDateTime" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row justify-center q-mt-lg">
      <q-btn
        flat
        class="q-mr-sm"
        color="grey-8"
        icon="arrow_back"
        label="Back"
        @click="onBack"
      />

      <q-btn
        unelevated
        color="blue-10"
        icon-right="check"
        label="Submit"
        type="submit"
        style="height: 45px; max-width: 140px"
      />
    </div>
  </q-form>
</template>

<script>
export default {
  name: "AccreditedHMO",
  props: {
    form: {
      type: Object,
    },
  },
  emits: ["update:form", "prev", "submit"],
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
  },
  methods: {
    async validate() {
      return await this.$refs.hmoForm.validate();
    },
    async onSubmit() {
      const isValid = await this.validate();
      if (!isValid) {
        this.$q.notify({
          type: "warning",
          message: "Please fill all required HMO fields.",
          position: "top",
        });
        return;
      }
      this.$emit("submit");
    },
    onBack() {
      this.$emit("prev");
    },
  },
};
</script>
