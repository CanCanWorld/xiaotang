<script setup lang="ts">

import {onMounted, ref} from "vue";
import {msgApi} from "./common/network";
import {message} from "ant-design-vue";
import logo from './assets/logo.jpg'
import me from './assets/me.jpg'
import error from './assets/error.png'
import {MessageType} from "ant-design-vue/es/message";

const msg = ref('')
const chats = ref<{ msg: string, isQ: boolean, isError?: boolean }[]>([])
const loading = ref(false)
let hide: MessageType

const onRetry = (text: string) => {
    if (loading.value) {
        return
    }
    const index = chats.value.push({
        msg: text,
        isQ: true,
    })
    console.log(index)
    getMsg(index - 1)
    loading.value = true
    hide = message.loading('加载中...', 0)
}

const onAskClick = () => {
    if (loading.value) {
        return
    }
    if (msg.value == '') {
        message.warning('请输入问题！');
        return
    }
    const index = chats.value.push({
        msg: msg.value,
        isQ: true,
    })
    console.log(index)
    getMsg(index - 1)
    msg.value = ''
    loading.value = true
    hide = message.loading('加载中...', 0)
}

const getMsg = async (index: number) => {
    if (loading.value) {
        return
    }
    const question = chats.value[index].msg.replace(/\s/g, "")
    msgApi(question).then((res) => {
        console.log(res.data)
        chats.value.push({
            msg: res.data,
            isQ: false
        })
        hide()
        loading.value = false
    }).catch(() => {
        message.error('请求超时')
        hide()
        loading.value = false
        chats.value[index].isError = true
    })
}

onMounted(() => {
})
</script>
<template>
    <div class="chats">
        <!-- 开发分支代码1 -->
        <TransitionGroup name="list">
            <div class="chat" v-for="(item, index) in chats" :key="index">
                <div class="question" v-if="item.isQ">
                    <img v-if="item.isError" width="30" height="30" :src="error" alt="" @click="onRetry(item.msg)">
                    <div class="msg">
                        {{ item.msg }}
                    </div>
                    <img class="face" :src="me" alt=""/>
                </div>
                <div class="answer" v-else>
                    <img class="face" :src="logo" alt=""/>
                    <div class="right">
                        猫娘小糖：
                        <div class="msg">
                            {{ item.msg }}
                        </div>
                    </div>
                </div>
            </div>
        </TransitionGroup>
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
    height: 100vh;
    padding-bottom: 100px;
    overflow: auto;

    .chat {
        padding: 10px;

        .question {
            color: #313131;
            display: flex;
            justify-content: right;
            align-items: center;
            gap: 10px;
            font-size: 16px;

            .face {
                border-radius: 40px;
                width: 40px;
                height: 40px;
            }

            .msg {
                max-width: 90%;
                padding: 10px;
                min-width: 60px;
                border-radius: 10px;
                border: #e7edf1 solid 2px;
                background-color: rgba(231, 237, 241, 0.7);
                backdrop-filter: blur(2px)
            }

        }

        .answer {
            color: #313131;
            display: flex;
            gap: 10px;
            font-size: 16px;

            .face {
                border-radius: 40px;
                width: 40px;
                height: 40px;
            }

            .right {
                display: flex;
                flex-direction: column;
                gap: 3px;

                .msg {
                    max-width: 90%;
                    padding: 10px;
                    min-width: 60px;
                    border-radius: 10px;
                    border: #e7edf1 solid 2px;
                    background-color: rgba(235, 221, 248, 0.7);
                    backdrop-filter: blur(2px)
                }
            }
        }
    }
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.message-box {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 20px;
    gap: 10px;
}
</style>
