<template>
  <q-dialog
    v-model="ReturningPatientFormDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      style="
        width: 850px;
        max-width: 95vw;
        display: flex;
        flex-direction: column;
        height: 40vh;
      "
    >
      <q-card-section
        class="column text-center text-white q-py-md relative-position"
        style="background-color: #004aad"
      >
        <div class="text-h6 text-bold">SELECT PATIENT TYPE</div>
        <div class="text-caption text-white-7" style="line-height: 1.2">
          Please select a category to proceed
        </div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="absolute-right q-ma-lg"
        />
      </q-card-section>

      <q-card-section class="col flex flex-center bg-grey-1">
        <div class="row q-gutter-xl justify-center items-center full-width">
          <q-card
            class="cursor-pointer selection-card column flex-center"
            @click="openReturningPatientFormInpatient"
            v-ripple
          >
            <q-card-section class="text-center no-padding">
              <q-icon name="bedroom_parent" size="60px" class="q-mb-md transition-icon" />
              <div class="text-h5 text-weight-bold">INPATIENT</div>
              <div class="text-caption text-uppercase q-mt-sm opacity-fade">
                Admit Existing Patient
              </div>
            </q-card-section>
          </q-card>

          <q-card
            class="cursor-pointer selection-card column flex-center"
            @click="openReturningPatientFormOutpatient"
            v-ripple
          >
            <q-card-section class="text-center no-padding">
              <q-icon name="person_search" size="60px" class="q-mb-md transition-icon" />
              <div class="text-h5 text-weight-bold">OUTPATIENT</div>
              <div class="text-caption text-uppercase q-mt-sm opacity-fade">
                Consultation / Check-up
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

      <ReturningInpatient ref="ReturningInpatientDialog" />
      <ReturningOutpatient ref="ReturningOutpatientDialog" />
    </q-card>
  </q-dialog>
</template>

<script>
import ReturningInpatient from "components/ReturningPatient/ReturningInpatient.vue";
import ReturningOutpatient from "src/components/ReturningPatient/ReturningOutpatient.vue";

export default {
  name: "ReturningPatientForm",
  components: {
    ReturningInpatient,
    ReturningOutpatient,
  },
  data() {
    return {
      ReturningPatientFormDialog: false,
    };
  },
  methods: {
    show() {
      this.ReturningPatientFormDialog = true;
    },
    openReturningPatientFormInpatient() {
      this.$refs.ReturningInpatientDialog?.show();
    },
    openReturningPatientFormOutpatient() {
      this.$refs.ReturningOutpatientDialog?.show();
    },
  },
};
</script>

<style scoped lang="scss">
.selection-card {
  width: 300px;
  height: 220px; /* Fixed height for consistency */
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  background: white;
  color: #004aad;
  border: 2px solid transparent; /* Invisible border to prevent layout shift */
  box-shadow: 0 4px 15px rgba(0, 74, 173, 0.1); /* Subtle blue shadow */
}

.selection-card:hover {
  transform: translateY(-8px);
  background: #004aad;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 74, 173, 0.4); /* Stronger shadow */
}

.opacity-fade {
  opacity: 0.7;
}
.selection-card:hover .opacity-fade {
  opacity: 1;
}
</style>
