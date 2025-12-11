<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder">213</div>
              <div class="text-subtitle2">Admitted</div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon name="groups" size="50px" class="opacity-50" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder">86</div>
              <div class="text-subtitle2">OPD</div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon name="groups" size="50px" class="opacity-50" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder">172</div>
              <div class="text-subtitle2">ER</div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon name="groups" size="50px" class="opacity-50" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-8">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h6">Weekly Registration Trends</div>
          </q-card-section>
          <q-card-section>
            <div class="flex flex-center text-grey">
              [Line Chart Placeholder: Inpatient vs Outpatient]
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h6">By Department</div>
          </q-card-section>
          <q-card-section>
            <div class="flex flex-center text-grey">[Donut Chart Placeholder]</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Real-time Admissions</div>
        <q-space />
        <q-btn icon="file_download" flat round dense tooltip="Export CSV" />
      </q-card-section>

      <q-card-section>
        <q-table :rows="rows" :columns="columns" row-key="id" flat bordered>
          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.type === 'Inpatient' ? 'red-8' : 'green-8'"
                :label="props.row.type"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const columns = [
  { name: "name", label: "Patient Name", field: "name", align: "left" },
  { name: "type", label: "Type", field: "type", align: "left" },
  { name: "dept", label: "Department", field: "dept", align: "left" },
  { name: "time", label: "Time In", field: "time", align: "right" },
  { name: "time", label: "Time In", field: "time", align: "right" },
  { name: "time", label: "Time In", field: "time", align: "right" },
  { name: "time", label: "Time In", field: "time", align: "right" },
  { name: "time", label: "Time In", field: "time", align: "right" },
];

const rows = ref([
  { id: 1, name: "Juan Dela Cruz", type: "Inpatient", dept: "Surgery", time: "09:15 AM" },
  {
    id: 2,
    name: "Maria Santos",
    type: "Outpatient",
    dept: "Cardiology",
    time: "09:20 AM",
  },
  { id: 3, name: "Pedro Penduko", type: "Returning", dept: "Rehab", time: "09:45 AM" },
]);
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
