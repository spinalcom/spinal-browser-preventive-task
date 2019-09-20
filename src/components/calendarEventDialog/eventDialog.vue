<template>
  <v-dialog v-model="showDialog"
            persistent
            max-width="450">
    <v-card v-if="selectedEvent">

      <v-card-title class="vCardTitle">
        <div class="title">
          <div class="color"
               :class="selectedEvent.class"></div>
          <div class="text">{{ selectedEvent.title }}</div>
        </div>

        <div class="eventDate">
          <div class="date">
            <span>{{new Date(selectedEvent.startDate).toLocaleDateString("fr-FR",{weekday: "long", year: "numeric", month: "long", day: "numeric"})}}</span>
          </div>
        </div>

      </v-card-title>

      <v-card-text>

        <item-component :icon="'information'"
                        :title="'Description'"
                        :description="displayDescription(visit.description)">
        </item-component>

        <item-component :icon="'schedule'"
                        :title="'Intervention Time'"
                        :description="displayInterventionTime(visit.intervention)">
        </item-component>

      </v-card-text>

      <v-card-actions class="cardActions">
        <v-btn flat
               @click="closeEventDialog"
               class="closeBtn">close</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import itemComponent from "./item.vue";
import utilities from "../../js/utilities";
export default {
  name: "eventDialog",
  components: {
    "item-component": itemComponent
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    selectedEvent: {
      type: Object
    }
  },
  data() {
    return {
      visit: {}
    };
  },
  methods: {
    closeEventDialog() {
      this.$emit("close");
    },
    displayInterventionTime(intervention) {
      return intervention &&
        intervention.number !== "" &&
        intervention.mesure !== ""
        ? `${intervention.number} ${intervention.mesure}`
        : "No Intervention Time";
    },

    displayDescription(description) {
      return description && description.trim().length > 0
        ? description
        : "No description";
    }
  },
  watch: {
    selectedEvent(newValue) {
      utilities
        .getVisitInfoById(
          newValue.contextId,
          newValue.groupId,
          newValue.visitId
        )
        .then(res => {
          this.visit = res;
        });
    }
  }
};
</script>

<style scoped>
.cardActions {
  justify-content: flex-end;
}

.closeBtn {
  color: red;
}

.vCardTitle {
  width: 100%;
}

.vCardTitle .title {
  width: 100%;
  display: flex;
  align-items: center;
}

.vCardTitle .text {
  font-size: 1.2em;
}

.vCardTitle .eventDate {
  margin-left: 30px;
  margin-top: 5px;
  font-size: 13px;
}

.vCardTitle .eventDate > * {
  font-size: 15px;
  color: gray;
  display: flex;
  align-items: center;
}

.color {
  width: 20px;
  height: 20px;
  border-radius: 15%;
  margin-right: 10px;
}

.declared {
  background-color: rgba(81, 97, 247, 0.9);
}

.done {
  background-color: rgba(139, 243, 148, 0.9);
}

.processing {
  background-color: rgba(241, 136, 245, 0.9);
}

.vContainer {
  margin-left: 0px !important;
}
</style>