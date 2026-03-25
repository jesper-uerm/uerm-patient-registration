<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-4 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder text-h5">
                <q-spinner v-if="loading" color="white" size="0.8em" />
                <span v-else>{{ inpatientCount }}</span>
              </div>
              <div :class="['text-subtitle2', { 'text-caption': $q.screen.lt.md }]">
                Admitted
              </div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon
                name="groups"
                class="opacity-50"
                :size="$q.screen.lt.md ? '40px' : '50px'"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder text-h5">
                <q-spinner v-if="loading" color="white" size="0.8em" />
                <span v-else>{{ outpatientCount }}</span>
              </div>
              <div :class="['text-subtitle2', { 'text-caption': $q.screen.lt.md }]">
                OPD
              </div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon
                name="groups"
                class="opacity-50"
                :size="$q.screen.lt.md ? '40px' : '50px'"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder text-h5">
                <q-spinner v-if="loading" color="white" size="0.8em" />
                <span v-else>{{ erpatientCount }}</span>
              </div>
              <div :class="['text-subtitle2', { 'text-caption': $q.screen.lt.md }]">
                ER
              </div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon
                name="groups"
                class="opacity-50"
                :size="$q.screen.lt.md ? '40px' : '50px'"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-7">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h7 text-weight-bold text-center text-uppercase">
              Monthly Registration Trends
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 col-md-12 text-grey">
                <apexchart
                  width="100%"
                  height="350"
                  type="line"
                  :options="chartOptionsLine"
                  :series="lineSeries"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h7 text-weight-bold text-center text-uppercase">
              By Patient Type
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 col-md-12 text-grey">
                <apexchart
                  width="100%"
                  height="320"
                  type="pie"
                  :options="chartOptionsPie"
                  :series="pieSeries"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="no-shadow" style="border: 1px solid #f0f0f0">
      <q-card-section class="row items-center q-pb-none q-mb-md">
        <div class="text-h7 text-weight-bold text-center text-uppercase">
          Real-time Admissions
        </div>
        <q-space />
        <q-btn icon="file_download" flat round dense color="grey-7">
          <q-tooltip>Export CSV</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          :rows="patientList"
          :columns="columns"
          row-key="ID"
          :loading="loading"
          flat
          :rows-per-page-options="[5, 10]"
          class="clean-table"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-PATIENTNO="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-badge
                rounded
                class="q-px-sm q-py-xs"
                :color="
                  props.row.PATIENTTYPE === 'Emergency' || props.row.PATIENTTYPE === 'ER'
                    ? 'red-1'
                    : props.row.PATIENTTYPE === 'Inpatient'
                    ? 'green-1'
                    : 'blue-1'
                "
                :text-color="
                  props.row.PATIENTTYPE === 'Emergency' || props.row.PATIENTTYPE === 'ER'
                    ? 'red-9'
                    : props.row.PATIENTTYPE === 'Inpatient'
                    ? 'green-9'
                    : 'blue-9'
                "
                :label="props.row.PATIENTTYPE"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  name: "DashboardPage",
  data() {
    return {
      columns: [
        {
          name: "PATIENTNO",
          label: "Patient ID",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
          style: "width: 100px",
        },
        {
          name: "fullName",
          label: "Name",
          field: "fullName",
          align: "center",
          sortable: true,
        },
        { name: "type", label: "Type", field: "patientType", align: "center" },
        {
          name: "createdAt",
          label: "Date",
          field: "createdAt",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
        },
      ],
    };
  },
  computed: {
    ...mapState(useFinanceStore, [
      "patientList",
      "loading",
      "inpatientCount",
      "outpatientCount",
      "erpatientCount",
      "pieSeries",
      "pieLabels",
      "lineSeries",
      "lineCategories",
    ]),

    chartOptionsPie() {
      return {
        chart: { id: "patient-type-pie" },
        labels: this.pieLabels,
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
        legend: { position: "bottom" },
        noData: { text: "Loading..." },
      };
    },

    chartOptionsLine() {
      return {
        chart: { id: "weekly-trend" },
        xaxis: {
          categories: this.lineCategories,
          labels: {
            formatter: function (value) {
              if (!value) return "";
              const date = new Date(value + "-01");
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            },
          },
        },
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
      };
    },
  },
  mounted() {
    this.loadAllData();
  },
  methods: {
    ...mapActions(useFinanceStore, [
      "fetchAllPatients",
      "fetchPieData",
      "fetchTrendData",
    ]),

    async loadAllData() {
      this.fetchPieData();
      this.fetchTrendData();

      try {
        await this.fetchAllPatients();
      } catch (error) {
        console.error("Dashboard failed to load patient data", error);
      }
    },
  },
};
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
