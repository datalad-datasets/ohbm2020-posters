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
            timer: null, //for keepalive
        }
    },
    mounted() {
        const api = new JitsiMeetExternalAPI("meet.jit.si", {
            roomName: this.$route.params.name,
            parentNode: document.querySelector('#meet'),
        })
        api.addEventListener("videoConferenceJoined", e=>{
            console.log("videoConferenceJoined .. starting keepalive");
            console.dir(e);
            this.cid = "datalad."+e.id; //let's use jitsi generated id

            this.wss = new ReconnectingWebSocket("wss://dev1.soichi.us/ohbm2020/");
            this.wss.onopen = () => {
                this.wss.send(JSON.stringify({action: "jit", id: this.number, cid: this.cid}));
                this.timer = setInterval(()=>{
                    let people = api.getNumberOfParticipants(); //TODO - maybe we should report this?
                    console.log(this.number, this.cid, "current participants", people);
                    this.wss.send(JSON.stringify({action: "jit", id: this.number, cid: this.cid}));
                }, 1000*30);
            }
        });
        function sendClose() {
        }

        //we *really* want the counter to go down!
        api.addEventListener("videoConferenceLeft", this.sendClose);
        api.addEventListener("readyToClose", this.sendClose);
        window.addEventListener("beforeunload", this.sendClose);
    },
    methods: {
        sendClose() {
            console.log("closing!");
            clearInterval(this.timer);
            this.wss.send(JSON.stringify({action: "jitclose", id: this.number, cid: this.cid}));
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
