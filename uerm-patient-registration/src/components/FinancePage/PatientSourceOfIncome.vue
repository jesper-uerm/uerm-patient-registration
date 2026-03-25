<template>
  <q-card-section>
    <q-form ref="patientSourceOfIncome" @submit="onNext">
      <div class="row q-col-gutter-lg q-mx-md">
        <div class="col-12">
          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Patient Information:
          </div>
          <div class="row q-col-gutter-xs q-mb-md">
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                type="datetime-local"
                v-model="formData.fnDateTime"
                label="Date/Time *"
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                type="number"
                v-model="formData.fnAge"
                label="Age"
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.fnGender"
                label="Gender"
                stack-label
                readonly
              />
            </div>
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-4 col-md-4 q-mb-md">
              <q-select
                outlined
                dense
                v-model="formData.fnType"
                :options="['ER', 'DA', 'DR', 'Transfer Patient']"
                label="ER/DA/DR/Transfer Patient"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.fnName"
                label="Patient Name"
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.fnAddress"
                label="Address"
                stack-label
                readonly
              />
            </div>
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.fnDiagnosis"
                label="Admitting Diagnosis *"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4 q-mb-md">
              <q-input
                outlined
                dense
                v-model="formData.fnWork"
                label="Patient Work/Income"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.fnBusAddress"
                label="Business Address"
                stack-label
              />
            </div>
          </div>

          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Person responsible for the account
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-3 col-md-3 q-mb-md">
              <q-input
                outlined
                dense
                v-model="formData.fnPersonRes1"
                label="Person Responsible 1*"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.fnPersonRes1Work"
                label="Work"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-select
                outlined
                dense
                v-model="formData.fnPersonRes1Rel"
                :options="appOptions.relationships"
                label-slot
                stack-label
              >
                <template v-slot:label>
                  Relation to Patient <span class="text-red">*</span>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.fnPersonRes1Contact"
                label="Contact No."
                stack-label
              />
            </div>
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-3 col-md-3 q-mb-md">
              <q-input
                outlined
                dense
                v-model="formData.fnPersonRes2"
                label="Person Responsible 2*"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.fnPersonRes2Work"
                label="Work"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-select
                outlined
                dense
                v-model="formData.fnPersonRes2Rel"
                :options="appOptions.relationships"
                label-slot
                stack-label
              >
                <template v-slot:label>
                  Relation to Patient <span class="text-red">*</span>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.fnPersonRes2Contact"
                label="Contact No."
                stack-label
              />
            </div>
          </div>

          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Service Ward
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-4 col-md-4 q-mb-md">
              <q-input
                outlined
                dense
                v-model="formData.fnsssCard"
                label="SS Card Holder/Class R"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-select
                outlined
                dense
                v-model="formData.fnvisitTypeService"
                :options="patientTypeOptions"
                label="First Time/Returning/OPD"
                stack-label
                hide-bottom-space
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-select
                outlined
                dense
                v-model="formData.fnadmissionType"
                :options="admissionTypeOptions"
                label="Emergency Admission/Index *"
                stack-label
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-6 col-md-6 q-mb-md">
              <q-input
                outlined
                dense
                v-model="formData.fnendorsedToSocial"
                label="Endorsed to Social Service For SS Card"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                outlined
                dense
                type="number"
                v-model="formData.fnnumAdmissionService"
                label="Number of Admission"
                stack-label
                readonly
              />
            </div>
          </div>
          <div class="row q-col-gutter-xs q-mb-md">
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                type="date"
                v-model="formData.fnExpDate"
                label="Expiration Date"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <div class="col-12 col-sm-12 col-md-12">
                <q-input
                  outlined
                  dense
                  type="date"
                  v-model="formData.fnLastAdmDateService"
                  label="Last Admission Date"
                  stack-label
                />
              </div>
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-select
                outlined
                dense
                v-model="formData.fnCoordinateByService"
                :options="allDoctors || []"
                emit-value
                map-options
                label="Coordinated By"
                stack-label
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No doctors found </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
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
  </q-card-section>
</template>

<script>
import { mapWritableState, mapState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  emits: ["next"],

  computed: {
    ...mapState(useFinanceStore, [
      "allDoctors",
      "appOptions",
      "patientTypeOptions",
      "admissionTypeOptions",
    ]),

    ...mapWritableState(useFinanceStore, ["formData"]),
  },

  async mounted() {
    await this.fetchDoctors();
  },

  methods: {
    ...mapActions(useFinanceStore, ["fetchDoctors"]),

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
  },
};
</script>

<style scoped>
.my-custom-toggle {
  border: 1px solid #e0e0e0;
}
</style>
