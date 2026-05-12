<template>
  <q-card-section>
    <q-form ref="CaseInformation" @submit="onNext" @validation-error="onError">
      <div class="row q-mx-xs">
        <div class="col-12">
          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Case Information
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cPatientno"
                label="Patient No."
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cFullname"
                label="Full Name"
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cBirthdate"
                label="Birth Date"
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cAge"
                label="Age"
                stack-label
                readonly
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cSeniorNo"
                label="Senior Citizen No."
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cPwdNo"
                label="PWD No."
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cPatientType"
                :options="[
                  { label: 'In-patient', value: 'IPD' },
                  { label: 'Out-patient', value: 'OPD' },
                ]"
                emit-value
                map-options
                label="Patient Type"
                stack-label
                readonly
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cAdmissionDate"
                label="Date of Admission"
                stack-label
                readonly
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                type="date"
                v-model="formData.cDateDisc"
                label="Date of Discharge"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-select
                outlined
                dense
                :options="allRooms || []"
                v-model="formData.CRoom"
                label="Room"
                stack-label
                emit-value
                map-options
                @update:model-value="onRoomSelected"
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.CRoomRate"
                label="Room Rate"
                stack-label
                prefix="₱"
                readonly
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cChiefComplaint"
                stack-label
                label="Chief Complaint"
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cAdmissionDiag"
                stack-label
                label="Admission Diagnosis"
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cAdmissionType"
                stack-label
                label="Admission Type"
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cServiceType"
                stack-label
                label="Service Type"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cPhic"
                stack-label
                label="PHIC Membership"
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cCaseType"
                stack-label
                label="Case Type"
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cDoc"
                label="Doc Presented On"
                stack-label
                type="date"
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cWatcherID"
                label="Watcher's ID"
                stack-label
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md items-center">
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cErPatient" label="E.R Patient" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cConfidential" label="Confidential" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cIndigent" label="Indigent" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cVIP" label="VIP" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cPay" label="Pay" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cCharity" label="Charity" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cPatho" label="Non-Pathologic" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cOrSched" label="For OR Schedule" />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox
                v-model="formData.cEmpDependent"
                label="UERM Employee Dependent"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.cRemarks"
                label="Remarks"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.cAllergies"
                label="Allergies"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.cAdmittedBy"
                label="Admitted By"
                stack-label
              />
            </div>
          </div>

          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Patient Category
          </div>

          <div class="row q-col-gutter-sm items-center q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cWalkin" label="Walk-in" />
            </div>

            <div class="col-12 col-sm-3 col-md-3">
              <q-checkbox v-model="formData.cNewborn" label="Newborn" />
            </div>

            <div class="col-12 col-sm-4 col-md-4" v-if="formData.cNewborn">
              <q-input
                outlined
                dense
                v-model="formData.cMotherCaseno"
                label="Mother's Case No."
                stack-label
              />
            </div>
          </div>
          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Medical Social Service
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.cTypeClass"
                label="Type"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                type="date"
                v-model="formData.cValidity"
                label="Valid Until"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-4 col-md-4">
              <q-input
                outlined
                dense
                v-model="formData.cClassifiedBy"
                label="Classified By"
                stack-label
              />
            </div>
          </div>
          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Payment Plan
          </div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cCompany"
                label="Company"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input outlined dense v-model="formData.cHMO" label="HMO" stack-label />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cEmployer"
                label="Employer"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cCardNo"
                label="Card No"
                stack-label
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cCoverageAmount"
                label="Coverage Amount"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cAppCode"
                label="App Code"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                type="date"
                v-model="formData.cEffectivity"
                label="Effectivity"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-3 col-md-3">
              <q-input
                outlined
                dense
                v-model="formData.cRoomPlan"
                label="Room Plan"
                stack-label
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="formData.cLoaNo"
                label="LOA No"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="formData.cApprovalNo"
                label="Approval No"
                stack-label
              />
            </div>
          </div>
          <div class="text-caption2 q-mb-md q-py-sm bg-grey-4 text-center text-uppercase">
            Infirmary
          </div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="formData.cCencus"
                label="UERM Census"
                stack-label
              />
            </div>
            <div class="col-12 col-sm-6 col-md-6">
              <q-input
                outlined
                dense
                v-model="formData.cDepartment"
                label="Department"
                stack-label
              />
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
          style="height: 45px; width: 120px"
        />
      </div>
    </q-form>
  </q-card-section>
</template>

<script>
import { mapWritableState, mapState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";

export default {
  name: "CaseInformation",
  emits: ["next"],

  data() {
    return {};
  },

  computed: {
    ...mapState(useInpatientStore, ["allRooms"]),
    ...mapWritableState(useInpatientStore, ["formData"]),
  },

  async mounted() {
    await this.fetchRooms();
  },

  methods: {
    ...mapActions(useInpatientStore, ["fetchRooms"]),

    onRoomSelected(selectedValue) {
      const selectedRoom = this.allRooms.find((room) => room.value === selectedValue);
      if (selectedRoom && selectedRoom.rate) {
        this.formData.CRoomRate = selectedRoom.rate;
      } else {
        this.formData.CRoomRate = "";
      }
    },

    onNext() {
      this.$emit("next", this.formData);
    },

    onError() {
      this.$q.notify({
        type: "warning",
        message: "Please fill all required fields.",
        position: "top",
      });
    },
  },
};
</script>
