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
    mounted() {
        let id = this.$route.params.number;
        let roomName = this.$route.params.name;
        let cid;// = Math.random().toString(); //client id

        let timer; //polling
        let wss;

        if(!roomName) alert("no room name set in hash");
        const api = new JitsiMeetExternalAPI("meet.jit.si", {
            roomName,
            parentNode: document.querySelector('#meet')
        })
        api.addEventListener("videoConferenceJoined", e=>{
            console.log("videoConferenceJoined .. starting keepalive");
            console.dir(e);
            cid = "datalad."+e.id; //let's use jitsi generated id
            wss = new ReconnectingWebSocket("wss://dev1.soichi.us/ohbm2020/");
            wss.onopen = () => {
                wss.send(JSON.stringify({action: "jit", id, cid}));
                timer = setInterval(()=>{
                    let people = api.getNumberOfParticipants(); //TODO - maybe we should report this?
                    console.log(id, cid, "current participants", people);
                    wss.send(JSON.stringify({action: "jit", id, cid}));
                }, 1000*30);
            }
        });
        function sendClose() {
            clearInterval(timer);
            wss.send(JSON.stringify({action: "jitclose", id, cid}));
        }

        //we *really* want the counter to go down!
        api.addEventListener("videoConferenceLeft", e=>{
            this.close();
        });
        api.addEventListener("readyToClose", ()=>{
            this.close();
        });
        window.addEventListener("beforeunload", function(evt) {
            this.close();
        });
    },
    methods: {
    },
    data() {
        return {
        }
    }
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
