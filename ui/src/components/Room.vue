<template>
<div class="room">
    <div id="meet"/>
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
        }
    },
    mounted() {
        this.api = new JitsiMeetExternalAPI("meet.jit.si", {
            roomName: this.$route.params.name,
            parentNode: document.querySelector('#meet'),
        })
        this.api.addEventListener("videoConferenceJoined", e=>{
            console.log("videoConferenceJoined .. starting keepalive");
            console.dir(e);
            this.cid = "datalad."+e.id; //let's use jitsi generated id

            this.wss = new ReconnectingWebSocket("wss://dev1.soichi.us/ohbm2020/");
            this.wss.onopen = () => {
                this.sendCount();
                this.timer = setInterval(this.sendCount, 1000*30);
            }
        });

        this.api.addEventListener("videoConferenceLeft", this.sendClose);
        window.addEventListener("beforeunload", this.sendClose);
    },
    methods: {
        sendCount() {
            let realCount = this.api.getNumberOfParticipants();
            console.log(this.number, this.cid, "current participants", realCount);
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
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
#meet {
    height: 100%;
}
</style>
