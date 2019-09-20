<template>

  <v-dialog v-model="showDialog"
            persistent
            max-width="400">
    <v-card>

      <v-card-title class="vCardTitle">
        Export
      </v-card-title>

      <v-card-text class="vCartContainer">

        <div class="_container"
             v-if="!isLoading"
             :class="{'loadingContainer' : exportState !== STATES.normal}">

          <!--
              if state === normal
           -->
          <div v-if="exportState === STATES.normal">
            <!--
                  context Select
               -->
            <v-select v-model="contextSelected"
                      :items="allContexts"
                      item-value="id"
                      item-text="name"
                      label="Select Context"
                      @change="selectContext">
            </v-select>

            <!--
                Group Select
            -->
            <v-select v-model="groupSelected"
                      :items="groups"
                      item-value="id"
                      item-text="name"
                      label="Select Group"
                      @change="selectGroup"
                      :persistent-hint="true"
                      hint="it will export all groups if no one selected">
            </v-select>

            <!--
                Visit Select
            -->
            <v-select v-if="groupSelected && groupSelected !== 'All'"
                      v-model="visitSelected"
                      :items="visits"
                      item-value="id"
                      item-text="name"
                      label="Select Visit"
                      :persistent-hint="true"
                      hint="it will export all visits if no one selected">
            </v-select>

            <!--
                Group Select
            -->
            <v-select v-model="stateSelected"
                      :items="states"
                      item-value="state"
                      item-text="name"
                      label="Select state"
                      :persistent-hint="true"
                      hint="it will export all events if no one selected">
            </v-select>

          </div>

          <!--
              if state !== null
           -->
          <div v-else>
            <div class="message"
                 v-if="exportState === STATES.success">
              <v-icon color="green"
                      large>check</v-icon>
              <div>Success</div>
            </div>

            <div class="message"
                 v-else>
              <v-icon color="red"
                      large>close</v-icon>
              <div>Something went wrong</div>
            </div>

          </div>

        </div>

        <!--
          Loading
        -->
        <div class="_container loadingContainer"
             v-if="isLoading">
          <v-progress-circular :size="70"
                               :width="7"
                               color="blue"
                               indeterminate></v-progress-circular>
        </div>

      </v-card-text>

      <v-card-actions class="cardActions">
        <v-btn flat
               @click="closeEventDialog"
               color="red"
               outline>
          <v-icon>close</v-icon>
          close
        </v-btn>

        <v-btn flat
               color="blue"
               outline
               @click="exportExcelFile"
               v-if="exportState === STATES.normal"
               :disabled="contextSelected === null || isLoading">
          <v-icon>open_in_browser</v-icon>
          Export
        </v-btn>

        <v-btn flat
               color="blue"
               outline
               v-if="!isLoading && exportState !== STATES.normal"
               @click="reInitState">
          <v-icon>cached</v-icon>
          &nbsp;
          {{exportState === STATES.success ? "Export Another" : "Retry" }}
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>


<script>
import exportFile from "../../js/excel";
import FileSaver from "file-saver";

export default {
  name: "exportDialog",
  props: ["showDialog", "data"],
  mounted() {
    if (this.data) {
      this.allContexts = this.data.map(el => {
        return {
          id: el.id,
          name: el.name
        };
      });
    }
  },
  data() {
    this.STATES = Object.freeze({
      normal: 0,
      success: 1,
      error: 2
    });

    return {
      allContexts: [],
      groups: [],
      visits: [],
      states: [],
      contextSelected: null,
      groupSelected: null,
      visitSelected: null,
      stateSelected: null,
      isLoading: false,
      exportState: this.STATES.normal
    };
  },
  methods: {
    getDataToExport() {
      let data = this.groups.filter(el => el.id);

      if (this.groupSelected && this.groupSelected !== "All") {
        data = this.groups.filter(el => el.id && el.id == this.groupSelected);
      }

      return data.map(el => {
        return {
          id: el.id,
          color: el.color,
          name: el.name,
          visits: this.getVisitSelected(el.visits, el.events)
        };
      });
    },

    getVisitSelected(visits, events) {
      let data = visits;
      if (this.visitSelected && this.visitSelected !== "All") {
        data = data.filter(el => el.id === this.visitSelected);
      }

      return data.map(el => {
        let ev = [];

        for (const key in events) {
          if (events.hasOwnProperty(key)) {
            ev.push(...events[key]);
          }
        }

        el["events"] = this.getEvents(
          ev.filter(element => element.visitId === el.id)
        );

        return el;
      });
    },

    getEvents(events) {
      if (this.stateSelected && this.stateSelected !== "All") {
        return events.filter(el => el.state === this.stateSelected);
      }

      return events;
    },

    exportExcelFile() {
      let dataToExport = this.getDataToExport();
      let zipName = this.allContexts.find(el => el.id === this.contextSelected);

      this.isLoading = true;

      exportFile(dataToExport)
        .then(zip => {
          zip
            .generateAsync({ type: "blob" })
            .then(content => {
              FileSaver.saveAs(content, `${zipName.name}.zip`);
              this.isLoading = false;
              this.exportState = this.STATES.success;
            })
            .catch(() => {
              this.isLoading = false;
              this.exportState = this.STATES.error;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.exportState = this.STATES.error;
        });
    },

    selectContext() {
      this.groups = [];
      let found = this.data.find(el => el.id === this.contextSelected);

      if (found) {
        this.groups = [{ id: undefined, name: "All" }, ...found.groups];
      }

      this.groupSelected = null;
    },
    selectGroup() {
      if (this.groupSelected != null) {
        this.states = [
          {
            name: "All",
            state: undefined
          },
          {
            name: "Déclaré",
            state: "declared"
          },
          {
            name: "En cours",
            state: "processing"
          },
          {
            name: "Effectué",
            state: "done"
          }
        ];

        let found = this.groups.find(el => el.id === this.groupSelected);

        this.visits = found ? found.visits : [];
        this.visitSelected = null;
      } else {
        this.stateSelected = null;
      }
    },
    closeEventDialog() {
      this.$emit("close");
    },
    reInitState() {
      this.exportState = this.STATES.normal;
    }
  },
  watch: {
    data() {
      if (this.data) {
        this.allContexts = this.data.map(el => {
          return {
            id: el.id,
            name: el.name
          };
        });
      }
    }
  }
};
</script>

<style scoped>
.cardActions {
  justify-content: flex-end;
}

.vCardTitle {
  width: 100%;
  justify-content: center;
  font-size: 1.3em;
  font-weight: bold;
}

._container {
  width: 100%;
  height: 300px;
}

._container.loadingContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.exportStateIcon {
  width: 30px;
  height: 50px;
}

.message {
  text-align: center;
  color: grey;
  font-size: 1.6em;
  font-weight: bold;
}
</style>