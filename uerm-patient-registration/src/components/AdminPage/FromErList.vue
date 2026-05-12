<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0; border-radius: 8px">
      <q-card-section class="q-py-md q-px-lg" style="background-color: #004aad">
        <div class="text-h6 text-white text-weight-bold">FROM EMERGENCY ROOM</div>
        <div class="text-caption text-grey-5">Search inpatient records</div>
      </q-card-section>

      <q-card-section class="q-py-md q-px-lg bg-grey-1">
        <q-input
          outlined
          dense
          v-model="localSearchQuery"
          placeholder="Enter Name or ID"
          @keyup.enter="handleSearch"
          :disable="loading"
          class="bg-white"
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

      <q-card-section class="q-pa-none q-mx-lg q-mb-md">
        <q-table
          bordered
          :rows="patientListfromER"
          :columns="columns"
          row-key="PATIENTREGID"
          :loading="loading"
          flat
          virtual-scroll
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
          @row-click="(evt, row) => $refs.admittingFormRef.openadmittingDialog(row)"
        >
          <template v-slot:body-cell-CASENO="props">
            <q-td :props="props">
              <span class="text-weight-bold text-grey-8">
                {{ props.value || "N/A" }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-PATIENTNO="props">
            <q-td :props="props">
              <span class="text-weight-bold text-grey-8">
                {{ props.value || "N/A" }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 200px">
              <div class="ellipsis text-grey-7">
                {{ props.row.addressPresent }}
                <q-tooltip>{{ props.row.addressPresent }}</q-tooltip>
              </div>
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
                      {{ props.row.fullName }}
                    </q-item-label>
                    <q-item-label caption>
                      ID: {{ props.row.PATIENTREGID }}
                    </q-item-label>
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
    <admitting-form ref="admittingFormRef" />
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";
import AdmittingForm from "src/components/AdminPage/AdmittingForm.vue";

export default {
  name: "FromErList",
  components: { AdmittingForm },

  data() {
    return {
      columns: [
        {
          name: "CASENO",
          label: "CASENO",
          field: "CASENO",
          align: "center",
          sortable: true,
        },
        {
          name: "PATIENTNO",
          label: "PATIENTNO",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
        },
        {
          name: "fullName",
          label: "NAME",
          field: "fullName",
          align: "left",
          sortable: true,
        },
        {
          name: "birthdate",
          label: "BIRTHDATE",
          field: "birthdate",
          format: (val) => this.formatDate(val),
          align: "center",
        },
        {
          name: "gender",
          label: "SEX",
          field: "gender",
          align: "center",
        },
        {
          name: "addressPresent",
          label: "ADDRESS",
          field: "addressPresent",
          align: "left",
        },
      ],
    };
  },

  computed: {
    ...mapState(useInpatientStore, [
      "patientListfromER",
      "loading",
      "searchQuery",
      "hasSearched",
    ]),

    localSearchQuery: {
      get() {
        return this.searchQuery;
      },
      set(val) {
        this.useInpatientStore().searchQuery = val;
      },
    },
  },

  mounted() {
    this.fetchFromErList();
  },

  methods: {
    ...mapActions(useInpatientStore, ["fetchFromErList", "searchPatients"]),

    useInpatientStore,

    handleSearch() {
      if (!this.localSearchQuery) {
        this.fetchFromErList();
        return;
      }

      if (this.localSearchQuery.length < 2) {
        this.$q.notify({
          type: "warning",
          message: "Please enter at least 2 characters",
        });
        return;
      }

      this.searchPatients(this.localSearchQuery);
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

.clean-table :deep(td),
.clean-table :deep(th) {
  border-bottom: 1px solid #f5f5f5;
}
</style>
