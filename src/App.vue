<script setup lang="ts">

import {onMounted, ref} from "vue";
import {msgApi} from "./common/network";
import {message} from "ant-design-vue";
import logo from './assets/logo.jpg'
import {MessageType} from "ant-design-vue/es/message";

const msg = ref('')
const chats = ref<{ msg: string, isQ: boolean }[]>([])
const loading = ref(false)
let hide: MessageType


const onAskClick = () => {
  if (loading.value) {
    return
  }
  if (msg.value == '') {
    message.warning('请输入问题！');
    return
  }
  chats.value.push({
    msg: msg.value,
    isQ: true
  })
  getMsg(msg.value.replace(/\s/g, ""))
  msg.value = ''
  loading.value = true
  hide = message.loading('加载中...', 0);
}

const getMsg = async (question: string) => {
  if (loading.value) {
    return
  }
  const res = await msgApi(question)
  console.log(res.data)
  chats.value.push({
    msg: res.data,
    isQ: false
  })
  hide()
  loading.value = false
}

onMounted(() => {
})
</script>
<template>
  <div class="chats">
    <div class="chat" v-for="(item, index) in chats" :key="index">
      <div class="question" v-if="item.isQ">
        <div class="header">
          俺：
        </div>
        {{ item.msg }}
      </div>
      <div class="answer" v-else>
        <div class="header">
          <img class="face" :src="logo" alt=""/>
          猫娘小糖：
        </div>
        {{ item.msg }}
      </div>
    </div>
  </div>
  <a-affix offset-bottom="0">
    <a-flex class="message-box" :vertical="false">
      <a-input
          class="input"
          allow-clear
          @pressEnter="onAskClick"
          v-model:value="msg"
          placeholder="请输入提问信息"/>
      <a-button class="button" @click="onAskClick" :loading="loading">提问</a-button>
    </a-flex>
  </a-affix>
</template>

<style scoped>

.chats {
  padding-bottom: 100px;

  .chat {
    padding: 10px;

    .question {
      padding: 20px;
      border-radius: 30px;
      border: #e7edf1 solid 2px;

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: #505050;
      }
    }

    .answer {
      padding: 20px;
      border-radius: 30px;
      background-color: #e7edf1;

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: #505050;

        .face {
          border-radius: 40px;
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}

.message-box {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 20px;
  gap: 10px;
}
</style>
