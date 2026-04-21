<template>
  <q-form ref="TransferHMO" @submit="onNext">
    <div class="row q-col-gutter-lg q-mx-lg">
      <div class="col-12">
        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          Pay Ward
        </div>
        <div class="row q-col-gutter-xs q-mb-md">
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              outlined
              dense
              v-model="formData.fnvisitTypePay"
              :options="patientTypeOptions"
              label="First Time/Returning/OPD"
              stack-label
              hide-bottom-space
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <div class="col-12 col-sm-12 col-md-12">
              <q-input
                outlined
                dense
                type="date"
                v-model="formData.fnLastAdmDatePay"
                label="Last Admission Date"
                stack-label
                readonly
              />
            </div>
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              type="number"
              v-model="formData.fnnumAdmissionPay"
              label="Number of Admission"
              stack-label
              readonly
            />
          </div>
        </div>

        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          Transfer Patient
        </div>
        <div class="row q-col-gutter-xs q-mb-md">
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              v-model="formData.fntransFrom"
              label="Transferred Patient From"
              stack-label
              hide-bottom-space
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              v-model="formData.fnrsofTransfer"
              label="Reason of Transfer"
              stack-label
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              outlined
              dense
              v-model="formData.fnAdmissionStatus"
              :options="['ER Only', 'Admitted']"
              label="ER Only/Admitted"
              stack-label
            />
          </div>
        </div>
        <div class="row q-col-gutter-xs q-mb-md">
          <div class="col-12 col-sm-6 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.fnCoordinateByPay"
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
          <div class="col-12 col-sm-6 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.fnremarksTransfer"
              label="Fully Settled/With Current Balance"
              :options="['Fully Settled', 'With Current Balance']"
              stack-label
            />
          </div>
        </div>

        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          HMO
        </div>
        <div class="row q-col-gutter-xs q-mb-md">
          <div class="col-12 col-sm-6 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.fnHmo"
              :options="hmo || []"
              emit-value
              map-options
              label="HMO"
              stack-label
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No HMO found </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.fnHmoInitialStatus"
              label="HMO Initial - MBL/Utilization/Exhausted"
              :options="['HMO Initial - MBL', 'Utilization', 'Exhausted']"
              stack-label
            />
          </div>
        </div>

        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          PhilHealth
        </div>
        <div class="row q-col-gutter-xs q-mb-md">
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              outlined
              dense
              v-model="formData.fnphStatus"
              label="PhilHealth Status"
              :options="['Member Dependent', 'Lifetime', 'Non-Member']"
              stack-label
              hide-bottom-space
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              v-model="formData.fnphNumber"
              label="PHIC ID Number"
              stack-label
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              v-model="formData.fnphRemarks"
              label="Remarks"
              stack-label
            />
          </div>
        </div>

        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          Mode Of Payment
        </div>
        <div class="row q-col-gutter-xs q-mb-md">
          <div class="col-12 col-sm-12 col-md-12">
            <q-select
              outlined
              dense
              v-model="formData.fnMop"
              label="Mode of Payment"
              :options="mopOptions"
              stack-label
              hide-bottom-space
            />
          </div>
        </div>
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
        icon-right="arrow_forward"
        label="Next"
        type="submit"
        style="height: 45px; max-width: 120px"
      />
    </div>
  </q-form>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  emits: ["next", "prev"],

  computed: {
    ...mapState(useFinanceStore, [
      "mopOptions",
      "patientTypeOptions",
      "allDoctors",
      "hmo",
    ]),
    ...mapWritableState(useFinanceStore, ["formData"]),
  },

  async mounted() {
    await this.fetchDoctors();
    await this.fetchHmo();
  },

  methods: {
    ...mapActions(useFinanceStore, ["fetchDoctors", "fetchHmo"]),

    async validate() {
      return await this.$refs.TransferHMO.validate();
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
  },
};
</script>
