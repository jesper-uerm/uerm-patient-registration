<template>
  <q-form ref="PersonResponsible" @submit="onSubmit" @validation-error="onError">
    <div class="row q-col-gutter-lg q-mx-lg">
      <div class="col-12">
        <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
          Person Responsible
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
              label-slot
              stack-label
              lazy-rules
              :rules="requiredRule"
              @update:model-value="onDoctorSelected"
            >
              <template v-slot:label>
                Admitting Physician<span class="text-red">*</span>
              </template>
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
              label="Department"
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
              label-slot
              lazy-rules
              :rules="requiredRule"
              @update:model-value="onAttendingDoctorSelected"
            >
              <template v-slot:label>
                Admitting Physician<span class="text-red">*</span>
              </template>
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
              label="Contact No."
              readonly
            />
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              v-model="formData.fnrmAdmission"
              label-slot
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                Room Admission<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              type="number"
              v-model="formData.fnCost"
              label-slot
              stack-label
              prefix="₱"
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                Possible Cost<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              v-model="formData.fnlengthStay"
              label-slot
              stack-label
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                Possible Length Of Stay<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              v-model="formData.fnadmProcedure"
              label-slot
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label> Procedure<span class="text-red">*</span> </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              dense
              type="number"
              v-model="formData.fnorDeposit"
              label-slot
              stack-label
              prefix="₱"
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                Operating Room Deposit<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              type="number"
              v-model="formData.fnreqDeposit"
              label-slot
              prefix="₱"
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                Requested Deposit<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              type="number"
              v-model="formData.fntoDeposit"
              label-slot
              prefix="₱"
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                To Deposit<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3 col-md-3">
            <q-input
              outlined
              stack-label
              dense
              type="number"
              v-model="formData.fntofollowDeposit"
              label-slot
              prefix="₱"
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                To Follow Deposit<span class="text-red">*</span>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              type="textarea"
              outlined
              rows="3"
              stack-label
              dense
              v-model="formData.fnadmRemarks"
              label-slot
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label> Remarks<span class="text-red">*</span> </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-6">
            <q-select
              outlined
              dense
              v-model="formData.fnStatus"
              stack-label
              label-slot
              :options="statusOptions"
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label> Status<span class="text-red">*</span> </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 col-md-6">
            <q-input
              outlined
              dense
              v-model="formData.fnEvaluatedBY"
              stack-label
              label-slot
              readonly
              lazy-rules
              :rules="requiredRule"
            >
              <template v-slot:label>
                Evaluated By<span class="text-red">*</span>
              </template>
            </q-input>
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
  name: "PersonResponsible",
  emits: ["prev", "submit"],

  data() {
    return {
      requiredRule: [(val) => !!val || "Required"],
    };
  },

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

    onSubmit() {
      this.$emit("submit");
    },

    onError() {
      this.$q.notify({
        type: "warning",
        message: "Please fill all required admission fields.",
        position: "top",
      });
    },

    onBack() {
      this.$emit("prev");
    },
  },
};
</script>
