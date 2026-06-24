<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0; border-radius: 8px">
      <q-card-section class="col-auto q-py-md q-px-lg" style="background-color: #004aad">
        <div class="row items-left text-left justify-left text-uppercase">
          <div>
            <div
              class="text-h6 text-white text-weight-bold"
              style="letter-spacing: -0.5px"
            >
              Patient List Search
            </div>

            <div class="text-caption text-grey-5">
              Search database for patient records
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="col-auto q-py-md q-px-lg bg-grey-1">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Enter Name or ID"
          class="bg-white"
          :disable="loading"
          debounce="500"
          @update:model-value="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-grey-5" />
          </template>

          <template v-slot:after>
            <q-btn
              unelevated
              color="blue-10"
              label="Search"
              class="q-px-lg"
              @click="handleSearch"
              :loading="loading"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="col q-pa-none q-mx-lg q-mb-md">
        <q-table
          bordered
          flat
          class="clean-table fit"
          row-key="PATIENTREGID"
          :rows="patientList"
          :columns="columns"
          :loading="loading"
          :rows-per-page-options="[10]"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
          @row-click="(evt, row) => $refs.financialStatementRef.openFinancialDialog(row)"
        >
          <template v-slot:body-cell-patient_no="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium text-uppercase">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-patientType="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value == 'INPATIENT'"
                color="blue-6"
                label="Inpatient"
                outline
              />
              <q-badge
                v-else-if="props.value == 'EMERGENCY'"
                color="red-6"
                label="Emergency Patient"
                outline
              />
              <q-badge
                v-if="props.value == 'OUTPATIENT'"
                color="blue-grey-6"
                label="Outpatient"
                outline
              />
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="blue-10" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.firstName }} {{ props.row.lastName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.PATIENTREGID }}</q-item-label>
                    <q-item-label caption="">
                      Status:
                      <span v-if="props.row.forReview == 0" class="text-red">
                        For Review
                      </span>
                      <span v-else-if="props.row.forReview == 1" class="text-green">
                        Reviewed
                      </span>
                      <span v-else>
                        {{ props.row.PATIENTREGID }}
                      </span>
                    </q-item-label>
                  </q-item-section>

                  <!-- small screen -->

                  <q-item-section side>
                    <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                      <q-menu cover auto-close>
                        <q-list style="min-width: 150px">
                          <q-item clickable @click="handlePrint(props.row)">
                            <q-item-section avatar>
                              <q-icon name="print" color="green-8" />
                            </q-item-section>

                            <q-item-section>Print Record</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="blue-10" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width column flex-center text-grey-5 q-pa-xl">
              <q-icon size="4em" name="person_search" class="q-mb-md" />

              <div class="text-subtitle1" v-if="!hasSearched">
                Ready to Search Inpatients
              </div>

              <div class="text-subtitle1" v-else>
                No patients found matching "{{ searchQuery }}"
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <financial-statement ref="financialStatementRef" />
  </q-page>
</template>
<script>
import FinancialStatement from "src/components/FinancePage/FinancialStatement.vue";
import { date } from "quasar";
import { mapState, mapActions, mapWritableState } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default {
  name: "PatientFinanceList",
  components: { FinancialStatement },

  data() {
    return {
      searchQuery: "",
      viewDialog: false,
      columns: [
        {
          name: "PATIENTNO",
          label: "PATIENTNO",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
          style: "width: 120px; font-weight: bold",
          format: (val) => (Array.isArray(val) ? val[0] : val ? val : "N/A"),
        },

        // {
        //   name: "CASENO",
        //   label: "Case No.",
        //   field: "CASENO",
        //   align: "center",
        //   sortable: true,
        //   style: "width: 120px; font-weight: bold",
        //   format: (val) => (val ? val : "N/A"),
        // },
        {
          name: "fullName",
          label: "NAME",
          field: "fullName",
          align: "center",
          sortable: true,
          style: "width: 250px",
        },
        {
          name: "birthdateStr",
          label: "BIRTHDATE",
          field: "birthdateStr",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-7",
          style: "width: 120px",
        },
        {
          name: "patientType",
          label: "PATIENT TYPE",
          field: "patientType",
          align: "center",
          sortable: true,
          style: "width: 120px",
        },
        {
          name: "CREATEDAT",
          label: "DATE ADDED",
          field: "CREATEDAT",
          align: "center",
          sortable: true,
          format: (val) =>
            val ? date.formatDate(val.replace("Z", ""), "MMM D, YYYY h:mm A") : "-",
          style: "width: 180px",
        },
      ],
    };
  },

  computed: {
    ...mapState(useFinanceStore, [
      "patientList",
      "fetchPatientsFinance",
      "loading",
      "hasSearched",
    ]),
    ...mapWritableState(useFinanceStore, ["selectedPatient"]),
  },

  mounted() {
    this.fetchPatientsFinance();
  },

  methods: {
    ...mapActions(useFinanceStore, ["searchPatientList"]),

    handleSearch() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.fetchPatientsFinance();
      } else {
        this.searchPatientList(query);
      }
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },
  },
};
</script>

<style scoped>
.clean-table :deep(.q-table__top),
.clean-table :deep(.q-table__bottom),
.clean-table :deep(thead tr:first-child th) {
  border-bottom: 1px solid #f0f0f0;
}

.clean-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  background-color: #f8f9fa;
}

.clean-table :deep(tbody tr:hover) {
  background: #fafafa !important;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #004aad 0%, #002a66 100%);
}

.rounded-borders {
  border-radius: 12px;
}

.header-title {
  letter-spacing: 0.7px;
}
</style>
