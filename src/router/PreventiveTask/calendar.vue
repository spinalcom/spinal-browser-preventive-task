<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="container-fluid">
    <app-container class="dataViewDisplay"
                   :allData="calendarData"
                   :itemSelected="calendarItemSelected"
                   @reload="reloadAllData"
                   @selectItem="selectItem"></app-container>
  </div>
</template>

<script>
import Vue from "vue";

import appContainer from "../../compoments/content/container/container.vue";

// import dataService from "./config/data";

import spinalBackend from "../../services/spinalBackend";

export default Vue.extend({
  data() {
    return {
      digitaltwinName: "",
      calendarData: null,
      sidebarData: null,
      calendarItemSelected: null,
      floorSelected: null,
      bindObj: []
    };
  },
  components: {
    "app-container": appContainer
  },
  created() {
    // setTimeout(() => {
    //   this.bindAllData();
    // }, 3000);

    spinalBackend.calendarService.getAllData().then(allData => {
      this.digitaltwinName = spinalBackend.calendarService.getDigiDigitaltwinName();
      this.calendarData = allData;
    });
  },
  methods: {
    //////////////////////////////////////////////////////////////////
    //                     calendar Data                            //
    //////////////////////////////////////////////////////////////////

    selectItem(res) {
      this.calendarItemSelected = res;
    },

    reloadAllData() {
      spinalBackend.calendarService.getAllData().then(allData => {
        this.calendarData = allData;
      });
    }

    //////////////////////////////////////////////////////////////////
    //                      SIDEBAR                                 //
    //////////////////////////////////////////////////////////////////

    // bindAllData() {
    //   let self = this;
    //   this.bindObj.push(dataService.ContextNode);
    //   this.bindObj.push(
    //     dataService.ContextNode.bind(function() {
    //       self.refreshBind();
    //       dataService.getAllData().then(allData => {
    //         self.updateData(allData);
    //       });
    //     }, false)
    //   );

    //   for (var ProcessNode in dataService.ProcessNodes) {
    //     this.bindObj.push(dataService.ProcessNodes[ProcessNode]);
    //     this.bindObj.push(
    //       dataService.ProcessNodes[ProcessNode].bind(function() {
    //         self.refreshBind();
    //         dataService.getAllData().then(allData => {
    //           self.updateData(allData);
    //         });
    //       }, false)
    //     );
    //   }

    //   for (var Node in dataService.StepsNodes) {
    //     this.bindObj.push(dataService.StepsNodes[Node]);
    //     this.bindObj.push(
    //       dataService.StepsNodes[Node].bind(function() {
    //         self.refreshBind();
    //         dataService.getAllData().then(allData => {
    //           self.updateData(allData);
    //         });
    //       }, false)
    //     );
    //   }

    //   setTimeout(function() {
    //     //     console.log("binobj = ", self.bindObj);
    //   }, 2000);
    // },
    // refreshBind() {
    //   let iterator = 0;

    //   while (iterator > this.bindObj.length) {
    //     this.bindObj[iterator].unbind(this.bindObj[iterator + 1]);
    //     iterator = iterator + 2;
    //   }
    // },
    // updateData(data) {
    //   let self = this;
    //   setTimeout(function() {
    //     self.sidebarData = data;
    //     self.bindAllData();
    //   }, 500);
    //   //EventBus.$emit("test", data);
    // },
    // onCollapsed(value) {
    //   this.collapseMenu = value;
    // },

    // selecFloor(id) {
    //   let self = this;
    //   this.sidebarData.floors.forEach(function(el) {
    //     if (el.id === id) {
    //       self.floorSelected = el.name;
    //     }
    //   });
    // }
  }
});
</script>

<style scoped>
.container-fluid {
  width: 100%;
  height: 100%;
}

/* .roomcontext {
  position: absolute;
  margin-left: 11%;
  width: calc(16%);
} 
.container-fluid {
  width: 100%;
  height: 100%;

}
.main-content {
  width: 100%;
  height: calc(100% - 64px);
  overflow: hidden;
  position: relative;
  display: flex;
}
.sidebarContext-display {
  height: 100%;
  width: 191px;
}
.app-viewer-display {
  height: 100%;
  width: 50%;
}
.dataViewDisplay {
  background-color: rgba(1, 2, 1, 0);
  width: 50%;
  height: 100%;
  position: relative;
}
@media screen and (max-width: 992px) {
  .app-viewer-display {
    height: 50%;
    width: 100%;
  }
  .dataViewDisplay {
    width: 100%;
    height: 50%;
  }
}
.view-container {
  width: calc(100% - 191px);
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.view-container,
.view-container > * {
  transition: 500ms all cubic-bezier(0.075, 0.82, 0.165, 1);
} */
</style>
