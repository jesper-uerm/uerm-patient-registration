<template>
  <q-page class="q-pa-md bg-grey-2 q-py-xl">
    <div class="row justify-center q-mx-md">
      <div class="col-12 col-xl-10">
        <div class="row items-center justify-between q-mb-md">
          <div class="row text-uppercase">
            <div>
              <div
                class="text-h6 text-weight-bold text-blue-10"
                style="letter-spacing: -0.5px"
              >
                Inpatient Search
              </div>
              <div class="text-caption text-grey-7">
                Manage and view currently admitted patients
              </div>
            </div>
          </div>
          <div style="width: 300px">
            <q-input
              dense
              borderless
              rounded
              v-model="searchQuery"
              placeholder="Search patient..."
              class="shadow-1"
              input-class="text-grey-8"
              @keyup.enter="handleSearch"
              @update:model-value="debouncedSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" class="text-grey-4" />
              </template>

              <template v-slot:append>
                <q-spinner v-if="loading" color="blue-8" size="xs" />
              </template>
            </q-input>
          </div>
        </div>

        <q-card class="shadow-2 rounded-borders">
          <q-table
            :rows="patientList"
            :columns="columns"
            row-key="patient_id"
            :loading="loading"
            flat
            :dense="$q.screen.lt.md"
            :grid="$q.screen.lt.md"
            :pagination="{ rowsPerPage: 10 }"
            class="sticky-header-table"
          >
            <template v-slot:body-cell-fullName="props">
              <q-td :props="props">
                <div class="row items-center no-wrap">
                  <q-avatar
                    size="35px"
                    class="q-mr-md"
                    :color="getAvatarColor(props.row.gender)"
                    text-color="white"
                  >
                    {{ getInitials(props.row.firstName, props.row.lastName) }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-grey-9">
                      {{ props.row.lastName }}, {{ props.row.firstName }}
                    </div>
                    <div class="text-caption text-grey-5">
                      ID: <span class="text-mono">{{ props.row.patient_id }}</span>
                    </div>
                  </div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-gender="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.gender === 'Male' ? 'blue-1' : 'pink-1'"
                  :text-color="props.row.gender === 'Male' ? 'blue-9' : 'pink-9'"
                  class="q-px-sm q-py-xs"
                  rounded
                >
                  {{ props.row.gender }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <div class="row justify-center q-gutter-x-sm">
                  <q-btn
                    flat
                    round
                    dense
                    color="grey-7"
                    icon="visibility"
                    class="hover-icon"
                    @click="viewPatient(props.row)"
                  >
                    <q-tooltip>View Details</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    color="grey-7"
                    icon="print"
                    class="hover-icon"
                    @click="printPatient(props.row)"
                  >
                    <q-tooltip>Print Record</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width column flex-center q-pa-lg text-grey-5">
                <q-icon name="assignment_ind" size="4rem" class="q-mb-md opacity-50" />
                <div class="text-h6" v-if="!hasSearched">Ready to Search</div>
                <div class="text-h6" v-else>No patients found</div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
import axios from "axios";
import _ from "lodash";

export default {
  name: "InpatientList",
  data() {
    return {
      searchQuery: "",
      loading: false,
      hasSearched: false,
      patientList: [],

      columns: [
        {
          name: "fullName",
          label: "Patient Information",
          field: "fullName",
          align: "left",
          sortable: true,
        },
        {
          name: "gender",
          label: "Sex",
          field: "gender",
          align: "center",
          style: "width: 120px",
        },
        {
          name: "birthdate",
          label: "Birthdate",
          field: "birthdate",
          align: "left",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
          classes: "text-grey-8",
        },
        {
          name: "addressPresent",
          label: "Address",
          field: "addressPresent",
          align: "left",
          classes: "ellipsis",
          style: "max-width: 200px;",
        },
        {
          name: "actions",
          label: "",
          field: "actions",
          align: "center",
          style: "width: 200px",
        },
      ],
    };
  },

  mounted() {
    this.loadInitialData();
  },

  methods: {
    async loadInitialData() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3000/api/auth/fetchInpatient");
        this.patientList = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      if (this.searchQuery === "") {
        this.loadInitialData();
        this.hasSearched = false;
        return;
      }

      if (this.searchQuery.length < 2) {
        this.$q.notify({
          type: "warning",
          message: "Please enter at least 2 characters",
          position: "top",
        });
        return;
      }

      this.performSearch();
    },
    debouncedSearch: _.debounce(function () {
      if (this.searchQuery && this.searchQuery.length >= 2) {
        this.performSearch();
      }
    }, 400),
    async performSearch() {
      this.loading = true;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/searchInpatient",
          {
            params: { query: this.searchQuery },
          }
        );

        this.patientList = response.data;
        this.hasSearched = true;

        if (this.patientList.length === 0) {
          this.$q.notify({
            type: "info",
            message: "No records found.",
            icon: "info",
            position: "top",
          });
        }
      } catch (error) {
        console.error(error);
        this.$q.notify({ type: "negative", message: "Search Failed", position: "top" });
      } finally {
        this.loading = false;
      }
    },

    getInitials(firstName, lastName) {
      return (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "");
    },
    getAvatarColor(gender) {
      return gender === "Male" ? "blue-9" : "pink-6";
    },

    viewPatient(row) {
      this.$q.notify({ type: "primary", message: `Viewing ${row.lastName}` });
    },
    printPatient(row) {
      this.$q.notify({ type: "positive", message: `Printing ${row.lastName}` });
    },
  },
};
</script>

<style scoped lang="scss">
.q-table tbody tr {
  transition: background-color 0.2s ease;
}
.q-table tbody tr:hover {
  background-color: #f8fbff !important;
}

.hover-icon {
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}
.hover-icon:hover {
  opacity: 1;
  transform: scale(1.1);
  color: #004aad !important;
}

.text-mono {
  font-family: "Consolas", "Monaco", monospace;
  font-size: 0.85em;
  background: #f1f1f1;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
