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
  <v-dialog v-model="showDialog" persistent max-width="450">
    <v-card v-if="itemSelected">
      <v-card-title class="vCardTitle">
        <span class="titleText" :title="itemSelected.name">{{
          itemSelected.name
        }}</span>
        <v-btn flat icon @click="closeEventDialog">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="vCartContainer">
        <div class="messageEmpty" v-if="messagesSended.length === 0">
          No comment
        </div>

        <div class="commentContainer" v-if="messagesSended.length > 0">
          <message-item
            v-for="(m, index) in messagesSended"
            :key="index"
            :time="m.date"
            :owner="getMessageOwner(m.userId)"
            :content="m.message"
          ></message-item>
        </div>

        <div class="commentInput">
          <v-textarea
            outline
            placeholder="your comment..."
            v-model="message"
            height="50"
            append-icon="send"
            @click:append="sendMessage"
            no-resize
            name="message"
          ></v-textarea>
        </div>
      </v-card-text>

      <!-- <v-card-actions class="cardActions">
        <v-btn flat
               @click="closeEventDialog"
               class="closeBtn">close</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
import messageItem from "./messageItem.vue";
import spinalBackend from "../../../services/spinalBackend";

export default {
  name: "commentDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    itemSelected: {
      type: Object
    }
  },
  components: {
    "message-item": messageItem
  },
  mounted() {
    spinalBackend.calendarService.getAllUser().then(res => {
      this.users = res;
    });
  },
  data() {
    return {
      message: "",
      messagesSended: [],
      users: []
    };
  },
  methods: {
    closeEventDialog() {
      this.$emit("close");
    },
    sendMessage() {
      if (this.message && this.message.trim().length > 0) {
        spinalBackend.calendarService
          .sendMessage(this.itemSelected.id, this.message.trim())
          .then(() => {
            this.getMessage();
            this.message = "";
          });
      }
    },
    getMessage() {
      if (this.itemSelected) {
        spinalBackend.calendarService
          .getMessage(this.itemSelected.id)
          .then(messages => {
            this.messagesSended = messages;
          });
      }
    },
    getMessageOwner(userId) {
      let found = this.users.find(el => el.id == userId);

      return found ? found.name : "anonyme";
    }
  },
  watch: {
    itemSelected() {
      this.getMessage();
    },
    showDialog() {
      if (this.showDialog) {
        setTimeout(() => {
          let commentContainer = document.getElementsByClassName(
            "commentContainer"
          )[0];

          if (commentContainer) {
            commentContainer.scrollTop = commentContainer.scrollHeight;
          }
        }, 500);
      }
    }
  }
};
</script>

<style scoped>
/* .cardActions {
  justify-content: flex-end;
}

.closeBtn {
  color: red;
} */

.vCardTitle {
  width: 100%;
  justify-content: space-between;
  font-size: 1.3em;
  font-weight: bold;
}

.vCardTitle .titleText {
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vCartContainer {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vCartContainer .commentContainer {
  width: 100%;
  height: 88%;
  overflow: hidden;
  overflow-y: auto;
}

.vCartContainer .messageEmpty {
  width: 100%;
  height: 88%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vCartContainer .commentInput {
  width: 100%;
  height: 10%;
}
</style>

<style>
.v-dialog {
  overflow: hidden;
}

.vCartContainer
  .commentInput
  .v-textarea.v-text-field--box
  .v-text-field__prefix,
.v-textarea.v-text-field--box textarea,
.v-textarea.v-text-field--enclosed .v-text-field__prefix,
.v-textarea.v-text-field--enclosed textarea {
  margin-top: 0px;
}

.vCartContainer
  .commentInput
  .v-text-field.v-text-field--enclosed
  .v-input__append-inner,
.v-text-field.v-text-field--enclosed .v-input__append-outer,
.v-text-field.v-text-field--enclosed .v-input__prepend-inner,
.v-text-field.v-text-field--enclosed .v-input__prepend-outer {
  padding-left: 20px;
}
</style>
