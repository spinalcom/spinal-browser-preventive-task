<template>
  <div class="taskContainer">

    <comment-dialog :showDialog="showCommentDialog"
                    :itemSelected="itemSelected"
                    @close="closeCommentDialog"></comment-dialog>

    <div class="header">
      <div class="backButton">
        <v-btn class="goBackBtn ma-2"
               flat
               @click="goBack">
          back

        </v-btn>
      </div>

      <div class="name">
        {{eventSelected.title}}
      </div>

      <div class="othersButtons"
           @click="seeOrHideColor">
        <v-btn flat
               icon>
          <v-icon>
            {{ itemColored ? 'visibility_off' : 'remove_red_eye' }}
          </v-icon>
        </v-btn>
      </div>

    </div>

    <div class="taskListContainer">
      <v-list two-line>
        <v-list-tile v-for="(task,index) in tasks"
                     :key="index"
                     @click="OnItemClick(task)">

          <v-list-tile-content>
            <v-list-tile-title>{{task.name}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-checkbox v-model="task.done"
                        @change="validItem(task)"></v-checkbox>
          </v-list-tile-action>

          <v-list-tile-action>
            <!-- <v-icon>chat</v-icon> -->
            <v-btn @click.stop="openCommentDialog(task)"
                   flat
                   icon>
              <v-icon>chat</v-icon>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>
      </v-list>
    </div>

  </div>
</template>

<script>
import utilities from "../../js/utilities";
import commentDialog from "../commentDialog/commentDialog.vue";

export default {
  name: "taskComponent",
  props: ["eventSelected", "allData", "itemSelectedInSidebar"],
  components: {
    "comment-dialog": commentDialog
  },
  data() {
    return {
      tasks: [],
      itemColored: false,
      showCommentDialog: false,
      itemSelected: null
    };
  },
  created() {
    utilities.getEventTasks(this.eventSelected.eventId).then(tasks => {
      this.tasks = tasks;

      this.ExecuteSomethingOnBimObject(this.tasks, (model, ids) => {
        window.spinal.SpinalForgeViewer.viewerManager.viewer.isolate(
          ids,
          model
        );

        window.spinal.SpinalForgeViewer.viewerManager.viewer.fitToView(
          ids,
          model
        );
      });
    });
  },
  methods: {
    ExecuteSomethingOnBimObject(bimObjects, callback) {
      bimObjects = this.getModelsAndBimObjects(bimObjects);
      bimObjects.forEach(el => {
        let model =
          window.spinal.BimObjectService.mappingBimFileIdModelId[el.bimFileId];

        for (let j = 0; j < model.modelScene.length; j++) {
          const scene = model.modelScene[j];

          callback(scene.model, el.selection);
        }
      });
    },

    getModelsAndBimObjects(tasks) {
      let data = [];
      tasks.forEach(task => {
        let found = data.find(el => el.bimFileId === task.bimFileId);

        if (typeof found !== "undefined") {
          found.selection.push(task.dbId);
        } else {
          data.push({
            bimFileId: task.bimFileId,
            selection: [task.dbId]
          });
        }
      });

      return data;
    },

    goBack() {
      window.spinal.SpinalForgeViewer.viewerManager.viewer.showAll();
      this.clearThemingColor();
      this.$emit("goback");
    },
    validItem(item) {
      utilities
        .validateTask(
          this.itemSelectedInSidebar.visitId,
          item.id,
          item.groupId,
          item.eventId
        )
        .then(() => {
          if (this.itemColored) {
            this.SeeSateInViewer();
          }
          this.$emit("reload");
        });
    },

    OnItemClick(task) {
      let model =
        window.spinal.BimObjectService.mappingBimFileIdModelId[task.bimFileId];

      let itemsToFit = [];

      for (let j = 0; j < model.modelScene.length; j++) {
        const scene = model.modelScene[j];
        itemsToFit.push({
          model: scene.model,
          selection: [task.dbId]
        });
        scene.model.selector.setSelection([task.dbId], "selectOnly");
      }

      window.spinal.SpinalForgeViewer.viewerManager.viewer.fitToView(
        itemsToFit
      );
    },

    seeOrHideColor() {
      window.spinal.SpinalForgeViewer.viewerManager.viewer.fitToView();

      if (!this.itemColored) {
        let itemsToFit = this.SeeSateInViewer();

        // this.ExecuteSomethingOnBimObject(itemsToFit, (model, selection) => {
        //   console.log("model,selection", model, selection);
        // });

        window.spinal.SpinalForgeViewer.viewerManager.viewer.fitToView(
          itemsToFit
        );
      } else {
        this.clearThemingColor();
      }
    },

    clearThemingColor() {
      let modelsObj = window.spinal.BimObjectService.mappingBimFileIdModelId;
      let models = [];

      for (const key in modelsObj) {
        if (modelsObj.hasOwnProperty(key)) {
          const modelScene = modelsObj[key].modelScene;
          for (const modelIterator of modelScene) {
            models.push(modelIterator.model);
          }
        }
      }

      models.forEach(model => {
        window.spinal.SpinalForgeViewer.viewerManager.viewer.clearThemingColors(
          model
        );
      });

      this.itemColored = false;
    },

    SeeSateInViewer() {
      this.clearThemingColor();

      let itemToFit = [];

      let itemsDone = this.tasks.filter(el => el.done);
      let itemNotDone = this.tasks.filter(el => !el.done);

      let itemDoneColor = new THREE.Vector4(0, 255 / 255, 0, 1);
      let itemNotDoneColor = new THREE.Vector4(255 / 255, 0, 0, 1);

      itemToFit.push(
        ...this._colorItems(itemsDone, itemDoneColor),
        ...this._colorItems(itemNotDone, itemNotDoneColor)
      );

      this.itemColored = true;
      return itemToFit;
    },

    _colorItems(items, color) {
      let itemToFit = [];

      items.forEach(item => {
        let model =
          window.spinal.BimObjectService.mappingBimFileIdModelId[
            item.bimFileId
          ];

        for (let j = 0; j < model.modelScene.length; j++) {
          const scene = model.modelScene[j];

          window.spinal.SpinalForgeViewer.viewerManager.viewer.setThemingColor(
            item.dbId,
            color,
            scene.model
          );

          itemToFit.push({
            model: scene.model,
            selection: [item.dbId]
          });
        }
      });

      return itemToFit;
    },

    openCommentDialog(task) {
      this.showCommentDialog = true;
      this.itemSelected = task;
    },

    closeCommentDialog() {
      this.showCommentDialog = false;
    }
  },

  destroyed() {
    window.spinal.SpinalForgeViewer.viewerManager.viewer.showAll();
    window.spinal.SpinalForgeViewer.viewerManager.viewer.fitToView();
    this.clearThemingColor();
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
  justify-content: space-between;
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

.taskContainer {
  width: 100%;
  height: 100%;
}

.taskListContainer {
  height: calc(100% - 80px);
  overflow: hidden;
  overflow-y: auto;
}
</style>