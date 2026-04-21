<template>
  <q-form ref="admission" @submit="onSubmit">
    <div class="row q-col-gutter-lg q-mx-lg">
      <div class="col-12">
        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          Admission
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-3 col-md-3">
            <q-select
              outlined
              dense
              v-model="formData.fnadmPhysician"
              :options="allDoctors || []"
              emit-value
              map-options
              label="Admitting Physician *"
              stack-label
              @update:model-value="onDoctorSelected"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No doctors found </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              v-model="formData.fnDepartment"
              label="Department *"
              stack-label
              readonly
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-select
              outlined
              stack-label
              dense
              v-model="formData.fnatnPhysician"
              :options="allDoctors || []"
              emit-value
              map-options
              label="Attending Physician *"
              @update:model-value="onAttendingDoctorSelected"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No doctors found </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              v-model="formData.fncontactatnPhysician"
              label="Contact No. *"
              readonly
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              v-model="formData.fnrmAdmission"
              label="Room Admission *"
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              type="number"
              v-model="formData.fnCost"
              label="Possible Cost *"
              stack-label
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              v-model="formData.fnlengthStay"
              label="Possible Length Of Stay *"
              stack-label
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              v-model="formData.fnadmProcedure"
              label="Procedure *"
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              type="number"
              v-model="formData.fnorDeposit"
              label="Operating Room Deposit *"
              stack-label
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              type="number"
              v-model="formData.fnreqDeposit"
              label="Requested Deposit *"
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              type="number"
              v-model="formData.fntoDeposit"
              label="To Deposit *"
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              type="number"
              v-model="formData.fntofollowDeposit"
              label="To Follow Deposit *"
            />
          </div>
          <div class="col-12">
            <q-input
              type="textarea"
              outlined
              rows="3"
              stack-label
              dense
              v-model="formData.fnadmRemarks"
              label="Remarks*"
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-select
              outlined
              dense
              v-model="formData.fnStatus"
              label="Status *"
              stack-label
              :options="statusOptions"
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              v-model="formData.fnEvaluatedBY"
              label="Evaluated By *"
              stack-label
              readonly
            />
          </div>
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              outlined
              dense
              v-model="formData.fnApprovedBY"
              label="Approved By *"
              stack-label
              readonly
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
        icon-right="check"
        label="Submit"
        type="submit"
        style="height: 45px; max-width: 140px"
      />
    </div>
  </q-form>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  name: "ForAdmission",
  emits: ["prev", "submit"],

  computed: {
    ...mapState(useFinanceStore, ["statusOptions", "allDoctors"]),
    ...mapWritableState(useFinanceStore, ["formData"]),
  },

  async mounted() {
    await this.fetchDoctors();
  },

  methods: {
    ...mapActions(useFinanceStore, ["fetchDoctors"]),

    onDoctorSelected(selectedValue) {
      const selectedDoctor = this.allDoctors.find((doc) => doc.value === selectedValue);

      if (selectedDoctor) {
        this.formData.fnDepartment = selectedDoctor.department;
      } else {
        this.formData.fnDepartment = "";
      }
    },

    onAttendingDoctorSelected(selectedValue) {
      const selectedDoctor = this.allDoctors.find((doc) => doc.value === selectedValue);

      if (selectedDoctor) {
        this.formData.fncontactatnPhysician = selectedDoctor.contactNo;
      } else {
        this.formData.fncontactatnPhysician = "";
      }
    },

    async validate() {
      return await this.$refs.admission.validate();
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
