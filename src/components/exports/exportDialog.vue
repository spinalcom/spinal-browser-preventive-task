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
               v-if="!isLoading && exportState === STATES.normal"
               :disabled="contextSelected === null">
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
      states: [],
      contextSelected: null,
      groupSelected: null,
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
          events: this.getEvents(el.events)
        };
      });
    },

    getEvents(events) {
      if (this.stateSelected && this.stateSelected !== "All") {
        return events[this.stateSelected];
      }
      let data = [];

      for (const key in events) {
        if (events.hasOwnProperty(key)) {
          data.push(...events[key]);
        }
      }

      return data;
    },

    exportExcelFile() {
      let dataToExport = this.getDataToExport();

      console.log(dataToExport);
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