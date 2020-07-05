<template>
<div class="room" :class="{showpad}">
    <div id="meet"/>
    <iframe v-show="showpad" id="pad" :src="'//etherpad.wikimedia.org/p/'+$route.params.name" frameBorder="0"/>
    <div id="toggler" @click="togglePad">NOTE 
        <b-icon-arrow-down v-if="showpad"/>
        <b-icon-arrow-up v-if="!showpad"/>
    </div>
</div>
</template>

<script>

import ReconnectingWebSocket from 'reconnecting-websocket';

import Vue from 'vue'

export default {
    props: [],
    data() {
        return {
            number: this.$route.params.number,
            cid: null, //will use jitsi client id
            wss: null, //websocket server connection
            api: null, //jitsi api
            timer: null, //for keepalive

            showpad: true,
        }
    },
    mounted() {
        this.api = new JitsiMeetExternalAPI("meet.jit.si", {
            roomName: this.$route.params.name,
            parentNode: document.querySelector('#meet'),
        })
        this.api.addEventListener("videoConferenceJoined", e=>{
            this.cid = "datalad."+e.id; //let's use jitsi generated id

            this.wss = new ReconnectingWebSocket("wss://dev1.soichi.us/ohbm2020/");
            this.wss.onopen = () => {
                this.sendCount();
                this.timer = setInterval(this.sendCount, 1000*30);
            }
        });

        this.api.addEventListener("readyToClose", this.sendClose);
        window.addEventListener("beforeunload", this.sendClose);
    },
    methods: {
        togglePad() {
            this.showpad = !this.showpad;
        },
        sendCount() {
            let realCount = this.api.getNumberOfParticipants();
            //console.log(this.number, this.cid, "current participants", realCount);
            this.wss.send(JSON.stringify({
                action: "jit", 
                id: this.number, 
                cid: this.cid, 
                realCount,
            }));
        },

        sendClose() {
            clearInterval(this.timer);
            this.wss.send(JSON.stringify({
                action: "jitclose", 
                id: this.number, 
                cid: this.cid,
            }));
        },
    },

}

</script>

<style scoped>
.room {
    height: 100%;
}
#meet {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
#pad {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 375px;
    height: 100%;
    z-index: 3;
    background-color: gray;
}
#toggler {
    font-size: 95%;
    position: fixed;
    transform: rotate(-90deg);
    padding: 2px 10px;
    background-color: #eee;
    top: 150px;
    z-index: 2;
    box-shadow: 0 0 3px #0003;
    right: -30px;
    font-weight: bold;
}
#toggler:hover {
    background-color: white;
    cursor: pointer;
}
.showpad #meet {
    right: 375px;
}
.showpad #toggler {
    right: 347px;
}

@media screen and (max-width: 600px) {
    #toggler,
    #pad {
        display: none;
    }
    .showpad #meet,
    #meet {
        right: 0;
    }
}
</style>
