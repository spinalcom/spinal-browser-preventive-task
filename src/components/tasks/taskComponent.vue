<template>
  <div>
    <div class="header">

      <v-btn class="goBackBtn ma-2"
             flat
             @click="goBack">
        back

      </v-btn>

      <div class="name">
        {{eventSelected.title}}
      </div>

    </div>

    <v-list two-line>
      <v-list-tile v-for="(task,index) in tasks"
                   :key="index">
        <v-list-tile-content>
          <v-list-tile-title>{{task.name}}</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-checkbox color="primary"
                      v-model="task.done"
                      @change="validItem(task)"></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-action>
          <v-icon>chat</v-icon>
        </v-list-tile-action>

      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import utilities from "../../config/utilities";

export default {
  name: "taskComponent",
  props: ["eventSelected", "allData", "itemSelectedInSidebar"],
  data() {
    return {
      tasks: []
    };
  },
  created() {
    utilities.getEventTasks(this.eventSelected.eventId).then(tasks => {
      this.tasks = tasks;
    });
  },
  methods: {
    goBack() {
      this.$emit("goback");
    },
    validItem(item) {
      // let allEventsId = [];

      // let context = this.allData.find(
      //   el => el.id === this.eventSelected.visitid
      // );

      // console.log("context", context);

      // if (typeof context !== "undefined") {
      //   let groupFound = context.groups.find(el => el.id === item.groupId);
      //   if (typeof groupFound !== "undefined") {
      //     console.log("groupFound", groupFound);
      //     allEventsId =
      //   }
      // }

      utilities.validateTask(
        this.itemSelectedInSidebar.visitId,
        item.id,
        item.groupId,
        item.eventId
      );
    }
  }
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 70px;
  margin-bottom: 10px;
  display: flex;
  background-color: gray;
  align-items: center;
}

.goBackBtn {
  background-color: transparent;
  border: 1px solid black;
}

.name {
  font-size: 18px;
  text-transform: capitalize;
  font-weight: bold;
}
</style>