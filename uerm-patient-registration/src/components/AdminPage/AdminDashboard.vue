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
            <div class="row justify-center">
              <div class="col-12 col-md-12 text-grey">
                <apexchart
                  width="100%"
                  height="350"
                  type="line"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </div>
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
            <div class="flex flex-center text-grey">
              <apexchart
                width="100%"
                height="300"
                type="pie"
                :options="chartOptionsPie"
                :series="seriesPie"
              ></apexchart>
            </div>
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

<script>
export default {
  name: "DashboardPage",
  data() {
    return {
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
      },
      series: [
        {
          name: "Admitted",
          data: [3000, 4000, 4500, 5000, 4900, 6000, 7000, 9111],
        },
        {
          name: "OPD",
          data: [9000, 1200, 3350, 5500, 2470, 2180, 2810, 3500],
        },
        {
          name: "ER",
          data: [6000, 5120, 3135, 4150, 6147, 5180, 4210, 5350],
        },
      ],
      seriesPie: [44, 55, 13],

      chartOptionsPie: {
        chart: {
          id: "my-pie-chart",
        },
        labels: ["Team A", "Team B", "Team C"],

        colors: ["#1976D2", "#26A69A", "#9C27B0"],

        legend: {
          position: "bottom",
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
      columns: [
        { name: "name", label: "Patient Name", field: "name", align: "left" },
        { name: "type", label: "Type", field: "type", align: "left" },
        { name: "dept", label: "Department", field: "dept", align: "left" },
        { name: "time", label: "Time In", field: "time", align: "right" },
      ],
      rows: [
        {
          id: 1,
          name: "Juan Dela Cruz",
          type: "Inpatient",
          dept: "Surgery",
          time: "09:15 AM",
        },
        {
          id: 2,
          name: "Maria Santos",
          type: "Outpatient",
          dept: "Cardiology",
          time: "09:20 AM",
        },
        {
          id: 3,
          name: "Pedro Penduko",
          type: "Returning",
          dept: "Rehab",
          time: "09:45 AM",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
